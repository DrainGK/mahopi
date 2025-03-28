import React from 'react'
import { supabase } from '../supabaseClient'

const Logout: React.FC = () => {
    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error){
            console.error ("error when logout: ", error.message);
        } else {
            console.log("Logout succefully");
        }
    }
  return (
    <button
    className='text-zinc-500 text-3xl cursor-pointer'
    onClick={handleLogout}>
        Logout
    </button>
  )
}

export default Logout