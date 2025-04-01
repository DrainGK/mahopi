import {useState} from 'react';
import { supabase } from '../supabaseClient';
import useUserStore from '../UseUserStore';


const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { setUserId , fetchProfile } = useUserStore();

    const handlelogin = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const {data, error} = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if(error){
            setError(error.message);
        } else {
            console.log('user connected', data.user);
            console.log(data.user.id);
            
            setUserId(data.user.id);
            await fetchProfile(data.user.id);
        }
    }
  return (
    <form 
        className='w-[90%] max-w-[600px] h-1/2 bg-white flex flex-col items-center justify-center mx-auto rounded-2xl gap-y-4 shadow-2xs'
        onSubmit={handlelogin}>
            <h1 className='font-Cherry text-7xl text-[#EC7FA9] mb-8'>login</h1>
        <input
            className='w-3/4 md:w-1/2 py-2 px-2 border-pink-200 text-[#EC7FA9] font-Cherry text-3xl border-2 rounded-lg focus-visible:bg-pink-200'
            type="email"
            placeholder='Email'
            value={email}
            onChange={(e)=> setEmail(e.target.value)}
        />
        <input
            className='w-3/4 md:w-1/2 py-2 px-2 border-pink-200 text-[#EC7FA9] font-Cherry text-3xl border-2 rounded-lg focus-visible:bg-pink-200'
            type='password'
            placeholder='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
        <input
            className='w-3/4 md:w-1/2 bg-[#FFB8E0] py-2 rounded-lg font-Cherry text-3xl text-white hover:cursor-pointer' 
            type='submit'
            value="login"
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  )
}

export default Login