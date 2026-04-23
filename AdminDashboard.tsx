import React from 'react';
import { IconTrendingUp, IconList, IconCheckCircle, IconUsers, IconBanknote } from '../../components/Icons';
import { formatRupiah } from '../../lib/utils';

export const AdminDashboard = ({ allGlobalOrders, memberList }: any) => {
    return (
        <div className="animate-slide-down">
            <h2 className="text-2xl font-black mb-6 text-main px-2 flex items-center gap-2 drop-shadow-sm"><IconTrendingUp className="w-6 h-6 text-primary"/> Ringkasan Sistem Server</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="bg-gradient-to-br from-primary to-primary-hover dark:from-gray-800 dark:to-gray-900 rounded-[2rem] p-6 text-white shadow-xl border border-primary/30 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <IconList className="w-8 h-8 mb-4 text-white opacity-90 relative z-10" />
                <p className="text-[10px] font-black uppercase opacity-80 mb-1 relative z-10">Total Pesanan Masuk</p>
                <p className="text-4xl font-black font-mono relative z-10 drop-shadow-md">{(allGlobalOrders||[]).length}</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-gray-800 dark:to-gray-900 rounded-[2rem] p-6 text-white shadow-xl border border-emerald-400/30 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <IconCheckCircle className="w-8 h-8 mb-4 text-white opacity-90 relative z-10" />
                <p className="text-[10px] font-black uppercase opacity-80 mb-1 relative z-10">Pesanan Berhasil (Sukses)</p>
                <p className="text-4xl font-black font-mono relative z-10 drop-shadow-md">{(allGlobalOrders||[]).filter((o:any) => o.status === 'Sukses').length}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 dark:from-gray-800 dark:to-gray-900 rounded-[2rem] p-6 text-white shadow-xl border border-purple-400/30 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <IconUsers className="w-8 h-8 mb-4 text-white opacity-90 relative z-10" />
                <p className="text-[10px] font-black uppercase opacity-80 mb-1 relative z-10">Member Terdaftar</p>
                <p className="text-4xl font-black font-mono relative z-10 drop-shadow-md">{(memberList||[]).length}</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
                <div className="bg-white dark:bg-black/50 p-6 rounded-[2rem] border border-theme shadow-inner flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase text-sub-theme mb-1">Total Laba Bersih API</p>
                        <p className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">{formatRupiah((allGlobalOrders||[]).filter((o:any) => o.status === 'Sukses').reduce((acc:any, curr:any) => acc + (curr.profit || 0), 0))}</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-600"><IconTrendingUp className="w-6 h-6"/></div>
                </div>
                <div className="bg-white dark:bg-black/50 p-6 rounded-[2rem] border border-theme shadow-inner flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase text-sub-theme mb-1">Saldo Tertahan (Pending)</p>
                        <p className="text-2xl font-black font-mono text-orange-600 dark:text-orange-400">{formatRupiah((allGlobalOrders||[]).filter((o:any) => o.status === 'Pending').reduce((acc:any, curr:any) => acc + (curr.priceTotal || 0), 0))}</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-600"><IconBanknote className="w-6 h-6"/></div>
                </div>
            </div>

            <div className="mt-8 bg-gray-50 dark:bg-black/50 rounded-[2rem] p-5 md:p-6 border border-theme shadow-inner">
                <h3 className="text-sm font-black uppercase tracking-widest text-sub-theme mb-5 flex items-center gap-2"><IconList className="w-4 h-4"/> Aktivitas Transaksi Terkini</h3>
                <div className="space-y-3 render-optimized">
                {(allGlobalOrders||[]).slice(0,5).map((o:any) => (
                    <div key={o.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white dark:bg-white/5 p-4 rounded-2xl border border-theme shadow-sm gap-3 hover:border-primary/30 transition">
                        <div className="flex items-center gap-4 min-w-0">
                            <div className={`w-3 h-3 rounded-full shrink-0 shadow-sm ${o.status==='Pending'?'bg-orange-500 animate-pulse':o.status==='Sukses'?'bg-emerald-500':'bg-red-500'}`}></div>
                            <div className="min-w-0 flex-1">
                            <div className="text-sm font-bold text-main truncate">{(o.userEmail || '').split('@')[0]} <span className="text-xs text-sub-theme font-medium">membeli</span> {o.gameName}</div>
                            <div className="text-[10px] font-mono text-sub-theme mt-1 truncate">{o.id}</div>
                            </div>
                        </div>
                        <div className="text-left sm:text-right pl-7 sm:pl-0 border-t sm:border-t-0 border-theme pt-3 sm:pt-0 shrink-0">
                            <div className="text-sm font-black font-mono text-emerald-600 dark:text-emerald-400">{formatRupiah(o.priceTotal)}</div>
                            <div className="text-[9px] text-sub-theme uppercase tracking-widest mt-1 font-bold">{o.createdAt ? new Date(o.createdAt).toLocaleTimeString('id-ID') : '-'}</div>
                        </div>
                    </div>
                ))}
                {(!allGlobalOrders || allGlobalOrders.length === 0) && <p className="text-sm text-sub-theme text-center py-8 font-bold border border-dashed border-theme rounded-2xl bg-white/50 dark:bg-white/5">Belum ada aktivitas transaksi.</p>}
                </div>
            </div>
        </div>
    );
};
