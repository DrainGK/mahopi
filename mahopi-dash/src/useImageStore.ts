import { create } from 'zustand';

export interface Image {
    id: number;
    src: string;
  }
  
  export interface ImageStore {
    images: Image[];
    activeIndex: number;
    setImages: (images: Image[]) => void;
    setActiveIndex: (index: number) => void;
    updateImageAt: (index: number, newSrc: string) => void;
    removeImageAt: (index: number) => void;
  }

  const initialImages: Image[] = [
    {
        src: "https://images.unsplash.com/photo-1741334632363-58022899ce91?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3",
        id: 1,
      },
      {
        src: "https://plus.unsplash.com/premium_photo-1738854511313-799f13b4d3ff?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3",
        id: 2,
      },
      {
        src: "https://images.unsplash.com/photo-1737044263770-9ddf6c5654c4?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
        id: 3,
      },
      {
        src: "https://images.unsplash.com/photo-1741091756497-10c964acc4f6?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        id: 4,
      },
      {
        src: "https://images.unsplash.com/photo-1735480222193-3fe22ffd70b6?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        id: 5,
      },
      {
        src: "https://images.unsplash.com/photo-1741367658528-8134fab3b67d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        id: 6,
      },
      {
        src: "https://images.unsplash.com/photo-1741298856762-1ff2f1204bc8?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        id: 7,
      },
      {
        src: "https://images.unsplash.com/photo-1741471884167-a2b08fb14a3e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        id: 8,
      },
      {
        src: "https://images.unsplash.com/photo-1734377543826-1a64e1d4c5fe?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        id: 9,
      },
      {
        src: "https://images.unsplash.com/photo-1740738895087-ec912c4718af?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        id: 10,
      },
  ];

  const useImageStore = create<ImageStore>((set) => ({
    images: initialImages,
    activeIndex: 0,
    setImages: (images: Image[]) => set({ images }),
    setActiveIndex: (index: number) => set({ activeIndex: index }),
    updateImageAt: (index: number, newSrc: string) => {
        set((state) => {
          const updated = [...state.images];
          if (updated[index]) {
            updated[index] = { ...updated[index], src: newSrc };
          }
          return { images: updated };
        });
      },
      removeImageAt: (index: number) => {
        set((state) => {
          const updated = [...state.images];
          if (updated[index]) {
            updated[index] = { ...updated[index], src: '' };
          }
          return { images: updated };
        });
      },
  }));

export default useImageStore;