import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from './supabaseClient';
import useUserStore from './UseUserStore';

export interface Voice {
    id: number;
    user_id: string | null;
    file_url: string;
    title: string;
}

export interface VoiceStore {
    voices: Voice[];
    loading: boolean;
    error: string | null;
    setVoices: (voices: Voice[]) => void;
    fetchVoices: () => Promise<void>;
    uploadVoices: (index: number, file: File, title: string) => Promise<void>;
    removeVoices: (index: number) => Promise<void>;
}

const initialVoices: Voice[] = [
    { id: 0, user_id: null, file_url: "", title: "" },
    { id: 1, user_id: null, file_url: "", title: "" },
    { id: 2, user_id: null, file_url: "", title: "" },
    { id: 3, user_id: null, file_url: "", title: "" },
    { id: 4, user_id: null, file_url: "", title: "" },
    { id: 5, user_id: null, file_url: "", title: "" },
    { id: 6, user_id: null, file_url: "", title: "" },
    { id: 7, user_id: null, file_url: "", title: "" },
    { id: 8, user_id: null, file_url: "", title: "" },
    { id: 9, user_id: null, file_url: "", title: "" },
];

const useVoiceStore = create<VoiceStore>()((set, get) => ({
    voices: initialVoices,
    loading: false,
    error: null,

    setVoices: (voices: Voice[]) => set({ voices }),

    fetchVoices: async () => {
        set({ loading: true, error: null });
        const userId = useUserStore.getState().user.id;
        if (!userId) {
            set({ loading: false, error: 'User not connected' });
            return;
        }

        const { data, error } = await supabase
            .from('audios')
            .select('id, file_url, slot_index, title')
            .eq('user_id', userId)
            .order('slot_index', { ascending: true });

        if (error) {
            console.error('Error while fetching voices: ', error.message);
            set({ loading: false, error: 'Error while loading audios' });
            return;
        }

        let updatedVoices = [...initialVoices];
        if (data) {
            data.forEach((voice: any) => {
                updatedVoices[voice.slot_index] = {
                    id: voice.id,
                    user_id: userId,
                    file_url: voice.file_url,
                    title: voice.title || '',
                };
            });
        }

        set({ voices: updatedVoices, loading: false });
    },

    uploadVoices: async (index: number, file: File, title: string) => {
        set({ loading: true, error: null });
        const { data: { user } } = await supabase.auth.getUser(); // Récupère l'utilisateur authentifié
        const userId = user?.id; // Utilise directement auth.uid()
    
        if (!userId) {
            set({ loading: false, error: 'user not connected' });
            return;
        }
    
        const { voices } = get();
        if (voices[index].file_url !== '') {
            await get().removeVoices(index);
        }
    
        const fileName = `${userId}/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
            .from('audio')
            .upload(fileName, file);
    
        if (uploadError) {
            console.error('Error upload: ', uploadError);
            set({ loading: false, error: 'Error while uploading audio' });
            return;
        }
    
        const { data: publicUrlData } = supabase.storage
            .from('audio')
            .getPublicUrl(fileName);
    
        const fileUrl = publicUrlData.publicUrl;
    
        const { data, error: insertError } = await supabase
            .from('audios')
            .insert({
                user_id: userId, // Utilise userId directement depuis auth
                file_url: fileUrl,
                title,
                slot_index: index,
            })
            .select()
            .single();
    
            if (insertError) {
                console.error('Error insert: ', insertError.message, insertError.details);
                set({ loading: false, error: `Error while saving audio file: ${insertError.message} - ${insertError.details}` });
                return;
            }
    
        set((state) => {
            const updatedVoices = [...state.voices];
            updatedVoices[index] = {
                id: data.id,
                user_id: userId,
                file_url: fileUrl,
                title: data.title,
            };
            return { voices: updatedVoices, loading: false };
        });
    },

    removeVoices: async (index: number) => {
        // À implémenter si nécessaire
    },
}));

export default useVoiceStore;