import { useState, useRef } from 'react';
import { MdCloudUpload, MdImage, MdDelete } from 'react-icons/md';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function ImagePicker({ label, value, onChange }) {
    const [preview, setPreview] = useState(value);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Visual preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);

        // Upload to server
        setUploading(true);
        try {
            const res = await authAPI.upload(file);
            const { url } = res.data;
            onChange(url); // Notify parent of the new URL
            toast.success('Image uploaded successfully');
        } catch (err) {
            console.error('Upload error:', err);
            toast.error(err.message || 'Image upload failed');
            setPreview(value); // Revert preview on failure
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = (e) => {
        e.stopPropagation();
        setPreview(null);
        onChange('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="space-y-2">
            {label && <label className="text-slate-300 text-sm font-medium block">{label}</label>}

            <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative h-40 w-full rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden
                    ${preview ? 'border-primary-500/50' : 'border-white/10 hover:border-primary-500/50 bg-white/5'}
                    ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
            >
                {preview ? (
                    <>
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                            >
                                <MdDelete size={20} />
                            </button>
                            <div className="p-2 bg-primary-500 rounded-full text-white">
                                <MdCloudUpload size={20} />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center p-4">
                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-2 text-slate-400">
                            <MdImage size={24} />
                        </div>
                        <p className="text-sm text-slate-400 font-medium">Click to upload image</p>
                        <p className="text-xs text-slate-500 mt-1">PNG, JPG or WebP (Max 5MB)</p>
                    </div>
                )}

                {uploading && (
                    <div className="absolute inset-0 bg-dark-900/60 flex flex-col items-center justify-center">
                        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                        <p className="text-xs text-white font-medium">Uploading...</p>
                    </div>
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />
            </div>
        </div>
    );
}
