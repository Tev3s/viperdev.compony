import React from 'react';
import { IconGamepad, IconRefreshCcw, IconBox, IconTrash, IconEdit, IconCheckCircle, IconLoader } from '../../components/Icons';
import { formatRupiah } from '../../lib/utils';
import { useToast } from '../../context/ToastContext';

export const AdminKatalog = ({ 
    activeKatalogTab, setActiveKatalogTab, groupedGames, ObjectKeys,
    activeAdminGameMenu, setActiveAdminGameMenu, items, handleSyncProducts,
    isSyncing, getDisplayPrice, calculateFinalPrice, handleAdminSaveGame,
    handleAdminDeleteGame, handleAdminSaveItem, sysLoading
}: any) => {

    const { addToast } = useToast();

    return (
        <div className="animate-slide-down flex flex-col h-full w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-black text-main flex items-center gap-2 drop-shadow-sm"><IconGamepad className="w-6 h-6 text-primary"/> Katalog Layanan & Harga</h2>
                <div className="flex bg-card border border-theme p-1 rounded-xl shadow-sm">
                   <button onClick={() => setActiveKatalogTab('games')} className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${activeKatalogTab === 'games' ? 'bg-primary text-white shadow-sm' : 'text-sub-theme hover:bg-gray-100 dark:hover:bg-white/5'}`}>Game Utama</button>
                   <button onClick={() => setActiveKatalogTab('items')} className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${activeKatalogTab === 'items' ? 'bg-primary text-white shadow-sm' : 'text-sub-theme hover:bg-gray-100 dark:hover:bg-white/5'}`}>Produk SKU</button>
                </div>
            </div>

            {activeKatalogTab === 'games' && (
                <div className="space-y-8 flex-1 overflow-y-auto custom-scrollbar render-optimized pb-10">
                   {['game', 'pulsa', 'emoney', 'pascabayar'].map(catKey => {
                       const catGames = groupedGames[catKey] || [];
                       if(catGames.length === 0) return null;
                       return (
                           <div key={catKey}>
                               <h3 className="font-black text-main text-lg uppercase tracking-widest pl-2 mb-4 border-l-4 border-primary">Kategori: {catKey}</h3>
                               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                  {catGames.map((game:any) => (
                                     <div key={game.id} className="clean-card p-4 flex flex-col items-center text-center group hover:-translate-y-1 transition-transform shadow-sm relative overflow-hidden">
                                        <div className="w-16 h-16 rounded-2xl overflow-hidden mb-3 border border-theme bg-gray-100 dark:bg-black relative">
                                            <img src={game.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt=""/>
                                        </div>
                                        <h4 className="font-black text-sm text-main leading-tight mb-1 line-clamp-1">{game.name}</h4>
                                        <p className="text-[9px] text-sub-theme font-mono mb-3">{game.id}</p>
                                        <div className="flex gap-2 w-full mt-auto relative z-10">
                                            <button onClick={() => { setActiveAdminGameMenu(activeAdminGameMenu === game.id ? null : game.id) }} className="flex-1 py-1.5 bg-gray-100 dark:bg-white/10 text-[10px] font-black uppercase text-main rounded transition hover:bg-gray-200 dark:hover:bg-white/20 select-none">Menu</button>
                                            <button onClick={() => { requestAnimationFrame(()=>handleAdminDeleteGame(game.id)) }} className="px-2 bg-red-500/10 text-red-600 rounded hover:bg-red-500 hover:text-white transition"><IconTrash className="w-3 h-3"/></button>
                                        </div>
                                        {activeAdminGameMenu === game.id && (
                                            <div className="absolute inset-0 bg-white/90 dark:bg-black/90 backdrop-blur-md flex flex-col justify-center items-center p-4 gap-2 z-20 animate-slide-down">
                                                <button onClick={()=>{setActiveAdminGameMenu(null); handleAdminSaveGame({...game, inquirySku: !game.inquirySku})}} className={`w-full py-2 rounded text-[10px] font-black uppercase tracking-widest transition shadow-sm border ${game.inquirySku ? 'bg-primary-light text-primary border-primary/30' : 'bg-gray-100 dark:bg-white/10 text-sub-theme border-theme'}`}>Validasi Otomatis (Cek ID)</button>
                                                <button onClick={()=>{setActiveAdminGameMenu(null); handleAdminSaveGame({...game, category: game.category === 'pascabayar' ? 'game' : 'pascabayar'})}} className={`w-full py-2 rounded text-[10px] font-black uppercase tracking-widest transition shadow-sm border ${game.category === 'pascabayar' ? 'bg-orange-50 dark:bg-orange-900/10 text-orange-600 border-orange-500/30' : 'bg-gray-100 dark:bg-white/10 text-sub-theme border-theme'}`}>Set PascaBayar / PPOB</button>
                                                <button onClick={() => setActiveAdminGameMenu(null)} className="mt-2 text-[10px] font-bold text-red-500 underline">Tutup Menu</button>
                                            </div>
                                        )}
                                     </div>
                                  ))}
                               </div>
                           </div>
                       )
                   })}
                   {(!groupedGames || Object.keys(groupedGames).length === 0) && <div className="text-center py-20 text-sub-theme text-sm font-bold border border-dashed border-theme rounded-[2.5rem] bg-card">Katalog game utama masih kosong.</div>}
                </div>
            )}

            {activeKatalogTab === 'items' && (
                <div className="flex-1 flex flex-col h-full bg-card rounded-[2.5rem] border border-theme shadow-inner overflow-hidden p-6 md:p-8 relative">
                   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
                      <div>
                          <h3 className="text-lg font-black text-main flex items-center gap-2"><IconBox className="w-5 h-5 text-primary"/> Daftar Base Produk (SKU)</h3>
                          <p className="text-[10px] sm:text-xs text-sub-theme mt-1.5 font-medium max-w-xl leading-relaxed">Produk disinkronkan langsung dari server Digiflazz. Anda bebas mengedit Harga Jual khusus member biasa dan visibilitasnya di aplikasi klien.</p>
                      </div>
                      <button onClick={handleSyncProducts} disabled={isSyncing} className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-6 py-3.5 rounded-xl shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2 text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 whitespace-nowrap shrink-0">
                         {isSyncing ? <IconLoader className="w-5 h-5 animate-spin"/> : <IconRefreshCcw className="w-5 h-5"/>} {isSyncing ? 'Sinkronisasi Berjalan...' : 'Sinkron Digiflazz'}
                      </button>
                   </div>
                   
                   <div className="flex-1 overflow-x-auto w-full custom-scrollbar relative z-10 render-optimized border border-theme rounded-2xl">
                      <table className="w-full text-left text-sm text-main min-w-[1100px]">
                      <thead className="text-[9px] text-sub-theme uppercase tracking-widest bg-gray-100 dark:bg-white/5 sticky top-0 z-20 border-b border-theme shadow-sm">
                          <tr>
                              <th className="px-5 py-4 w-10 text-center">#</th>
                              <th className="px-5 py-4 font-black">Informasi Produk SKU</th>
                              <th className="px-5 py-4 font-black">Game / Kategori</th>
                              <th className="px-5 py-4 font-black text-emerald-600">Harga Modal (Server)</th>
                              <th className="px-5 py-4 font-black text-blue-600 border-l border-theme">Set Laba Jual (Member Biasa)</th>
                              <th className="px-5 py-4 font-black text-orange-600 border-l border-theme">Otomatisasi Reseller VIP</th>
                              <th className="px-5 py-4 text-center font-black border-l border-theme">Visibilitas Klien</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-theme">
                      {(items||[]).sort((a:any,b:any)=>(a.gameId||'').localeCompare(b.gameId||'')).map((item:any, index:number) => (
                          <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                              <td className="px-5 py-4 text-center text-[10px] text-sub-theme font-mono">{index+1}</td>
                              <td className="px-5 py-4 relative group">
                                  <div className="font-bold text-main line-clamp-1">{item.name}</div>
                                  <div className="text-[9px] font-mono text-sub-theme mt-1 bg-gray-200 dark:bg-black px-1.5 py-0.5 rounded inline-block shadow-inner">{item.sku}</div>
                                  <div className="text-[8px] bg-gray-100 opacity-0 group-hover:opacity-100 transition absolute left-0 top-full mt-1 p-2 border shadow-lg z-50 pointer-events-none rounded">{item.id}</div>
                              </td>
                              <td className="px-5 py-4 font-bold text-sub-theme text-xs uppercase">{item.gameId}</td>
                              <td className="px-5 py-4 font-mono font-black text-emerald-600 dark:text-emerald-400">{formatRupiah(item.price)}</td>
                              <td className="px-5 py-4 border-l border-theme">
                                  <div className="flex items-center gap-2">
                                     <span className="text-xs font-black text-sub-theme">+</span>
                                     <input type="number" defaultValue={item.adminProfit || 0} min="0" onBlur={(e) => {
                                         const v = Number(e.target.value);
                                         if(v !== item.adminProfit) { handleAdminSaveItem({...item, adminProfit: v, isVisible: item.isVisible ?? true}); addToast('Profit Disimpan', 'success'); }
                                     }} className="w-24 input-theme text-xs font-mono font-black p-2 rounded shadow-inner text-blue-600 dark:text-blue-400"/>
                                     <span className="text-[10px] font-bold text-main ml-2">&rarr; {formatRupiah(calculateFinalPrice(getDisplayPrice({price: item.price, adminProfit: item.adminProfit||0}), item.id))}</span>
                                  </div>
                              </td>
                              <td className="px-5 py-4 border-l border-theme">
                                 <div className="text-[9px] text-orange-600 dark:text-orange-400 font-bold bg-orange-50 dark:bg-orange-900/10 px-2 py-1 rounded border border-orange-500/20 inline-block uppercase tracking-widest shadow-sm">Margin Dinamis (Otomatis)</div>
                              </td>
                              <td className="px-5 py-4 border-l border-theme text-center">
                                  <label className="relative inline-flex items-center cursor-pointer hover:scale-105 transition-transform" title="Sembunyikan produk ini dari aplikasi klien pengguna">
                                    <input type="checkbox" className="sr-only peer" checked={item.isVisible ?? true} onChange={(e) => handleAdminSaveItem({...item, isVisible: e.target.checked})} />
                                    <div className="w-11 h-6 bg-red-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary transition-all"></div>
                                    <span className="absolute w-5 h-5 bg-white rounded-full left-0.5 top-0.5 transition-all shadow border border-gray-200"></span>
                                 </label>
                              </td>
                          </tr>
                      ))}
                      {(!items || items.length === 0) && (<tr><td colSpan={7} className="text-center py-20 text-sub-theme font-bold border border-dashed border-theme rounded-2xl bg-white/50 dark:bg-black/20">Belum ada item SKU. Tekan "Sinkron Digiflazz" untuk import awal.</td></tr>)}
                      </tbody>
                      </table>
                   </div>
                </div>
            )}
        </div>
    );
};
