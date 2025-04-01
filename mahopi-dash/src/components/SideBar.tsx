import React, { useState } from 'react'
import { motion } from "framer-motion";
import { Plus, Trash2 } from 'lucide-react';
import useImageStore from '../useImageStore';

import Logout from './Logout';
import useUserStore from '../UseUserStore';
import useVoiceStore from '../useVoiceStore';
import VoiceForm from './VoiceForm';


interface SideBarProps {
    isToggle: boolean;
}
  

const SideBar: React.FC<SideBarProps> = ({ isToggle }) => {
    const { user } = useUserStore();
    const [ filtered, setFiltered ] = useState("album")
    const { images, uploadImage, removeImage, loading, error } = useImageStore();
    const { voices, removeVoices} = useVoiceStore();

    const [ isOpen, setIsOpen ] = useState(false);
    const [ selectedVoiceIndex, setSelectedVoiceIndex ] = useState<number | null>(null);
 
    const handlefilter = (filter: "album" | "voice") =>{
        setFiltered(filter);
    }

    const handleVoiceClick = (index:number) => {
        setIsOpen(true);
        setSelectedVoiceIndex(index);
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const files = e.target.files;
        if (files && files[0]) {
          const file = files[0];
              uploadImage(index, file); // Met à jour l'image à l'index spécifié dans le store
        }
      };
    
      const handleRemoveFile = (index: number) => {
        filtered === "album" ? removeImage(index) : removeVoices(index)
      };


  return (
    <motion.div className='h-full w-full max-w-[500px] sm:rounded-s-3xl bg-white fixed z-10 top-0 right-0 shadow-2xl flex flex-col justify-between'
    animate={{ x: isToggle ? '0%' : '100%' }} // translation selon isToggle
    transition={{ duration: 0.2 }}  // durée de l'animation
    >   
        <div>
            <p className='font-Cherry w-[90%] mx-auto text-4xl text-[#EC7FA9] my-10'> Bonjour {user.name} 🌞</p>

            <div className='w-[90%] mx-auto'>
                {loading && <p className="text-gray-500">Chargement...</p>}
                {/* Afficher les erreurs */}
                {error && <p className="text-red-500">{error}</p>}
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
                    {filtered === "album" ? (
                        <>
                            {images.slice(0,5).map((imgItem,i)=>{
                                if (imgItem.user_id && imgItem.user_id !== user.id) {
                                    return null; // Skip images that don't belong to the user
                                  }
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
                                                    onClick={() => handleRemoveFile(i)}
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
                        </>
                    ):(
                        <>
                        {
                            voices.map((voice, index) => {
                                return(
                                    <>
                                    <motion.div 
                                    onClick={()=>handleVoiceClick(index)}
                                        variants={{
                                            initial: {},
                                            hover: {}
                                        }}
                                        initial="initial"
                                        whileHover="hover"
                                        className='w-full mx-auto bg-gray-300 hover:bg-blue-200 flex items-center justify-center py-2 rounded-lg font-Cherry text-2xl text-white cursor-pointer relative'
                                    >
                                        {voice.file_url &&(
                                                <motion.span
                                                    onClick={() => handleRemoveFile(index)}
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
                                            {!voice.title &&(
                                                <Plus size={36} strokeWidth={3}/>
                                            )}
                                        </motion.span>
                                        {voice.title &&(
                                            <p>{voice.title}</p>
                                        )}
                                    </motion.div> 
                                    {isOpen && selectedVoiceIndex === index &&(
                                        <VoiceForm slot_index = { selectedVoiceIndex}/>
                                    )}
                                    </>
                                )
                            })
                        }
                        </>
                    )}
                    
                </ul>

            </div>
        </div>
        <span className='font-Cherry w-[90%] mx-auto text-4xl flex justify-end mb-10'>
            <Logout/>
        </span>
        
    </motion.div>
  )
}

export default SideBar