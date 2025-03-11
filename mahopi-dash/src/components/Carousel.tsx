import React, { useState } from 'react';
import { motion } from "framer-motion";

const images_Data = [
  {
    src: "https://images.unsplash.com/photo-1741334632363-58022899ce91?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3",
    id: 1,
  },
  {
    src: "https://plus.unsplash.com/premium_photo-1738854511313-799f13b4d3ff?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3",
    id: 2,
  },
  {
    src: "https://images.unsplash.com/photo-1737044263770-9ddf6c5654c4?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
    id: 3,
  },
  {
    src: "https://images.unsplash.com/photo-1741091756497-10c964acc4f6?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    id: 5,
  },
  {
    src: "https://images.unsplash.com/photo-1735480222193-3fe22ffd70b6?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    id: 6,
  },
  {
    src: "https://images.unsplash.com/photo-1741367658528-8134fab3b67d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    id: 7,
  },
  {
    src: "https://images.unsplash.com/photo-1741298856762-1ff2f1204bc8?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    id: 8,
  },
];

const Carousel: React.FC = () => {
  const [images, setImages] = useState(images_Data);

  // Fonction de défilement du carousel.
  function handleCarousel(position: number) {
    const copy = [...images];
    if (position > 0) {
      for (let i = position; i > 0; i--) {
        const firstEl = copy.shift();
        if (!firstEl) return;
        copy.push(firstEl);
      }
    } else if (position < 0) {
      for (let i = position; i < 0; i++) {
        const lastEl = copy.pop();
        if (!lastEl) return;
        copy.unshift(lastEl);
      }
    }
    setImages(copy);
  }

  // Réorganisation pour que la carte active (images[0]) soit affichée au centre.
  // Pour 5 cartes, l'index central sera mid (dans ce cas 2).

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-between">
      {images.slice(0, 5).map((img, i) => {
        const relativeIndex = i - 2; // La carte active aura relativeIndex === 0
        // Décalage horizontal (exemple : 300px par carte)
        const x = relativeIndex * 350;
        // Décalage vertical pour les cartes autour de la carte active
        const distance = Math.abs(relativeIndex);
        let y = 0;
        if (distance === 1) y = 60;
        else if (distance === 2) y = 150;

        // Style spécifique pour la carte active
        const rotation = relativeIndex * 5;

        return (
          <div
            key={img.id}
            className="h-1/2 absolute pointer-events-auto"
            style={{ zIndex: relativeIndex === 0 ? 10 : 5 }}
          >
            <motion.div
                className="rounded-xl h-[400px] w-[300px] bg-[size:110%] hover:bg-[size:115%] hover:cursor-pointer transition-[background-size] duration-200"
                initial={{ opacity: 0 }}
                animate={{ x, y, rotate: rotation, opacity: 1 }}
                transition={{
                    x: { type: "spring", mass: 2, stiffness: 400, damping: 30 },
                    y: { type: "spring", mass: 2, stiffness: 400, damping: 30 },
                    rotate: { type: "spring", mass: 2, stiffness: 400, damping: 30 },
                    opacity: { delay: 0.3, duration: 0.1 }
                }}
                style={{
                    backgroundImage: `url(${img.src})`,
                    backgroundPosition: "center",
                }}
                onClick={()=>console.log("click")
                }
            />
            
          </div>
            );
        })}
        <button
        onClick={() => handleCarousel(-1)}
        className="absolute left-4 text-white font-bold text-6xl border-2 hover:text-amber-500 hover:border-amber-500 z-20"
      >
        ←
      </button>
      <button
        onClick={() => handleCarousel(1)}
        className="absolute right-4 text-white font-bold text-6xl border-2 hover:text-amber-500 hover:border-amber-500 z-20"
      >
        →
      </button>
        </div>
  );
};

export default Carousel;
