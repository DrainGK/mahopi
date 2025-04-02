import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Heart, CircleSmall, X } from 'lucide-react';
import useImageStore, { Image } from '../useImageStore';
import { supabase } from '../supabaseClient';

const LG_SIZE = {
  cardH: 400,
  cardW: 300,
  xOffset: 350,
  icon: 36,
};

const SM_SIZE = {
  cardH: 350,
  cardW: 261,
  xOffset: 300,
  icon: 24,
};

const Carousel: React.FC = () => {
  const { activeIndex, setActiveIndex, loading, error } = useImageStore();
  let { images } = useImageStore();

  

  const [carouselSizes, setCarouselSizes] = useState(LG_SIZE);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [album, setAlbum] = useState<Image[]>([]);
  const [ isLoading, setIsLoading] = useState(false)
  const [ isError, setIsError] = useState<string | null>(null)

  // Fonction pour gérer la navigation dans le carrousel

  useEffect(() => {
    const fetchAllImages = async () => {
      setIsLoading(true);
      setIsError(null);
      console.log(isError,isLoading);
      

      const { data, error } = await supabase
        .from('photos')
        .select('id, file_url, user_id')
        .order('id', { ascending: true });

      if (error) {
        console.error('Erreur fetchAllImages:', error);
        setIsError('Erreur lors du chargement de toutes les images');
        setIsLoading(false);
        console.log(isError,isLoading);
        return;
      }

      const fetchedAlbum: Image[] = data
        ? data.map((photo: any) => ({
            id: photo.id,
            src: photo.file_url,
            user_id: photo.user_id,
          }))
        : [];

      setAlbum(fetchedAlbum);
      setIsLoading(false);
      console.log(isError,isLoading);
    };

    fetchAllImages();
  }, [images]);

  function handleCarousel(position: number) {
    const copy = [...album];
    let newIndex = activeIndex;
    if (position > 0) {
      for (let i = 0; i < position; i++) {
        const first = copy.shift();
        if (first) copy.push(first);
        newIndex = (newIndex + 1) % album.length; // Défilement circulaire
      }
    } else if (position < 0) {
      for (let i = 0; i < -position; i++) {
        const last = copy.pop();
        if (last) copy.unshift(last);
        newIndex = (newIndex - 1 + album.length) % album.length; // Défilement circulaire
      }
    }
    setAlbum(copy)
    setActiveIndex(newIndex);
  }

  function handleImageClick(src: string) {
    setSelectedImage(src);
    setIsOpen(true);
  }

  const indicatorVariants = {
    active: { scale: 1.3, opacity: 1, transition: { type: 'spring', mass: 2, stiffness: 400, damping: 10 } },
    inactive: { scale: 1, opacity: 1, transition: { duration: 0.3 } },
  };

  useEffect(() => {
    const updateCarouselSize = () => {
      const { matches } = window.matchMedia('(min-width: 640px)');
      setCarouselSizes(matches ? LG_SIZE : SM_SIZE);
    };

    updateCarouselSize();

    window.addEventListener('resize', updateCarouselSize);

    return () => window.removeEventListener('resize', updateCarouselSize);
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-between">
      {album.slice(0, 5).map((img, i) => {
        // Calculer l'index relatif par rapport à activeIndex
        const relativeIndex = i - 2;
        const x = relativeIndex * carouselSizes.xOffset;
        const distance = Math.abs(relativeIndex);
        let y = 0;
        if (distance === 1) y = 60;
        else if (distance === 2) y = 150;        

        const rotation = relativeIndex * 5;

        return (
          
            <div
              key={img.id}
              className="h-1/2 absolute pointer-events-auto"
              style={{ zIndex: relativeIndex === 0 ? 10 : 5 }}
            >
              <motion.div
                className="rounded-xl bg-zinc-100 bg-[size:110%] hover:bg-[size:115%] hover:cursor-pointer transition-[background-size] duration-200"
                initial={{ opacity: 0 }}
                animate={{ x, y, rotate: rotation, opacity: 1 }}
                transition={{
                  x: { type: 'spring', mass: 2, stiffness: 400, damping: 30 },
                  y: { type: 'spring', mass: 2, stiffness: 400, damping: 30 },
                  rotate: { type: 'spring', mass: 2, stiffness: 400, damping: 30 },
                  opacity: { delay: 0.3, duration: 0.1 },
                }}
                style={{
                  width: carouselSizes.cardW,
                  height: carouselSizes.cardH,
                  backgroundImage: `url(${img.src})`,
                  backgroundPosition: 'center',
                }}
                onClick={() => handleImageClick(img.src)}
              />
            </div>
          
        );
      })}
      <div className="absolute w-fit flex justify-between items-center z-5 bottom-2/5 sm:bottom-1/3">
        <motion.button
          onClick={() => handleCarousel(-1)}
          className="p-4 rounded-full text-[#FFB8E0] bg-white font-bold text-6xl hover:text-[#EC7FA9]"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <ArrowLeft size={carouselSizes.icon} />
        </motion.button>
        <ul className="flex mx-6 md:mx-15">
          {album.map((img, i) => (
            <li key={img.id}>
              <motion.div
                variants={indicatorVariants}
                initial="inactive"
                animate={i === activeIndex ? 'active' : ''}
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
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <ArrowRight size={carouselSizes.icon} />
        </motion.button>
      </div>
      <Modal src={selectedImage} isOpen={isOpen} setIsOpen={setIsOpen} heightImg={carouselSizes.cardH} widthImg={carouselSizes.cardW} />
    </div>
  );
};

const Modal = ({
  src,
  isOpen,
  setIsOpen,
  heightImg,
  widthImg,
}: {
  src: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  heightImg: number;
  widthImg: number;
}) => {
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
            className="relative rounded-xl bg-[size:110%]"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.3, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: widthImg,
              height: heightImg,
              backgroundImage: `url(${src})`,
              backgroundPosition: 'center',
            }}
          >
            <motion.div
              initial={{ rotate: -45 }}
              animate={{ rotate: 0 }}
              whileHover={{ scale: 1.1, rotate: 45 }}
              transition={{
                rotate: { type: 'spring', mass: 2, stiffness: 400, damping: 10 },
                scale: { type: 'spring', mass: 2, stiffness: 400, damping: 10 },
              }}
              className="absolute right-0 translate-x-1/2 translate-y-[-50%] p-2 w-fit rounded-full text-[#FFB8E0] bg-white"
              onClick={() => setIsOpen(false)}
            >
              <X size={24} strokeWidth={3} />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Carousel;