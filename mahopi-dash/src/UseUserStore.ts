import { create } from 'zustand';
import { supabase } from './supabaseClient';


export interface User{
    id: string;
    name: string;
    email: string;
}

export interface UserStore{
    user: User;
    setUserId: (userId: string | null) => void;
    fetchProfile: (userId: string) => Promise<void>;
}

const useUserStore = create<UserStore>()((set) => ({
    user: {id: "", name: "", email: ""},

    setUserId: (userId: string | null) => {
        set({ user: { id: userId || '', name: '', email: '' } });
        if (userId) {
            // Optionnel : Appeler fetchProfile ici si tu veux charger le profil immédiatement
            useUserStore.getState().fetchProfile(userId);
        }
    },

    fetchProfile: async (userId:string) => {
        if(!userId){
            console.log("No user");
            return;
        }

        set({ user: { id:userId, name:"", email:""}});

        const { data, error } = await supabase
            .from('profiles')
            .select('name, email')
            .eq('id', userId)
            .single();

        if(error){
            console.log("error: ", error.message);
            return;
        }

        if(data){
            set({ user:{ id: userId, name: data.name, email: data.email}});
            console.log("Profil updated: ", data.name, data.email);
            
        }
    }
}))

export default useUserStore;