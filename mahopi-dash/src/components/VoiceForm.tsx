import { ArrowRight, Scale } from 'lucide-react';
import useVoiceStore from '../useVoiceStore';
import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export interface VoiceFormType {
    slot_index: number | null;
}

const VoiceForm: React.FC<VoiceFormType> = ({ slot_index }) => {
    const { uploadVoices, loading, error } = useVoiceStore();
    const [file, setFile] = useState<File | null>(null); // État pour le fichier
    const [title, setTitle] = useState<string>(''); // État pour le titre

    // Gère le changement de fichier
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            setFile(files[0]); // Stocke le fichier dans l'état
        }
    };

    // Gère le changement du titre
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value); // Met à jour le titre dans l'état
    };

    // Gère la soumission du formulaire
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Empêche le rechargement de la page
        console.log('Formulaire soumis', { slot_index, file, title });
        if (file && slot_index !== null) {
            uploadVoices(slot_index, file, title); // Envoie le fichier et le titre
            setFile(null); // Réinitialise le fichier
            setTitle(''); // Réinitialise le titre
        } else {
            console.error('Aucun fichier sélectionné ou slot_index invalide');
        }
    };

    return (
        <form
            className="bg-pink-300 w-full rounded-lg justify-between flex p-2"
            onSubmit={handleSubmit} // Soumission gérée ici
        >
            <div className="flex flex-col w-[75%] md:w-[80%] gap-y-2 font-Cherry">
                <input
                    className="text-zinc-800"
                    type="file"
                    accept="audio/*"
                    onChange={handleFileChange} // Met à jour le fichier dans l'état
                />
                <input
                    className="bg-white w-[100%] p-1 rounded-sm"
                    type="text"
                    name="audio-title"
                    id="audio-title"
                    placeholder="Audio title"
                    value={title} // Valeur contrôlée
                    onChange={handleTitleChange} // Met à jour le titre dans l'état
                />
            </div>
            <motion.button
                type="submit"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 1.1 }}                
                className="bg-white text-pink-400 rounded-lg px-5 cursor-pointer"
                disabled={loading || !file} // Désactive si chargement ou pas de fichier
            >
                <ArrowRight />
            </motion.button>
        </form>
    );
};

export default VoiceForm;