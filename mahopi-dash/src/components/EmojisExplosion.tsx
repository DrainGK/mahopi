import React, { useState} from 'react';

interface ExplosionProps {
    emojis: string[];
}

interface EmojiProps {
    emoji: string;
}

const Emoji: React.FC<EmojiProps> = ({ emoji }) => {
    return (
        <span 
            className="absolute text-2xl"
            style={{
                animation: `explode 2s ease-out forwards`,
                '--tw-translate-x': `${(Math.random() * 2 - 1) * 500}%`,
                '--tw-translate-y': `${(Math.random() * 2 - 1) * 300}%`,
            } as React.CSSProperties}
        >
            {emoji}
        </span>
    );
}

const EmojisExplosion: React.FC<ExplosionProps> = ({ emojis }) => {
    const [animKey, setAnimKey] = useState(0); // Clé pour forcer le re-render
    const [isCliked, setIsClicked] = useState<boolean>(false);

    const handleClick = () => {
        setAnimKey(prev => prev + 1);
    };

    return (
        <div className="relative z-10">
            <button 
                onClick={handleClick}
                onMouseDown={()=>setIsClicked(false)}
                onMouseUp={()=>setIsClicked(true)}
                className={`relative z-10 bg-blue-500 w-fit px-10 py-2 font-bold text-2xl text-white rounded-lg shadow-lg shadow-black/25 cursor-pointer animate__animated
                    ${isCliked? "animate__rubberBand":""}
                    `}
            >
                💖
            </button>
            <div
                key={animKey} // Clé dynamique
                className="absolute transform translate-x-1/2 inset-0 pointer-events-none" // Aligné avec le bouton
            >
                {emojis.map((emoji, index) => (
                    <Emoji 
                        key={`${emoji}-${index}-${animKey}`} 
                        emoji={emoji} 
                    />
                ))}
            </div>
        </div>
    );
}

export default EmojisExplosion;
