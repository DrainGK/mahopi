import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Heart, CircleSmall, X } from "lucide-react"

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

const LG_SIZE ={
  cardH: 400,
  cardW: 300,
  xOffset: 350,
  icon: 36,
}

const SM_SIZE ={
  cardH: 350,
  cardW: 250,
  xOffset: 300,
  icon: 24,
}

const Carousel: React.FC = () => {
    const [images, setImages] = useState(images_Data);
    const [activeIndex, setActiveIndex] = useState(0);
    const [carouselSizes, setCarouselSizes] = useState(LG_SIZE);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState("")

  function handleCarousel(position: number) {
    const copy = [...images];
    let newIndex = activeIndex;
    if (position > 0) {
      for (let i = 0; i < position; i++) {
        const first = copy.shift();
        if (first) copy.push(first);
        newIndex = (newIndex + 1) % images.length; // Défilement circulaire
      }
    } else if (position < 0) {
      for (let i = 0; i < -position; i++) {
        const last = copy.pop();
        if (last) copy.unshift(last);
        newIndex = (newIndex - 1 + images.length) % images.length; // Défilement circulaire
      }
    }
    setImages(copy);
    setActiveIndex(newIndex);
  }

  function handleImageClick(src: string){
    setSelectedImage(src);
    setIsOpen(true)
  }

  const indicatorVariants = {
    active: { scale: 1.3, opacity: 1, transition: {  type: "spring", mass: 2, stiffness: 400, damping: 10 } },
    inactive: { scale: 1, opacity: 1, transition: {  duration: 0.3 } },
  };

  useEffect(() => {
    const updateCarouselSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCarouselSizes(matches ? LG_SIZE : SM_SIZE);
    };
  
    updateCarouselSize(); // Appel initial pour définir la taille dès le montage
  
    window.addEventListener("resize", updateCarouselSize);
  
    return () => window.removeEventListener("resize", updateCarouselSize);
  }, []);

  return (
    <div className="relative mt-16 w-full h-screen flex flex-col items-center justify-between">
      {images.slice(0, 5).map((img, i) => {
        const relativeIndex = i - 2; // La carte active aura relativeIndex === 0
        // Décalage horizontal (exemple : 300px par carte)
        const x = relativeIndex * carouselSizes.xOffset;
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
                className="rounded-xl bg-[size:110%] hover:bg-[size:115%] hover:cursor-pointer transition-[background-size] duration-200"
                initial={{ opacity: 0 }}
                animate={{ x, y, rotate: rotation, opacity: 1 }}
                transition={{
                    x: { type: "spring", mass: 2, stiffness: 400, damping: 30 },
                    y: { type: "spring", mass: 2, stiffness: 400, damping: 30 },
                    rotate: { type: "spring", mass: 2, stiffness: 400, damping: 30 },
                    opacity: { delay: 0.3, duration: 0.1 }
                }}
                style={{
                    width: carouselSizes.cardW,
                    height: carouselSizes.cardH,
                    backgroundImage: `url(${img.src})`,
                    backgroundPosition: "center",
                }}
                onClick={()=>handleImageClick(img.src)}
            />
          </div>
            );
        })}
        <div className='absolute w-fit flex justify-between items-center z-5 bottom-1/3'>
            <motion.button
                onClick={() => handleCarousel(-1)}
                className="p-4 rounded-full text-[#FFB8E0] bg-white font-bold text-6xl hover:text-[#EC7FA9]"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
                <ArrowLeft size={carouselSizes.icon} />
            </motion.button>
            <ul className='flex mx-15'>
            {images.map((img, i) => (
            <li key={img.id}>
            <motion.div
              variants={indicatorVariants}
              initial="inactive"
              animate={i === activeIndex ? "active" : ""}
            >
              {i === activeIndex ? (
                <Heart size={carouselSizes.icon} fill="#EC7FA9" strokeWidth={0} />
              ) : (
                <CircleSmall size={carouselSizes.icon} fill="white" strokeWidth={0} />
              )}
            </motion.div>
          </li>
          ))}
            </ul>
            <motion.button
                onClick={() => handleCarousel(1)}
                className="p-4 rounded-full text-[#FFB8E0] bg-white font-bold text-6xl hover:text-[#EC7FA9]"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
                <ArrowRight size={carouselSizes.icon} />
            </motion.button>
        </div>
        <Modal src={selectedImage} isOpen={isOpen} setIsOpen={setIsOpen} heightImg={carouselSizes.cardH} widthImg={carouselSizes.cardW}/>
    </div>
  );

};

const Modal = ({ src , isOpen, setIsOpen, heightImg, widthImg }:{ src: string; isOpen: boolean; setIsOpen:Dispatch<SetStateAction<boolean>>; heightImg: number; widthImg: number}) => {
      return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsOpen(false)}
                    className="backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center cursor-pointer"
                >
                    <motion.div
                        className='relative rounded-xl bg-[size:110%]'
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1.5, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            width: widthImg,
                            height: heightImg,
                            backgroundImage: `url(${src})`,
                            backgroundPosition: "center",
                        }}
                    >
                        <motion.div
                            initial={{  rotate: -45 }}
                            animate={{  rotate: 0 }}
                            whileHover={{ scale: 1.1, rotate: 45 }}
                            transition={{
                                rotate: { type: "spring", mass: 2, stiffness: 400, damping: 10, },
                                scale: { type: "spring", mass: 2, stiffness: 400, damping: 10 },
                            }}
                            className='absolute right-0 translate-x-1/2 translate-y-[-50%] p-2 w-fit rounded-full text-[#FFB8E0] bg-white'
                            onClick={()=>setIsOpen(false)}
                        >
                            <X size={24} strokeWidth={3}/>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
      )
}

export default Carousel;
