import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from './supabaseClient';
import useUserStore from './UseUserStore';

export interface Image {
  id: number;
  src: string;
}

export interface ImageStore {
  images: Image[];
  loading: boolean;
  error: string | null;
  activeIndex: number;
  setImages: (images: Image[]) => void;
  setActiveIndex: (index: number) => void;
  fetchImages: () => Promise<void>;
  uploadImage: (index: number, file: File) => Promise<void>;
  removeImage: (index: number) => Promise<void>;
}

const initialImages: Image[] = [
  { id: 0, src: "" },
  { id: 1, src: "" },
  { id: 2, src: "" },
  { id: 3, src: "" },
  { id: 4, src: "" },
];

const useImageStore = create<ImageStore>()(
  persist(
    (set, get) => ({
      images: initialImages,
      loading: false,
      error: null,
      activeIndex: 0, // Ajouter activeIndex à l'état initial
      setImages: (images: Image[]) => set({ images }),

      setActiveIndex: (index: number) => set({ activeIndex: index }),

      fetchImages: async () => {
        set({ loading: true, error: null });
        const userId = useUserStore.getState().user.id;
        if (!userId) {
          set({ loading: false, error: 'Utilisateur non connecté' });
          return;
        }

        const { data, error } = await supabase
          .from('photos')
          .select('id, file_url, slot_index')
          .eq('user_id', userId)
          .order('slot_index', { ascending: true });

        if (error) {
          console.error('Erreur fetchImages:', error);
          set({ loading: false, error: 'Erreur lors du chargement des images' });
          return;
        }

        let updatedImages = [...initialImages];
        if (data) {
          data.forEach((photo: any) => {
            updatedImages[photo.slot_index] = {
              id: photo.id,
              src: photo.file_url,
            };
          });
        }

        set({ images: updatedImages, loading: false, activeIndex: 0 }); // Réinitialiser activeIndex à 0 après fetch
      },

      uploadImage: async (index: number, file: File) => {
        set({ loading: true, error: null });
        const userId = useUserStore.getState().user.id;
        const { images } = get();
        if (!userId) {
          set({ loading: false, error: 'Utilisateur non connecté' });
          return;
        }

        if (images[index].src !== "") {
          await get().removeImage(index);
        }

        const fileName = `${userId}/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('image')
          .upload(fileName, file);

        if (uploadError) {
          console.error('Erreur upload:', uploadError);
          set({ loading: false, error: 'Erreur lors de l\'upload de l\'image' });
          return;
        }

        const { data: publicUrlData } = supabase.storage
          .from('image')
          .getPublicUrl(fileName);

        const fileUrl = publicUrlData.publicUrl;

        const { data, error: insertError } = await supabase
          .from('photos')
          .insert({ user_id: userId, file_url: fileUrl, slot_index: index })
          .select()
          .single();

        if (insertError) {
          console.error('Erreur insert:', insertError);
          set({ loading: false, error: `Erreur lors de l'enregistrement de l'image: ${insertError.message}` });
          return;
        }

        set((state) => {
          const updatedImages = [...state.images];
          updatedImages[index] = { id: data.id, src: fileUrl };
          return { images: updatedImages, loading: false };
        });
      },

      removeImage: async (index: number) => {
        set({ loading: true, error: null });
        const userId = useUserStore.getState().user.id;
        const { images, activeIndex } = get();
        if (!userId || images[index].src === "") {
          set({ loading: false });
          return;
        }
      
        // Supprimer la ligne dans la table photos
        const { error } = await supabase
          .from('photos')
          .delete()
          .eq('user_id', userId)
          .eq('slot_index', index);
      
        if (error) {
          console.error('Erreur removeImage:', error);
          set({ loading: false, error: 'Erreur lors de la suppression de l\'image' });
          return;
        }
      
        // Mettre à jour les images localement
        const updatedImages = [...images];
        updatedImages[index] = { id: index, src: "" };
      
        // Ajuster activeIndex si nécessaire
        let newActiveIndex = activeIndex;
        const hasImages = updatedImages.some((img) => img.src !== "");
      
        if (!hasImages) {
          newActiveIndex = 0;
        } else if (index === activeIndex) {
          let nextIndex = (activeIndex + 1) % updatedImages.length;
          while (updatedImages[nextIndex].src === "" && nextIndex !== activeIndex) {
            nextIndex = (nextIndex + 1) % updatedImages.length;
          }
          newActiveIndex = updatedImages[nextIndex].src !== "" ? nextIndex : 0;
        } else if (index < activeIndex) {
          newActiveIndex = activeIndex - 1;
          if (newActiveIndex < 0) newActiveIndex = 0;
        }
      
        set({ images: updatedImages, activeIndex: newActiveIndex, loading: false });
      },
    }),
    {
      name: 'image-store',
      partialize: (state) => ({ images: state.images, activeIndex: state.activeIndex }), // Persister activeIndex
    }
  )
);

export default useImageStore;