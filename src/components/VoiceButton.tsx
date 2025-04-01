import React from 'react';
import useSound from 'use-sound';

interface VoiceButtonProps {
    file_url: string;
    title: string;
  }

const VoiceButton: React.FC<VoiceButtonProps> = ({ file_url, title }) => {
    const [playVoice] = useSound(file_url, { volume: 1 });
  return (
    <button
      className='cursor-pointer text-3xl py-1 px-10 rounded-lg bg-white text-pink-400 shadow-pink-950/25 shadow-lg'
      onClick={()=>{playVoice()}}
    >
      {title}
    </button>
  )
}

export default VoiceButton