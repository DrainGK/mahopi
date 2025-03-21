import { Menu, X } from 'lucide-react'
import { motion } from "framer-motion";
import './App.css'
import Carousel from './components/Carousel'
import SideBar from './components/SideBar'
import { useState } from 'react'

function App() {
  const [isToggle, setIsToggle] = useState(false)

  return (
    <div className='bg-[#FFB8E0] w-screen h-screen flex-col items-center justify-center gap-5 overflow-hidden relative'>
      <h1 className='font-Cherry text-7xl text-center my-16 text-gray-800'>おもいで</h1>
      <Carousel />
      <SideBar isToggle={isToggle} />
      <motion.div
        initial={{  rotate: -180 }}
        animate={{  rotate: 0 }}
        whileHover={{ scale: 1.1, rotate: 180 }}
        transition={{
            rotate: { type: "spring", mass: 2, stiffness: 400, damping: 40, },
            scale: { type: "spring", mass: 2, stiffness: 400, damping: 40 },
        }} 
        className='fixed top-5 right-5 bg-[#EC7FA9] text-white p-5 rounded-full hover:cursor-pointer z-20'
        onClick={() => setIsToggle(!isToggle)}
      >

          {isToggle ? (
            <X size={36} strokeWidth={3} />
          ) : (
            <Menu size={36} strokeWidth={3} />
          )}
      </motion.div>
    </div>
  )
}

export default App
