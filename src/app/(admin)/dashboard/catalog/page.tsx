"use client";

import { useEffect, useState } from "react";
import { catalogService } from "@/src/services/catalogService";
import { Title } from "@/src/types/catalog";
import Link from "next/link";
import { Pencil, Trash2, X, Plus, Save, Globe, Clapperboard } from "lucide-react";

export default function CatalogPage() {
  const [titles, setTitles] = useState<Title[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Title>>({});
  const [newGenre, setNewGenre] = useState(""); // State to handle genre input

  useEffect(() => {
    fetchTitles();
  }, []);

  const fetchTitles = async () => {
    try {
      setLoading(true);
      const data = await catalogService.getAllTitles();
      setTitles(data.titles || []);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (title?: Title) => {
    setFormData(title || { 
      type: "movie", 
      isLive: false, 
      genres: [], 
      releaseYear: new Date().getFullYear(),
      language: "English"
    });
    setIsModalOpen(true);
  };

  const handleAddGenre = () => {
    if (newGenre.trim() && !formData.genres?.includes(newGenre.trim())) {
      setFormData({ ...formData, genres: [...(formData.genres || []), newGenre.trim()] });
      setNewGenre("");
    }
  };

  const removeGenre = (genreToRemove: string) => {
    setFormData({ ...formData, genres: formData.genres?.filter(g => g !== genreToRemove) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData._id) {
        await catalogService.updateTitle(formData._id, formData);
      } else {
        await catalogService.createTitle(formData);
      }
      fetchTitles();
      setIsModalOpen(false);
    } catch (error) {
      alert("Failed to save title.");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-zinc-950 text-zinc-100 font-sans">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Content Catalog</h1>
        <button onClick={() => openModal()} className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-xl flex items-center gap-2 transition-all">
          <Plus size={20} /> Add New Title
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {titles.map((title) => (
          <div key={title._id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden group hover:border-zinc-600 transition-all">
            <div className="relative aspect-video">
              <img src={title.thumbnailUrl} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button onClick={() => openModal(title)} className="p-3 bg-white/10 rounded-full hover:bg-white/20"><Pencil size={20}/></button>
                <button className="p-3 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/40"><Trash2 size={20}/></button>
              </div>
            </div>
            
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <Link href={`/dashboard/catalog/${title._id}`} >
                  <h3 className="text-lg font-bold line-clamp-1">{title.name}</h3>
                </Link>
                <span className="text-[10px] bg-zinc-800 px-2 py-1 rounded text-zinc-400 uppercase font-bold">{title.type}</span>
              </div>
              
              <p className="text-zinc-500 text-sm line-clamp-2 mb-3">{title.description}</p>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {title.genres.slice(0, 3).map(g => (
                  <span key={g} className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20">{g}</span>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-500 border-t border-zinc-800 pt-3">
                <span className="flex items-center gap-1"><Globe size={12}/> {title.language}</span>
                <span>{title.releaseYear}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FULL FIELD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl rounded-3xl shadow-2xl my-auto">
            <div className="flex justify-between items-center p-6 border-b border-zinc-800">
              <h2 className="text-xl font-bold">{formData._id ? 'Update Title' : 'Create Title'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white"><X size={24}/></button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-5 max-h-[80vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Title Name</label>
                  <input className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 focus:border-blue-500 outline-none" 
                    value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Language</label>
                  <input className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 focus:border-blue-500 outline-none" 
                    value={formData.language || ''} onChange={e => setFormData({...formData, language: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">Description</label>
                <textarea className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 focus:border-blue-500 outline-none h-24 resize-none" 
                  value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>

              <div className="grid grid-cols-3 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Type</label>
                  <select className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 outline-none appearance-none" 
                    value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}>
                    <option value="movie">Movie</option>
                    <option value="series">Series</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Year</label>
                  <input type="number" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 outline-none" 
                    value={formData.releaseYear || ''} onChange={e => setFormData({...formData, releaseYear: parseInt(e.target.value)})} />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="hidden" checked={formData.isLive} onChange={e => setFormData({...formData, isLive: e.target.checked})} />
                    <div className={`w-10 h-5 rounded-full p-1 transition-colors ${formData.isLive ? 'bg-emerald-500' : 'bg-zinc-700'}`}>
                      <div className={`w-3 h-3 bg-white rounded-full transition-transform ${formData.isLive ? 'translate-x-5' : 'translate-x-0'}`} />
                    </div>
                    <span className="text-sm font-medium">Live</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">Thumbnail URL</label>
                <input className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 outline-none" 
                  value={formData.thumbnailUrl || ''} onChange={e => setFormData({...formData, thumbnailUrl: e.target.value})} />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-zinc-500 uppercase">Genres</label>
                <div className="flex gap-2">
                  <input className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 outline-none" 
                    placeholder="Action, Sci-Fi..." value={newGenre} onChange={e => setNewGenre(e.target.value)} 
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddGenre())} />
                  <button type="button" onClick={handleAddGenre} className="bg-zinc-700 px-4 rounded-xl hover:bg-zinc-600">Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.genres?.map(genre => (
                    <span key={genre} className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-lg flex items-center gap-2 text-sm border border-blue-500/30">
                      {genre} <X size={14} className="cursor-pointer" onClick={() => removeGenre(genre)} />
                    </span>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-bold text-lg mt-4 flex items-center justify-center gap-2">
                <Save size={20} /> Save Title Data
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}