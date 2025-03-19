import React, { useState } from 'react'
import { motion } from "framer-motion";
import { Plus } from 'lucide-react';

interface SideBarProps {
    isToggle: boolean;
}
  

const SideBar: React.FC<SideBarProps> = ({ isToggle }) => {

  return (
    <motion.div className='h-full w-full max-w-[640px] sm:rounded-s-3xl bg-white fixed z-10 top-0 right-0 shadow-2xl'
    animate={{ x: isToggle ? '0%' : '100%' }} // translation selon isToggle
    transition={{ duration: 0.2 }}  // durée de l'animation
    >
        <p>USER NAME</p>

        <div className='w-[90%] mx-auto'>
            <div>
                <button>Album</button>
                <button>Voice</button>
            </div>

            <ul className='w-full flex flex-wrap flex-grow'>
                <li className='p-5 w-fit bg-gray-300 text-white rounded-lg'>
                <Plus size={36} strokeWidth={3}/>
                </li>
                <li className='p-5 w-fit bg-gray-300 text-white rounded-lg'>
                <Plus size={36} strokeWidth={3}/>
                </li>
                <li className='p-5 w-fit bg-gray-300 text-white rounded-lg'>
                <Plus size={36} strokeWidth={3}/>
                </li>
                <li className='p-5 w-fit bg-gray-300 text-white rounded-lg'>
                <Plus size={36} strokeWidth={3}/>
                </li> 
                <li className='p-5 w-fit bg-gray-300 text-white rounded-lg'>
                <Plus size={36} strokeWidth={3}/>
                </li>
            </ul>

        </div>
        
    </motion.div>
  )
}

export default SideBar