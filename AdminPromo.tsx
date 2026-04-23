import React from 'react';
import { IconPercent, IconGamepad, IconZap, IconBox, IconTrash, IconCheckCircle, IconBatteryCharging } from '../../components/Icons';
import { formatRupiah } from '../../lib/utils';

export const AdminPromo = ({ 
    activePromoTab, setActivePromoTab, promos, activePromoInput,
    setActivePromoInput, handleSavePromo, handleDeletePromo,
    groupedGames, items, isPromoLoading
}: any) => {

    return (
        <div className="animate-slide-down flex flex-col h-full w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-black text-main flex items-center gap-2 drop-shadow-sm"><IconPercent className="w-6 h-6 text-primary"/> Pusat Kampanye Promosi</h2>
                <div className="flex bg-card border border-theme p-1 rounded-xl shadow-sm">
                   <button onClick={() => setActivePromoTab('manual')} className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 ${activePromoTab==='manual' ? 'bg-primary text-white shadow-sm' : 'text-sub-theme hover:bg-gray-100 dark:hover:bg-white/5'}`}><IconGamepad className="w-4 h-4"/> Promo Kupon Manuskrip</button>
                   <button onClick={() => setActivePromoTab('flash')} className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 ${activePromoTab==='flash' ? 'bg-red-600 text-white shadow-sm' : 'text-sub-theme hover:bg-gray-100 dark:hover:bg-white/5'}`}><IconZap className="w-4 h-4"/> Mega Flash Sale</button>
                </div>
            </div>

            <form onSubmit={handleSavePromo} className={`p-6 md:p-8 rounded-[2.5rem] shadow-lg mb-8 relative z-20 ${activePromoTab === 'flash' ? 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border border-red-500/30' : 'bg-card border border-theme'}`}>
                <h3 className={`text-sm font-black uppercase tracking-widest border-b pb-2 mb-4 flex items-center gap-2 ${activePromoTab === 'flash' ? 'text-red-600 dark:text-red-500 border-red-500/20' : 'text-main border-theme'}`}>
                   {activePromoInput?.id ? 'Edit Promosi Sistem' : 'Bina Promosi Baru'} {activePromoTab === 'flash' && <IconZap className="w-4 h-4 animate-pulse-fast"/>}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                        <label className={`text-[10px] font-black uppercase ml-1 ${activePromoTab === 'flash' ? 'text-red-500/80' : 'text-sub-theme'}`}>Kode Promo Rahasia (Wajib)</label>
                        <input type="text" required value={activePromoInput?.code || ''} onChange={(e)=>setActivePromoInput({...activePromoInput, code: e.target.value.toUpperCase().replace(/\s/g, '')})} className={`w-full input-theme text-sm p-4 rounded-xl shadow-inner font-mono font-black placeholder:font-sans uppercase ${activePromoTab==='flash'?'border-red-500/30 bg-white/50 dark:bg-black/20 focus:border-red-500 text-red-600 dark:text-red-400':''}`} placeholder="Contoh: MERDEKA20" />
                    </div>
                    
                    <div className="space-y-1.5">
                        <label className={`text-[10px] font-black uppercase ml-1 ${activePromoTab === 'flash' ? 'text-red-500/80' : 'text-sub-theme'}`}>Tipe Besaran Diskon</label>
                        <div className="flex gap-2">
                            <select value={activePromoInput?.type || 'fixed'} onChange={(e)=>setActivePromoInput({...activePromoInput, type: e.target.value})} className={`w-1/3 input-theme text-sm p-4 rounded-xl shadow-inner font-bold appearance-none cursor-pointer ${activePromoTab==='flash'?'border-red-500/30 bg-white/50 dark:bg-black/20 focus:border-red-500':''}`}>
                                <option value="fixed">Rupiah (Rp)</option>
                                <option value="percentage">Persen (%)</option>
                            </select>
                            <input type="number" required value={activePromoInput?.discount || ''} onChange={(e)=>setActivePromoInput({...activePromoInput, discount: Number(e.target.value)})} min="1" className={`flex-1 input-theme text-sm p-4 rounded-xl shadow-inner font-mono font-black ${activePromoTab==='flash'?'border-red-500/30 bg-white/50 dark:bg-black/20 focus:border-red-500':''}`} placeholder={activePromoInput?.type === 'percentage' ? "Max: 100" : "Contoh: 15000"} />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className={`text-[10px] font-black uppercase ml-1 ${activePromoTab === 'flash' ? 'text-red-500/80' : 'text-sub-theme'}`}>Kapasitas Stok Pengguna</label>
                        <input type="number" required value={activePromoInput?.stock || ''} onChange={(e)=>setActivePromoInput({...activePromoInput, stock: Number(e.target.value)})} min="1" className={`w-full input-theme text-sm p-4 rounded-xl shadow-inner font-mono ${activePromoTab==='flash'?'border-red-500/30 bg-white/50 dark:bg-black/20 focus:border-red-500':''}`} placeholder="Limit jumlah klaim (Misal: 100)" />
                    </div>

                    <div className="space-y-1.5">
                        <label className={`text-[10px] font-black uppercase ml-1 ${activePromoTab === 'flash' ? 'text-red-500/80' : 'text-sub-theme'}`}>Target Lingkup Promo (Penting)</label>
                        <select value={activePromoInput?.category || 'general'} onChange={(e)=>{setActivePromoInput({...activePromoInput, category: e.target.value, targetGame: '', targetItems: []})}} className={`w-full input-theme text-sm p-4 rounded-xl shadow-inner font-bold appearance-none cursor-pointer ${activePromoTab==='flash'?'border-red-500/30 bg-white/50 dark:bg-black/20 text-red-600 focus:border-red-500':''}`}>
                            {activePromoTab === 'manual' && <option value="general">Bebas Semua Transaksi</option>}
                            <option value="game">Hanya 1 Game Spesifik</option>
                            <option value="item">Hanya Spesifik Produk SKU</option>
                            {activePromoTab === 'flash' && <option value="flash" className="hidden">Flash Sale Mode (Otomatis)</option>}
                        </select>
                    </div>

                    {activePromoInput?.category === 'game' && (
                        <div className="space-y-1.5 md:col-span-2 animate-slide-down">
                            <label className={`text-[10px] font-black uppercase ml-1 ${activePromoTab === 'flash' ? 'text-red-500/80' : 'text-sub-theme'}`}>Pilih Target Game/Kategori Layanan</label>
                            <select value={activePromoInput?.targetGame || ''} onChange={(e)=>setActivePromoInput({...activePromoInput, targetGame: e.target.value})} className={`w-full input-theme text-sm p-4 rounded-xl shadow-inner font-bold appearance-none cursor-pointer ${activePromoTab==='flash'?'border-red-500/30 bg-white/50 dark:bg-black/20 focus:border-red-500':''}`}>
                                <option value="" disabled>Pilih Layanan...</option>
                                {Object.keys(groupedGames).map(cat => (
                                    <optgroup key={cat} label={`Kategori: ${cat.toUpperCase()}`}>
                                        {groupedGames[cat].map((g:any) => <option key={g.id} value={g.id}>{g.name}</option>)}
                                    </optgroup>
                                ))}
                            </select>
                        </div>
                    )}

                    {(activePromoInput?.category === 'item' || activePromoInput?.category === 'flash') && (
                        <div className="space-y-2 md:col-span-2 animate-slide-down">
                            <label className={`text-[10px] font-black uppercase ml-1 ${activePromoTab === 'flash' ? 'text-red-500/80' : 'text-sub-theme'}`}>Pilih Produk SKU (Bisa Lebih Dari Satu)</label>
                            <div className={`p-4 rounded-xl shadow-inner max-h-60 overflow-y-auto custom-scrollbar border ${activePromoTab==='flash'?'border-red-500/30 bg-white/50 dark:bg-black/20':'bg-gray-50 dark:bg-black/40 border-theme'}`}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                    {(items||[]).sort((a:any,b:any)=>(a.gameId||'').localeCompare(b.gameId||'')).map((item:any) => (
                                        <label key={item.id} className="flex items-start gap-2 cursor-pointer group tooltip" title={`${item.gameId} - ${item.name}`}>
                                            <input type="checkbox" checked={activePromoInput?.targetItems?.includes(item.id) || false} onChange={(e)=>{
                                                const current = activePromoInput?.targetItems || [];
                                                setActivePromoInput({...activePromoInput, targetItems: e.target.checked ? [...current, item.id] : current.filter((id:any)=>id !== item.id)});
                                            }} className="mt-1 w-4 h-4 rounded text-primary transition-all"/>
                                            <span className={`text-[10px] font-bold line-clamp-2 leading-tight ${activePromoTab==='flash'?'text-red-900 dark:text-red-400 group-hover:text-red-700':'text-main group-hover:text-primary'}`}>
                                                [{item.gameId}] {item.name}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-1.5 md:col-span-2">
                        <label className={`text-[10px] font-black uppercase ml-1 flex items-center gap-1 ${activePromoTab === 'flash' ? 'text-red-500/80' : 'text-sub-theme'}`}><IconBatteryCharging className="w-3 h-3"/> Tanggal Kadaluarsa Berakhir</label>
                        <input type="datetime-local" required value={activePromoInput?.endTime ? new Date(activePromoInput.endTime.getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0,16) : ''} onChange={(e)=>setActivePromoInput({...activePromoInput, endTime: new Date(e.target.value)})} className={`w-full input-theme text-sm p-4 rounded-xl shadow-inner font-mono font-bold cursor-pointer ${activePromoTab==='flash'?'border-red-500/30 bg-white/50 dark:bg-black/20 focus:border-red-500':''}`} />
                    </div>
                </div>

                <div className={`mt-6 pt-6 flex gap-3 ${activePromoTab==='flash'?'border-t border-red-500/20':'border-t border-theme'}`}>
                    <button type="submit" disabled={isPromoLoading} className={`flex-[2] text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2 hover:scale-[1.02] ${activePromoTab === 'flash' ? 'bg-red-600 hover:bg-red-500 hover:shadow-red-500/40' : 'bg-primary hover:bg-primary-hover hover:shadow-primary/40'}`}>
                        <IconCheckCircle className="w-4 h-4"/> {activePromoInput?.id ? 'Ubah Aturan' : 'Rilis Baru Sekarang'}
                    </button>
                    {activePromoInput?.id && (
                        <button type="button" onClick={()=>setActivePromoInput(null)} className="flex-1 bg-gray-200 dark:bg-white/10 text-main py-4 rounded-xl font-black text-xs uppercase tracking-widest transition hover:bg-gray-300 dark:hover:bg-white/20">Batalkan Edit</button>
                    )}
                </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(promos||[]).filter((p:any) => p.category === activePromoTab || (activePromoTab === 'manual' && p.category !== 'flash') || (activePromoTab === 'flash' && p.category === 'flash')).map((promo:any) => {
                    const timeLeft = Math.max(0, new Date(promo.endTime).getTime() - new Date().getTime());
                    const isExpired = timeLeft === 0 || (promo.usedBy||[]).length >= promo.stock || !promo.isActive;
                    
                    return (
                        <div key={promo.id} className={`p-6 rounded-[2rem] border relative overflow-hidden transition-all group hover:scale-[1.02] ${promo.category === 'flash' ? 'bg-gradient-to-br from-red-500 to-red-600 border-red-400 text-white shadow-lg' : 'bg-card border-theme shadow-sm'}`}>
                            {promo.category === 'flash' && <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>}
                            
                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div className={`font-mono font-black px-3 py-1.5 rounded-lg text-sm border shadow-sm ${promo.category === 'flash' ? 'bg-black/30 border-white/20' : 'bg-gray-100 dark:bg-black/50 border-theme text-main'}`}>{promo.code}</div>
                                {isExpired ? (
                                    <span className="bg-gray-200 dark:bg-white/10 text-sub-theme px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest border border-theme shadow-sm">Nonaktif</span>
                                ) : (
                                    <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest shadow-sm flex items-center gap-1 border ${promo.category === 'flash' ? 'bg-white/20 text-white border-white/30 truncate' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border-emerald-500/20'}`}><span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span> {promo.category === 'flash' ? 'Live Flash' : 'Aktif'}</span>
                                )}
                            </div>

                            <div className="mb-4 text-center relative z-10">
                                <span className={`text-4xl font-black tracking-tighter drop-shadow-md ${promo.category === 'flash' ? 'text-white' : 'text-primary'}`}>
                                    {promo.type === 'percentage' ? `${promo.discount}%` : formatRupiah(promo.discount)}
                                </span>
                            </div>

                            <div className={`space-y-1.5 mb-5 relative z-10 ${promo.category === 'flash' ? 'text-white/80' : 'text-sub-theme'}`}>
                                <div className="flex justify-between items-center text-[10px] font-bold"><span className="uppercase tracking-widest">Target Jangkauan:</span> <span className="uppercase tracking-widest font-black max-w-[120px] truncate">{promo.category === 'general' ? 'Semua Bebas' : promo.category === 'game' ? `Spesifik Layanan` : 'Spesifik Produk SKU'}</span></div>
                                <div className="flex justify-between items-center text-[10px] font-bold"><span className="uppercase tracking-widest">Kapasitas Stok Klaim:</span> <span className="font-black">{(promo.usedBy||[]).length} / {promo.stock} ({Math.round(100-(((promo.usedBy||[]).length/promo.stock)*100))}%)</span></div>
                                <div className="flex justify-between items-center text-[10px] font-bold"><span className="uppercase tracking-widest">Sisa Waktu Promo:</span> <span className="font-black">{timeLeft>0 ? Math.ceil(timeLeft/(1000*60*60*24))+' Hari Lagi' : 'Kedaluwarsa'}</span></div>
                            </div>
                            
                            {promo.category === 'flash' && (
                                <div className="w-full bg-black/30 rounded-full h-1.5 mb-4 relative z-10 overflow-hidden shadow-inner"><div className="bg-white h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_#fff]" style={{width: `${((promo.stock-(promo.usedBy?.length||0))/promo.stock)*100}%`}}></div></div>
                            )}

                            <div className="flex gap-2 relative z-10">
                                <button onClick={() => { setActivePromoTab(promo.category === 'flash' ? 'flash' : 'manual'); setActivePromoInput(promo); window.scrollTo({top:0, behavior:'smooth'}); }} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition flex justify-center items-center gap-1 shadow-sm border ${promo.category === 'flash' ? 'bg-black/20 hover:bg-black/40 border-white/20 text-white' : 'bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'}`}><IconGamepad className="w-3 h-3"/> Modifikasi</button>
                                <button onClick={() => handleDeletePromo(promo.id)} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition flex justify-center items-center gap-1 shadow-sm border ${promo.category === 'flash' ? 'bg-red-900/40 hover:bg-red-900/60 border-red-900/50 text-white' : 'bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800'}`}><IconTrash className="w-3 h-3"/> Hapus Permanen</button>
                            </div>
                        </div>
                    )
                })}
                {(!promos || promos.filter((p:any) => p.category === activePromoTab || (activePromoTab === 'manual' && p.category !== 'flash') || (activePromoTab === 'flash' && p.category === 'flash')).length === 0) && <div className="col-span-full py-12 text-center text-sub-theme text-sm font-bold border border-dashed border-theme rounded-[2.5rem] bg-card">Database promosi untuk kategori ini masih kosong.</div>}
            </div>
        </div>
    );
};
