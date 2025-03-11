import React, { useState } from 'react';
import useSound from 'use-sound';
import correctSfx from '../assets/soudEffects/correct-answer.mp3';
import wrongSfx from '../assets/soudEffects/wrong-answer.mp3';

interface AnswerType {
    buttonType: string;
}

const AnswerButton: React.FC<AnswerType> = ({buttonType}) => {
    const [activeButton, setActiveButton] = useState<string | null>(null);
    const [playCorrect] = useSound(correctSfx, {volume: 0.1});
    const [playWrong] = useSound(wrongSfx, {volume: 0.1});

    const handleClick=(buttonType:string)=>{   
        setActiveButton(null);    
        if (buttonType === "correct"){ playCorrect()};
        if ( buttonType === "wrong") playWrong() ;
        setActiveButton(buttonType);
        setTimeout(() => setActiveButton(null), 1000);
    }
  return (
    <section className=''>
        <div className={`${buttonType === "correct" ? "bg-green-400" : "bg-orange-400"} w-fit px-10 py-2 font-bold text-2xl text-white rounded-lg shadow-lg shadow-black/25 cursor-pointer
        animate__animated  ${activeButton ==="correct" ? "animate__tada" : "" }  ${activeButton ==="wrong" ? "animate__shakeY animate__fast" : ""}
        `}
            onClick={()=> handleClick( buttonType)}
        >
            {buttonType}
        </div>
    </section>
  )
}

export default AnswerButton