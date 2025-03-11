import './App.css'
import AnswerButton from './components/AnswerButton'
import Carousel from './components/Carousel'
import EmojisExplosion from './components/EmojisExplosion'

function App() {
  return (
    <div className='bg-[#FFB8E0] w-screen h-screen flex-col items-center justify-center gap-5  overflow-hidden'>
      <AnswerButton buttonType="wrong"/>
      <EmojisExplosion emojis={['💕', '💖', '💞','💕', '💖', '💞','💕', '💖', '💞','💕', '💖', '💞','💕', '💖', '💞','💕', '💖', '💞']} />
      <Carousel />
    </div>
  )
}

export default App
