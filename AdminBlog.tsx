import React from 'react';
import { IconFileText, IconTrash, IconEdit, IconCheckCircle, IconImage, IconAlignLeft } from '../../components/Icons';

export const AdminBlog = ({ 
    blogs, activeBlogInput, setActiveBlogInput, handleSaveBlog,
    handleDeleteBlog, isBlogLoading
}: any) => {

    return (
        <div className="animate-slide-down flex flex-col h-full w-full">
            <h2 className="text-2xl font-black mb-6 text-main flex items-center gap-2 drop-shadow-sm"><IconFileText className="w-6 h-6 text-primary"/> Pusat Informasi & Berita</h2>

            <form onSubmit={handleSaveBlog} className="bg-card p-6 md:p-8 rounded-[2.5rem] border border-theme shadow-lg mb-8 relative z-20">
                <h3 className="text-sm font-black text-main uppercase tracking-widest border-b border-theme pb-2 mb-4">Tulis / Edit Artikel</h3>
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-sub-theme ml-1">Judul Artikel</label>
                        <input type="text" required value={activeBlogInput?.title || ''} onChange={(e)=>setActiveBlogInput({...activeBlogInput, title: e.target.value})} className="w-full input-theme text-sm p-3.5 rounded-xl border-theme shadow-inner" placeholder="Pembaruan Server Maintenance..." />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-sub-theme ml-1">Kategori Artikel</label>
                            <select value={activeBlogInput?.category || 'INFO'} onChange={(e)=>setActiveBlogInput({...activeBlogInput, category: e.target.value})} className="w-full input-theme text-sm p-3.5 rounded-xl border-theme shadow-inner appearance-none cursor-pointer font-bold">
                                <option value="INFO">Informasi & Update</option>
                                <option value="EVENT">Event & Turnamen</option>
                                <option value="PROMO">Promo Spektakuler</option>
                            </select>
                        </div>
                        <div className="flex-1 space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-sub-theme ml-1 flex items-center gap-1"><IconImage className="w-3 h-3"/> URL Cover Image (Opsional)</label>
                            <input type="url" value={activeBlogInput?.image || ''} onChange={(e)=>setActiveBlogInput({...activeBlogInput, image: e.target.value})} className="w-full input-theme text-sm p-3.5 rounded-xl border-theme shadow-inner" placeholder="https://..." />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-sub-theme ml-1 flex items-center gap-1"><IconAlignLeft className="w-3 h-3"/> Isi Konten Lengkap</label>
                        <textarea required value={activeBlogInput?.content || ''} onChange={(e)=>setActiveBlogInput({...activeBlogInput, content: e.target.value})} className="w-full input-theme text-sm p-4 rounded-xl border-theme shadow-inner min-h-[150px] resize-none leading-relaxed" placeholder="Tulis informasi detail di sini..."></textarea>
                    </div>
                </div>
                <div className="flex gap-3 mt-6 pt-4 border-t border-theme">
                    <button type="submit" disabled={isBlogLoading} className="flex-[2] bg-primary hover:bg-primary-hover text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2 hover:scale-[1.02]"><IconCheckCircle className="w-4 h-4"/> {activeBlogInput?.id ? 'Simpan Perubahan' : 'Terbitkan Artikel Baru'}</button>
                    {activeBlogInput?.id && (
                        <button type="button" onClick={()=>setActiveBlogInput(null)} className="flex-1 bg-gray-200 dark:bg-white/10 text-main py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition hover:bg-gray-300 dark:hover:bg-white/20">Batal Edit</button>
                    )}
                </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {(blogs||[]).sort((a:any,b:any)=>new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime()).map((blog:any) => (
                    <div key={blog.id} className="clean-card overflow-hidden flex flex-col group transition-all hover:border-primary/50 hover:shadow-lg shadow-sm">
                        {blog.image && <div className="h-32 bg-black overflow-hidden relative"><img src={blog.image} className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500" alt=""/></div>}
                        <div className="p-5 flex-1 flex flex-col">
                            <div className="flex items-center justify-between mb-3">
                                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded shadow-sm border ${blog.category==='INFO'?'bg-blue-500/10 text-blue-600 border-blue-500/30':blog.category==='EVENT'?'bg-primary-light text-primary border-primary/30':'bg-red-500/10 text-red-600 border-red-500/30'}`}>{blog.category}</span>
                                <span className="text-[9px] font-bold text-sub-theme font-mono">{new Date(blog.createdAt).toLocaleDateString('id-ID')}</span>
                            </div>
                            <h3 className="font-black text-main text-lg mb-2 leading-tight">{blog.title}</h3>
                            <p className="text-xs text-sub-theme leading-relaxed line-clamp-2 mb-4 flex-1">{blog.content}</p>
                            <div className="flex gap-2 border-t border-theme pt-3 mt-auto">
                                <button onClick={() => setActiveBlogInput(blog)} className="flex-1 py-2 text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition flex justify-center items-center gap-1 shadow-sm"><IconEdit className="w-3 h-3"/> Edit</button>
                                <button onClick={() => handleDeleteBlog(blog.id)} className="flex-1 py-2 text-[10px] font-black uppercase tracking-widest text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 transition flex justify-center items-center gap-1 shadow-sm"><IconTrash className="w-3 h-3"/> Hapus</button>
                            </div>
                        </div>
                    </div>
                ))}
                {(!blogs || blogs.length === 0) && <div className="col-span-full py-12 text-center text-sub-theme text-sm font-bold border border-dashed border-theme rounded-[2rem] bg-card">Sistem informasi belum memiliki artikel berita atau pengumuman.</div>}
            </div>
        </div>
    );
};
