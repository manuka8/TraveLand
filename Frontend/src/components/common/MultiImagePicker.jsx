import { useState, useRef } from 'react';
import { MdCloudUpload, MdImage, MdDelete, MdCheckCircle, MdRadioButtonUnchecked } from 'react-icons/md';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function MultiImagePicker({ label, images = [], onChange }) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploading(true);
        const newImages = [...images];

        try {
            for (const file of files) {
                const res = await authAPI.upload(file);
                const { url } = res.data;

                // Add to list, if it's the first image and no main set, make it main
                const hasMain = newImages.some(img => img.is_main);
                newImages.push({
                    url,
                    is_main: !hasMain && newImages.length === 0 ? true : false
                });
            }
            onChange(newImages);
            toast.success(`${files.length} image(s) uploaded`);
        } catch (err) {
            console.error('Upload error:', err);
            toast.error('Some uploads failed');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleRemove = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        // If we removed the main image, set the first one as main if exists
        if (images[index]?.is_main && newImages.length > 0) {
            newImages[0].is_main = true;
        }
        onChange(newImages);
    };

    const handleSetMain = (index) => {
        const newImages = images.map((img, i) => ({
            ...img,
            is_main: i === index
        }));
        onChange(newImages);
    };

    return (
        <div className="space-y-3">
            {label && <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">{label}</label>}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((img, index) => (
                    <div key={index} className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 group bg-white/5">
                        <img src={img.url} alt="Gallery" className="w-full h-full object-cover" />

                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                            <button
                                type="button"
                                onClick={() => handleSetMain(index)}
                                className={`flex items-center gap-1 text-[10px] font-bold uppercase transition-colors px-2 py-1 rounded
                                    ${img.is_main ? 'text-emerald-400 bg-emerald-500/20' : 'text-white hover:text-emerald-400 bg-white/10'}`}
                            >
                                {img.is_main ? <MdCheckCircle /> : <MdRadioButtonUnchecked />}
                                {img.is_main ? 'Main' : 'Set Main'}
                            </button>

                            <button
                                type="button"
                                onClick={() => handleRemove(index)}
                                className="p-1.5 bg-red-500 rounded-lg text-white hover:bg-red-600 transition-colors"
                            >
                                <MdDelete size={16} />
                            </button>
                        </div>

                        {img.is_main && (
                            <div className="absolute top-2 left-2 bg-emerald-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter">
                                Main
                            </div>
                        )}
                    </div>
                ))}

                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="aspect-square rounded-2xl border-2 border-dashed border-white/10 hover:border-primary-500/50 hover:bg-white/5 transition-all flex flex-col items-center justify-center text-slate-500 hover:text-primary-400 disabled:opacity-50"
                >
                    {uploading ? (
                        <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <>
                            <MdCloudUpload size={24} className="mb-1" />
                            <span className="text-[10px] font-bold uppercase">Add Image</span>
                        </>
                    )}
                </button>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                multiple
                className="hidden"
            />
        </div>
    );
}
