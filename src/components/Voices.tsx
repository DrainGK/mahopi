import React, { useEffect, useState } from 'react';
import useVoiceStore, { Voice } from '../useVoiceStore';
import { supabase } from '../supabaseClient';
import VoiceButton from './VoiceButton';
import useUserStore from '../UseUserStore';

const Voices: React.FC = () => {
  const { user } = useUserStore();
  const [audio, setAudio] = useState<Voice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<{ id: string, name: string }[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(user.id);

  const { voices } = useVoiceStore();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      // 1. Fetch audio data
      const { data: audioData, error: audioError } = await supabase
        .from('audios')
        .select('id, file_url, user_id, title')
        .order('id', { ascending: true });

      if (audioError) {
        console.error('Error while fetching voices:', audioError);
        setError('Error while fetching all voices');
        setLoading(false);
        return;
      }

      setAudio(audioData || []);

      // 2. Get unique user_ids
      const userIds = [...new Set((audioData || []).map(item => item.user_id))];

      console.log(userIds);
      

      // 3. Fetch profiles
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', userIds);

      if (profileError) {
        console.error('Error while fetching profiles:', profileError);
      } else {
        setProfiles(profileData || []);
      }

      setLoading(false);
    };

    console.log(profiles);
    console.log(audio);
    
    

    fetchData();
  }, [voices]);

  const filteredAudio = selectedUserId
    ? audio.filter(item => item.user_id === selectedUserId)
    : audio;

  return (
    <div className='font-Cherry w-full flex flex-col items-center mb-10'>

        <h2 className='text-7xl text-zinc-900 mb-20'>きこえる？</h2>

        <div className='text-5xl flex gap-x-4 mb-10'>
           { error &&(
            <p className='text-red-600'>{error}</p>
           )}
           { loading &&(
            <p>Loading...</p>
           )}

            {profiles.map(profile => (
                <button
                className={`${profile.id === selectedUserId ? 'bg-pink-400 text-white' : 'bg-white text-pink-400'}  px-6 py-2 rounded-lg  shadow-pink-950/25 shadow-lg cursor-pointer`}
                key={profile.id}
                onClick={() => setSelectedUserId(profile.id)}
                style={{ marginRight: '10px' }}
                >
                {profile.name}
                </button>
            ))}
        </div>

      <ul className='flex flex-1 flex-wrap w-8/10 mx-auto gap-4 justify-center'>
        {filteredAudio.map(voice => (
          <li key={voice.id}>
            <VoiceButton file_url={voice.file_url} title={voice.title} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Voices;
