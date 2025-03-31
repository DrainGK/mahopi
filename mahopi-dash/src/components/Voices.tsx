import React, { useEffect, useState } from 'react';
import useVoiceStore, { Voice } from '../useVoiceStore';
import { supabase } from '../supabaseClient';

const Voices: React.FC = () => {
  const [audio, setAudio] = useState<Voice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<{ id: string, name: string }[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

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
    <div>
      {profiles.map(profile => (
        <button
          key={profile.id}
          onClick={() => setSelectedUserId(profile.id)}
          style={{ marginRight: '10px' }}
        >
          {profile.name}
        </button>
      ))}

      <ul>
        {filteredAudio.map(voice => (
          <li key={voice.id}>
            <strong>{voice.title}</strong> - {voice.file_url}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Voices;
