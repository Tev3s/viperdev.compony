import React from 'react';
import { IconList, IconCamera, IconSearch, IconTrash, IconCopy, IconCheckCircle, IconLoader, IconX, IconPrinter, IconRefresh } from '../../components/Icons';
import { formatRupiah } from '../../lib/utils';
import { useToast } from '../../context/ToastContext';

export const AdminOrders = ({ 
    isStandbyMode, setIsStandbyMode, setIsScannerOpen, adminOrderSearch, setAdminOrderSearch,
    selectedOrdersForDelete, handleSelectOrder, handleBulkDeleteOrders, adminOrders,
    addToast, isProcessing, updateOrderStatus, executeBluetoothPrint
}: any) => {

    return (
        <div className="animate-slide-down flex flex-col h-full w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-black text-main flex items-center gap-2 drop-shadow-sm"><IconList className="w-6 h-6 text-primary"/> Manajemen Pesanan</h2>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 px-4 py-2.5 rounded-xl border border-theme shadow-sm">
                    <span className="text-[10px] font-bold text-main uppercase tracking-widest">Auto Print BT</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={isStandbyMode} onChange={(e) => setIsStandbyMode(e.target.checked)} />
                        <div className="w-9 h-5 bg-gray-300 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-emerald-500 transition-all"></div>
                    </label>
                </div>
                <button onClick={() => setIsScannerOpen(true)} className="flex-1 bg-primary hover:bg-primary-hover text-white px-4 py-2.5 rounded-xl font-black text-[10px] uppercase flex items-center justify-center gap-2 shadow-md hover:scale-105 transition-transform"><IconCamera className="w-4 h-4"/> Scan Kasir</button>
                </div>
            </div>

            <div className="relative mb-6 flex gap-3">
                <div className="relative flex-1">
                <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-sub-theme w-5 h-5" />
                <input type="text" placeholder="Cari ID Transaksi / Email..." value={adminOrderSearch} onChange={(e) => setAdminOrderSearch(e.target.value)} className="w-full input-theme rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-primary shadow-sm transition" />
                </div>
                {selectedOrdersForDelete.length > 0 && (
                    <button onClick={handleBulkDeleteOrders} className="bg-red-600 hover:bg-red-500 text-white px-4 rounded-xl font-black text-[10px] uppercase flex items-center gap-2 whitespace-nowrap shadow-md transition">
                    <IconTrash className="w-4 h-4"/> Hapus ({selectedOrdersForDelete.length})
                    </button>
                )}
            </div>

            <div className="flex-1 w-full max-w-full overflow-x-auto custom-scrollbar bg-gray-50 dark:bg-black/50 rounded-[2rem] border border-theme shadow-inner render-optimized">
                <table className="w-full text-left text-sm text-main min-w-[1000px]">
                <thead className="text-[10px] text-sub-theme uppercase bg-gray-100 dark:bg-white/5 sticky top-0 z-10 border-b border-theme shadow-sm">
                    <tr>
                        <th className="px-5 py-4 w-10 text-center"><IconCheckCircle className="w-4 h-4 mx-auto opacity-50"/></th>
                        <th className="px-5 py-4 font-black">Pelanggan & ID</th>
                        <th className="px-5 py-4 font-black">Layanan & Produk</th>
                        <th className="px-5 py-4 font-black">Data Tujuan</th>
                        <th className="px-5 py-4 font-black text-emerald-600">Finansial</th>
                        <th className="px-5 py-4 font-black">Status</th>
                        <th className="px-5 py-4 text-center font-black">Aksi Tindakan</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-theme">
                {(adminOrders || []).filter((o:any) => ((o?.id || '').toLowerCase().includes((adminOrderSearch||'').toLowerCase()) || (o?.userEmail || '').toLowerCase().includes((adminOrderSearch||'').toLowerCase()))).map((order:any) => (
                    <tr key={order.id} className={`transition-colors ${selectedOrdersForDelete.includes(order.id) ? 'bg-red-500/10' : 'hover:bg-white dark:hover:bg-white/[0.03]'}`}>
                        <td className="px-5 py-4 text-center">
                            <input type="checkbox" checked={selectedOrdersForDelete.includes(order.id)} onChange={() => handleSelectOrder(order.id)} className="w-4 h-4 text-primary rounded border-gray-300" />
                        </td>
                        <td className="px-5 py-4">
                            <div className="font-bold text-main truncate max-w-[150px]">{(order?.userEmail || 'Guest').split('@')[0]}</div>
                            <div className="text-[9px] text-sub-theme font-mono mt-1 truncate max-w-[150px] bg-gray-200 dark:bg-black px-2 py-0.5 rounded border border-theme inline-block shadow-inner">{order?.id}</div>
                        </td>
                        <td className="px-5 py-4">
                            <div className="text-primary font-bold truncate max-w-[180px]">{order?.gameName || '-'}</div>
                            <div className="text-xs text-sub-theme mt-1 truncate max-w-[180px]">{order?.nominalName || '-'}</div>
                        </td><td className="px-5 py-4">
                            <div className="font-mono font-bold bg-white dark:bg-white/5 rounded-lg inline-flex flex-col gap-1 px-3 py-2 border border-theme shadow-sm text-main max-w-[220px] overflow-hidden overflow-ellipsis text-xs">
                            <div className="flex justify-between items-center w-full">
                                <span className="truncate">{order?.targetUserId} {order?.targetZoneId ? `(${order.targetZoneId})` : ''}</span>
                                <button onClick={()=>{navigator.clipboard.writeText(order?.targetUserId); addToast('ID disalin', 'success');}} className="p-1 text-sub-theme hover:text-main transition shrink-0 tooltip" title="Salin ID Game/Pelanggan"><IconCopy className="w-3.5 h-3.5"/></button>
                            </div>
                            {order?.targetNickname && <div className="text-[10px] text-emerald-500 font-bold border-t border-theme pt-1 mt-1 truncate">{order.targetNickname}</div>}
                            {order?.sn && <div className="text-[10px] text-primary font-bold border-t border-theme pt-1 mt-1 truncate">SN: {order.sn}</div>}
                            </div>
                        </td>
                        <td className="px-5 py-4">
                            <div className="font-black text-main text-sm">{formatRupiah(order?.priceTotal)}</div>
                            {order?.status === 'Sukses' && <div className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 mt-1 uppercase">Laba: {formatRupiah(order.profit || 0)}</div>}
                            <div className="flex flex-wrap gap-1.5 mt-2">
                            <span className="text-[8px] bg-gray-200 dark:bg-white/10 text-sub-theme px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-theme">{order?.paymentMethod}</span>
                            {order?.promoUsed && <span className="text-[8px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider flex items-center border border-emerald-500/20"> {order.promoUsed}</span>}
                            </div>
                        </td>
                        <td className="px-5 py-4">
                            <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black border uppercase tracking-widest shadow-sm inline-block ${order?.status === 'Sukses' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' : order?.status === 'Batal' ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30' : order?.status === 'Diproses Server' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30' : 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30'}`}>{order?.status}</span>
                            <div className="text-[8px] text-sub-theme mt-2 font-bold">{order?.createdAt ? new Date(order.createdAt).toLocaleDateString('id-ID') : '-'}</div>
                        </td>
                        <td className="px-5 py-4">
                            <div className="flex items-center justify-center gap-2">
                            <button onClick={() => executeBluetoothPrint(order)} className="p-2.5 bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-50 hover:text-white transition tooltip shadow-sm hover:scale-105" title="Cetak Struk BT"><IconPrinter className="w-4 h-4" /></button>
                            {order?.status === 'Pending' && (
                                <>
                                    {order?.paymentMethod?.toLowerCase().includes('cash') ? (
                                        <button onClick={() => setIsScannerOpen(true)} className="p-2.5 bg-orange-500/10 border border-orange-500/30 text-orange-600 dark:text-orange-400 rounded-xl hover:bg-orange-500 hover:text-white transition tooltip shadow-sm hover:scale-105" title="Scan QR Pembeli untuk Validasi Kasir"><IconCamera className="w-4 h-4" strokeWidth={3} /></button>
                                    ) : (
                                        <button onClick={() => updateOrderStatus(order, 'Sukses')} disabled={isProcessing} className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-xl hover:bg-emerald-50 hover:text-white transition tooltip shadow-sm hover:scale-105 disabled:opacity-50" title="Tandai Lunas & Proses API"><IconCheckCircle className="w-4 h-4" /></button>
                                    )}
                                    <button onClick={() => updateOrderStatus(order, 'Batal')} disabled={isProcessing} className="p-2.5 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition tooltip shadow-sm hover:scale-105 disabled:opacity-50" title="Batalkan Pesanan"><IconX className="w-4 h-4" /></button>
                                </>
                            )}
                            {order?.status === 'Diproses Server' && (
                                <button onClick={() => { addToast('Mengecek Status API...', 'process'); updateOrderStatus(order, 'SuksesManual'); }} disabled={isProcessing} className="p-2.5 bg-purple-500/10 border border-purple-500/30 text-purple-600 dark:text-purple-400 rounded-xl hover:bg-purple-500 hover:text-white transition tooltip shadow-sm hover:scale-105 disabled:opacity-50" title="Cek Status API (Manual)"><IconRefresh className="w-4 h-4" /></button>
                            )}
                            </div>
                        </td>
                    </tr>
                ))}
                {(!adminOrders || adminOrders.filter((o:any) => o.status !== 'Dihapus').length === 0) && (<tr><td colSpan={7} className="text-center py-20 text-sub-theme font-bold border border-dashed border-theme rounded-2xl bg-white/50 dark:bg-white/5">Tidak ada pesanan yang sesuai dalam database.</td></tr>)}
                </tbody>
                </table>
            </div>
        </div>
    );
};
