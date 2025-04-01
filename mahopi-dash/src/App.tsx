import { Menu, X } from 'lucide-react'
import { motion } from "framer-motion";
import './App.css'
import Carousel from './components/Carousel'
import SideBar from './components/SideBar'
import { useEffect, useState } from 'react'
import Login from './components/Login';
import { supabase } from './supabaseClient';
import useImageStore from './useImageStore';
import useUserStore from './UseUserStore';
import useVoiceStore from './useVoiceStore';
import Voices from './components/Voices';

function App() {
  const [isToggle, setIsToggle] = useState(false);
  const [session, setSession] = useState<any>(null);
  const {  fetchImages } = useImageStore();
  const { fetchVoices } = useVoiceStore();
  const { setUserId } = useUserStore();

  useEffect(()=>{
    const fetchSession = async()=>{
      const {data: {session}} = await supabase.auth.getSession();
      setSession(session);
      if (session) {
        setUserId(session.user.id); // Stocker le userId dans le store
        fetchImages(); // Charger les images
        fetchVoices();
      }
    };

    fetchSession();

    const {
      data: {subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setUserId(session.user.id); // Mettre à jour le userId
        fetchImages(); // Recharger les images
        fetchVoices()
      } else {
        setUserId(null); // Réinitialiser le userId si l'utilisateur se déconnecte
      }
    });

    return() => subscription.unsubscribe();
    
  }, [setUserId, fetchImages, fetchVoices])

  return (
    <div className='bg-[#FFB8E0] flex w-screen  flex-col items-center justify-center gap-5 relative'>
      {session ? (
        <>
          <h1 className='font-Cherry text-7xl text-center my-16 text-gray-800'>おもいで</h1>
          <Carousel />
          <Voices />
          <SideBar isToggle={isToggle} />
          <motion.div
            initial={{  rotate: -180 }}
            animate={{  rotate: 0 }}
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.8 }}
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
        </>
      ):(
        <div className='h-screen w-full flex items-center justify-center'>
          <Login />
        </div>
      )}
      
    </div>
  )
}

export default App
