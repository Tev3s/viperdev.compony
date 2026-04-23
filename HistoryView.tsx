import React from 'react';
import { IconHistory, IconDownload, IconCheckCircle, IconX, IconLoader, IconQrcode, IconChevronUp, IconChevronDown, IconCopy, IconHelp } from '../components/Icons';
import { formatRupiah, generateDynamicQRIS } from '../lib/utils';
import { BASE_QRIS } from '../lib/constants';
import { useToast } from '../context/ToastContext';

export const HistoryView = ({ 
    userOrders, games, expandedHistoryId, setExpandedHistoryId, 
    handleDownloadCSV, handleOrderHelp, globalConfig, navigateTo, authUser, currentUserData 
}: any) => {
    const { addToast } = useToast();
    return (
        <div className="animate-slide-down pb-10 max-w-5xl mx-auto pt-4 w-full relative z-10">
           <div className="clean-card rounded-[3rem] p-6 md:p-10 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 border-b border-theme pb-8">
                 <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-navy-800 rounded-2xl flex items-center justify-center text-white shadow-lg"><IconHistory className="w-8 h-8"/></div>
                    <div>
                       <h2 className="text-2xl md:text-3xl font-black leading-tight text-main drop-shadow-sm">Riwayat Transaksi</h2>
                       <p className="text-xs text-sub-theme font-medium mt-1.5 drop-shadow-sm">Pantau status pesanan dan instruksi pembayaran.</p>
                    </div>
                 </div>
                 <div className="flex flex-col gap-3 items-start sm:items-end">
                    <div className="bg-gray-100 dark:bg-black/50 px-5 py-3 rounded-2xl text-xs font-bold text-sub-theme border border-theme flex items-center gap-3 shadow-inner">
                       Total Pemesanan: <span className="text-main text-lg font-black font-mono bg-white dark:bg-white/10 px-3 py-0.5 rounded-lg border border-theme shadow-sm">{(userOrders||[]).filter((o:any) => o.gameId !== 'TOPUP_SALDO').length}</span>
                    </div>
                    <button onClick={handleDownloadCSV} className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-md flex items-center gap-2 hover:bg-emerald-500 transition"><IconDownload className="w-4 h-4"/> Unduh Riwayat (Excel/CSV)</button>
                    <p className="text-[9px] text-red-600 dark:text-red-400 font-bold bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/30 max-w-xs sm:text-right mt-1 shadow-sm leading-relaxed"><b>Pemberitahuan Sistem:</b> Riwayat transaksi Anda akan dibersihkan otomatis setiap 30 hari untuk menjaga kecepatan sistem server web ini.</p>
                 </div>
              </div>
              
              <div className="space-y-4 render-optimized">
                 {(userOrders||[]).filter((o:any) => o.gameId !== 'TOPUP_SALDO').length > 0 ? (userOrders||[]).filter((o:any) => o.gameId !== 'TOPUP_SALDO').map((order:any) => {
                    const isExpanded = expandedHistoryId === order.id;
                    const gameIcon = (games||[]).find((g:any) => g.id === order.gameId)?.image || 'https://via.placeholder.com/150';
                    const isPln = (games||[]).find((g:any) => g.id === order.gameId)?.category === 'pln';
                    
                    return (
                    <div key={order.id} className={`bg-card border rounded-[2rem] overflow-hidden shadow-sm transition-all receipt-cut receipt-edge ${isExpanded ? 'border-primary ring-1 ring-primary/50' : 'border-theme hover:border-primary/50'}`}>
                       <div onClick={() => setExpandedHistoryId(isExpanded ? null : order.id)} className="p-5 md:p-6 flex flex-col md:flex-row justify-between md:items-center gap-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors relative z-10">
                          <div className="flex gap-4 items-center w-full md:w-auto">
                             <div className="relative shrink-0">
                                <img src={gameIcon} className="w-14 h-14 rounded-2xl object-cover border border-theme shadow-sm" alt=""/>
                                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-lg flex items-center justify-center border border-theme shadow-sm ${order.status === 'Sukses' ? 'bg-emerald-500' : order.status === 'Batal' ? 'bg-red-500' : 'bg-primary'}`}>
                                    {order.status === 'Sukses' ? <IconCheckCircle className="w-3 h-3 text-white"/> : order.status === 'Batal' ? <IconX className="w-3 h-3 text-white"/> : <IconLoader className="w-3 h-3 text-white animate-spin"/>}
                                </div>
                             </div>
                             <div className="flex-1 min-w-0">
                                <div className="font-black text-sm md:text-base text-main mb-0.5 truncate">{order.gameName || 'Layanan'}</div>
                                <div className="text-xs text-sub-theme font-bold mb-2 truncate">{order.nominalName || 'Produk'}</div>
                                <div className="text-[9px] text-main font-bold px-2 py-0.5 rounded bg-gray-200 dark:bg-white/10 border border-theme inline-flex items-center gap-1 uppercase shadow-sm"><IconQrcode className="w-3 h-3"/> {order.paymentMethod || 'Metode'}</div>
                             </div>
                          </div>
                          
                          <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-theme pt-4 md:pt-0 md:pl-6 md:border-l w-full md:w-auto shrink-0">
                                 <div className="flex flex-col text-left md:text-right">
                                    <span className="text-[9px] font-black text-sub-theme uppercase tracking-widest">Total Tagihan</span>
                                    <span className="text-lg font-black text-main font-mono">{formatRupiah(order.priceTotal)}</span>
                                 </div>
                                 <div className="flex flex-col items-end gap-2">
                                    <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border shadow-sm ${order.status==='Sukses'?'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30':order.status==='Batal'?'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30':'bg-primary-light text-primary border-primary/30'}`}>{order.status}</span>
                                    <div className="text-sub-theme bg-gray-100 dark:bg-white/5 border border-theme rounded-md p-1 shadow-inner">{isExpanded ? <IconChevronUp className="w-4 h-4"/> : <IconChevronDown className="w-4 h-4"/>}</div>
                                 </div>
                              </div>
                           </div>

                           {isExpanded && (
                              <div className="p-5 md:p-6 border-t border-theme bg-gray-50 dark:bg-black/40 animate-slide-down flex flex-col md:flex-row gap-6 shadow-inner relative z-10">
                                 <div className="flex-1 space-y-4">
                                    <div><p className="text-[9px] font-black text-sub-theme uppercase mb-1">ID Pesanan Invoice</p><p className="font-mono text-xs font-black text-main bg-white dark:bg-black/80 px-3 py-1.5 rounded-lg inline-block border border-theme shadow-sm">{order.id}</p></div>
                                    <div><p className="text-[9px] font-black text-sub-theme uppercase mb-1">Data Tujuan</p><p className="font-mono text-sm font-bold text-main bg-white dark:bg-black/80 px-3 py-1.5 rounded-lg inline-block border border-theme shadow-sm">{(order.targetUserId || '')} {(order.targetZoneId || '') && `(${(order.targetZoneId || '')})`}</p></div>
                                    {order.targetNickname && (<div><p className="text-[9px] font-black text-primary uppercase mb-1">Nama / Nickname</p><p className="font-bold text-sm text-main">{order.targetNickname}</p></div>)}
                                    <div><p className="text-[9px] font-black text-sub-theme uppercase mb-1">Waktu Transaksi</p><p className="text-xs font-bold text-main">{order.createdAt ? new Date(order.createdAt).toLocaleString('id-ID', {day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'}) : '-'}</p></div>
                                    
                                    {order.sn && (
                                        <div className={`mt-4 p-4 ${isPln ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500/50 border-2 border-dashed' : 'bg-white dark:bg-black/50 border-2 border-dashed border-primary/40'} rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-3 shadow-md`}>
                                            <div>
                                                <p className={`text-[9px] font-black uppercase mb-1 ${isPln ? 'text-emerald-600 dark:text-emerald-500' : 'text-sub-theme'}`}>{isPln ? 'KODE TOKEN LISTRIK (PLN)' : 'SN / Token / Kode Struk'}</p>
                                                <p className={`font-mono text-base md:text-xl font-black select-all tracking-widest ${isPln ? 'text-emerald-700 dark:text-emerald-400' : 'text-primary'}`}>{order.sn}</p>
                                            </div>
                                            <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(order.sn); addToast('Kode/SN disalin!', 'success'); }} className={`py-3 px-5 rounded-xl transition text-xs font-black uppercase tracking-widest border shadow-sm flex items-center justify-center gap-2 hover:scale-105 shrink-0 ${isPln ? 'bg-emerald-500 text-white hover:bg-emerald-600 border-emerald-600' : 'bg-primary/10 text-primary border-primary/30 hover:bg-primary hover:text-white'}`}><IconCopy className="w-4 h-4"/> Salin</button>
                                        </div>
                                    )}

                                    {order.cashbackEarned > 0 && order.status === 'Sukses' && (<div><p className="text-[9px] font-black text-emerald-500 uppercase mb-1">Cashback Diterima</p><p className="font-bold text-sm text-emerald-600 dark:text-emerald-400">+ {formatRupiah(order.cashbackEarned)}</p></div>)}
                                    
                                    <button onClick={(e) => { e.stopPropagation(); handleOrderHelp(order); }} className="mt-4 bg-primary-light text-primary border border-primary/30 font-bold py-2.5 px-5 rounded-xl text-xs flex items-center gap-2 shadow-sm hover:bg-primary hover:text-white transition">
                                        <IconHelp className="w-4 h-4"/> Bantuan Transaksi Ini
                                    </button>
                                 </div>
                                 
                                 {order.status === 'Pending' && (
                                    <div className="w-full md:w-72 bg-white dark:bg-black/80 p-5 rounded-[2rem] border border-primary/40 flex flex-col items-center justify-center shadow-xl shrink-0 relative text-center">
                                        {(order.paymentMethod || '').includes('QRIS') ? (
                                            <>
                                                <p className="text-[10px] text-main font-black mb-3 uppercase flex items-center justify-center gap-2"><IconQrcode className="w-4 h-4 text-primary"/> Scan QRIS Untuk Bayar</p>
                                                <div className="bg-white p-3 rounded-2xl border border-gray-200 mb-4 shadow-inner"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(generateDynamicQRIS(globalConfig?.baseQris || BASE_QRIS, order.priceTotal))}&margin=10`} className="w-40 h-40 object-contain" alt="" /></div>
                                                <a href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(generateDynamicQRIS(globalConfig?.baseQris || BASE_QRIS, order.priceTotal))}&margin=10`} target="_blank" rel="noreferrer" download="QRIS_Vipercell.jpg" className="bg-gray-100 dark:bg-white/10 text-main text-[9px] font-black px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 border border-theme uppercase w-full shadow-sm hover:bg-gray-200 dark:hover:bg-white/20 transition"><IconDownload className="w-3.5 h-3.5"/> Simpan QR Code</a>
                                            </>
                                        ) : (order.paymentMethod || '').includes('Saldo Akun') ? (
                                            <>
                                                <p className="text-[10px] text-main font-black mb-3 uppercase flex items-center justify-center gap-2"><IconWallet className="w-4 h-4 text-primary"/> Pembayaran Otomatis</p>
                                                <div className="text-center w-full bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-theme shadow-sm mb-3">
                                                   <IconLoader className="w-8 h-8 text-primary animate-spin mx-auto mb-2"/>
                                                   <p className="text-[10px] text-sub-theme font-medium leading-relaxed">Sistem sedang memproses transaksi dan memotong saldo. Mohon tunggu.</p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <p className="text-[10px] text-main font-black mb-3 uppercase flex items-center justify-center gap-2"><IconBanknote className="w-4 h-4 text-primary"/> Tunjukkan QR ke Kasir</p>
                                                <div className="bg-white p-3 rounded-2xl border border-gray-200 mb-3 shadow-inner"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=CASH-VPC-${(order.id||'').substring(0,6).toUpperCase()}-${order.priceTotal}&margin=10`} className="w-40 h-40 object-contain" alt="" /></div>
                                                <div className="text-center w-full bg-gray-50 dark:bg-white/5 p-3 rounded-xl border border-theme shadow-sm"><p className="text-[9px] text-sub-theme font-mono">{order.id}</p><p className="text-sm font-black text-primary">{formatRupiah(order.priceTotal)}</p></div>
                                            </>
                                        )}
                                    </div>
                                 )}
                              </div>
                           )}
                        </div>
                     )
                     }) : (
                        <div className="text-center py-24 text-sub-theme border border-dashed border-theme rounded-[3rem] bg-gray-50 dark:bg-black/40 shadow-inner">
                           <div className="w-24 h-24 bg-gray-200 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-theme shadow-sm"><IconHistory className="w-10 h-10 opacity-30 text-main"/></div>
                           <p className="font-black text-xl text-main mb-2 drop-shadow-sm">Belum Ada Transaksi</p>
                           <p className="text-sm font-medium opacity-80 max-w-sm mx-auto">Riwayat pesanan Anda masih kosong.</p>
                           <button onClick={()=>navigateTo('home')} className="mt-8 bg-primary text-white px-8 py-4 rounded-2xl font-black text-xs uppercase shadow-xl hover:scale-105 transition-transform hover:bg-primary-hover">Mulai Transaksi</button>
                        </div>
                     )}
                  </div>
               </div>
        </div>
    );
};

const IconWallet = ({ className: c }: { className?: string }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={c}><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" /></svg>;
const IconBanknote = ({ className: c }: { className?: string }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={c}><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" /></svg>;
