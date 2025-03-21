import React, { useState } from 'react'
import { motion } from "framer-motion";
import { Plus, Trash2 } from 'lucide-react';
import useImageStore from '../useImageStore';


interface SideBarProps {
    isToggle: boolean;
}
  

const SideBar: React.FC<SideBarProps> = ({ isToggle }) => {
    const [filtered, setFiltered] = useState("album")
    const images = useImageStore((state) => state.images);
    const updateImageAt = useImageStore((state) => state.updateImageAt);
    const removeImageAt = useImageStore((state) => state.removeImageAt);

    const handlefilter = (filter: "album" | "voice") =>{
        setFiltered(filter);
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const files = e.target.files;
        if (files && files[0]) {
          const file = files[0];
          const imgUrl = URL.createObjectURL(file);
          updateImageAt(index, imgUrl); // Met à jour l'image à l'index spécifié dans le store
        }
      };
    
      const handleRemoveImage = (index: number) => {
        removeImageAt(index); // Remplace la source par une chaîne vide
      };


  return (
    <motion.div className='h-full w-full max-w-[500px] sm:rounded-s-3xl bg-white fixed z-10 top-0 right-0 shadow-2xl'
    animate={{ x: isToggle ? '0%' : '100%' }} // translation selon isToggle
    transition={{ duration: 0.2 }}  // durée de l'animation
    >
        <p className='font-Cherry w-[90%] mx-auto text-4xl text-[#EC7FA9] my-10'>USER NAME</p>

        <div className='w-[90%] mx-auto'>
            <div className='flex gap-2 mb-5 font'>
                <motion.button 
                whileHover={{ scale: 1.1}}
                whileTap={{ x: 100}}
                onClick={()=>{handlefilter("album")}} 
                className={`px-5 py-1 text-2xl ${ filtered === "album" ? "text-white bg-[#EC7FA9]":"text-zinc-900 bg-white"} text-white bg-[#EC7FA9] rounded-lg hover:cursor-pointer`}
                >
                    Album
                </motion.button>
                <motion.button
                whileHover={{ scale: 1.1}}
                whileTap={{ x: -100}}
                 onClick={()=>{handlefilter("voice")}} 
                 className={`px-5 py-1 text-2xl ${ filtered === "voice" ? "text-white bg-[#EC7FA9]":"text-zinc-900 bg-white"} text-white bg-[#EC7FA9] rounded-lg hover:cursor-pointer`}
                 >
                    Voice
                </motion.button>
            </div>

            <ul className='w-full flex justify-between flex-wrap gap-2'>
                {images.map((imgItem,i)=>{
                    return(
                        <motion.li 
                            variants={{
                                initial: {},
                                hover: {}
                            }}
                            initial="initial"
                            whileHover="hover"
                            className='w-[80px] h-[80px] bg-[size:100%] hover:bg-[size:110%] flex justify-center items-center bg-gray-300 text-white rounded-lg relative transition-[background-size] duration-200'
                            style={ imgItem ? { 
                                backgroundImage: `url(${imgItem.src})`,
                                backgroundPosition: 'center'
                              } : {} }
                            >
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={(e)=>handleFileChange(e,i)} 
                                    style={{ 
                                        position: 'absolute', 
                                        width: '100%', 
                                        height: '100%', 
                                        opacity: 0, 
                                        cursor: 'pointer',
                                        zIndex: 10
                                    }} 
                                />
                                {imgItem.src &&(
                                    <motion.span
                                        onClick={() => handleRemoveImage(i)}
                                        style={{ 
                                            position: 'absolute',

                                            top: '0', 
                                            right: '0',
                                            cursor: 'pointer',
                                            zIndex: 15,
                                            transform: 'translate(50%, -50%)'
                                        }} 
                                    >
                                        <Trash2 size={24} strokeWidth={2} fill="#FFFFFF" color='#FF8A8A'/>
                                    </motion.span>
                                )}
                                <motion.span
                                    variants={{
                                        initial: {rotate:"0deg"},
                                        hover: {rotate: "90deg"}
                                    }}
                                    transition={{ type:"spring", mass:3 , stiffness: 200, damping: 10 }}
                                >
                                   {!imgItem.src &&(
                                        <Plus size={36} strokeWidth={3}/>
                                   )} 
                                </motion.span>
                        </motion.li>
                    )
                })}
            </ul>

        </div>
        
    </motion.div>
  )
}

export default SideBar