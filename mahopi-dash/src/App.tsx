import { Menu, X } from 'lucide-react'
import './App.css'
// import AnswerButton from './components/AnswerButton'
import Carousel from './components/Carousel'
import SideBar from './components/SideBar'
import { useState } from 'react'
// import EmojisExplosion from './components/EmojisExplosion'

function App() {
  const [isToggle, setIsToggle] = useState(false)

  
  return (
    <div className='bg-[#FFB8E0] w-screen h-screen flex-col items-center justify-center gap-5  overflow-hidden relative'>
      {/* <AnswerButton buttonType="wrong"/>
      <EmojisExplosion emojis={['💕', '💖', '💞','💕', '💖', '💞','💕', '💖', '💞','💕', '💖', '💞','💕', '💖', '💞','💕', '💖', '💞']} /> */}
      <h1 className='font-Cherry text-7xl text-center my-16 text-gray-900'>おもいで</h1>
      <Carousel />
      <SideBar isToggle={isToggle} />
      <div className='fixed top-5 right-5 bg-[#EC7FA9] text-white p-5 rounded-full hover:cursor-pointer z-20' onClick={()=> (setIsToggle(!isToggle))}>
            {isToggle ? (<X size={36} strokeWidth={3}/>):( <Menu size={36} strokeWidth={3} />)}
      </div>
    </div>
  )
}

export default App
