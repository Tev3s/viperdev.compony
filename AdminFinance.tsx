import React from 'react';
import { IconCreditCard, IconWallet, IconShield, IconBanknote, IconCheckCircle, IconCamera, IconCheck } from '../../components/Icons';
import { formatRupiah } from '../../lib/utils';
import { useToast } from '../../context/ToastContext';

export const AdminFinance = ({ 
    financeForm, setFinanceForm, addSaldoAdmin, sysLoading, 
    depositForm, setDepositForm, reqDeposit, depositResult,
    adminGasUrl, adminOrders, setIsScannerOpen, currentUserData, setPinModalState, handleApproveCashOrder
}: any) => {

    return (
        <div className="animate-slide-down flex flex-col h-full w-full space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                <div>
                    <h2 className="text-2xl font-black text-main flex items-center gap-2 drop-shadow-sm"><IconCreditCard className="w-6 h-6 text-primary"/> Manajemen Keuangan</h2>
                    <p className="text-xs text-sub-theme font-medium mt-1">Otorisasi penambahan Saldo Akun (E-Wallet) milik pelanggan & Deposit Pusat.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6 md:p-8 rounded-[2.5rem] border border-blue-500/30 shadow-inner h-fit">
                    <h3 className="text-lg font-black text-blue-700 dark:text-blue-400 mb-6 drop-shadow-sm flex items-center gap-2"><IconWallet className="w-5 h-5"/> Top Up Saldo Pelanggan</h3>
                    <p className="text-[10px] text-sub-theme mb-6">Gunakan form ini jika pelanggan telah mentransfer dana via QRIS manual atau membayar Cash ke Admin.</p>
                    
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest ml-1">Email Pelanggan</label>
                            <input type="email" value={financeForm.userEmail} onChange={(e)=>setFinanceForm({...financeForm, userEmail: e.target.value})} placeholder="emailmember@gmail.com" className="w-full input-theme rounded-xl py-3.5 px-4 focus:border-blue-500 text-sm shadow-sm transition" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest ml-1">Nominal Top Up (Rp)</label>
                            <input type="number" value={financeForm.amount} onChange={(e)=>setFinanceForm({...financeForm, amount: e.target.value})} placeholder="Contoh: 50000" className="w-full input-theme rounded-xl py-3.5 px-4 focus:border-blue-500 text-sm font-mono shadow-sm transition" />
                        </div>
                        
                        <button onClick={addSaldoAdmin} disabled={sysLoading.active} className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl shadow-lg transition text-xs uppercase tracking-widest disabled:opacity-50 hover:scale-[1.02] flex items-center justify-center gap-2">
                            <IconShield className="w-4 h-4"/> Konfirmasi & Tambah Saldo
                        </button>
                    </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-6 md:p-8 rounded-[2.5rem] border border-purple-500/30 shadow-inner h-fit">
                    <h3 className="text-lg font-black text-purple-700 dark:text-purple-400 mb-6 drop-shadow-sm flex items-center gap-2"><IconBanknote className="w-5 h-5"/> Tiket Deposit Digiflazz</h3>
                    <p className="text-[10px] text-sub-theme mb-6">Minta tiket instruksi transfer ke BCA/MANDIRI/BRI Digiflazz langsung dari sini tanpa login ke panel web pusat.</p>
                    
                    <form onSubmit={reqDeposit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest ml-1">Nominal Deposit</label>
                            <input type="number" required value={depositForm.amount} onChange={(e)=>setDepositForm({...depositForm, amount: e.target.value})} placeholder="Contoh: 1000000" className="w-full input-theme rounded-xl py-3.5 px-4 focus:border-purple-500 text-sm shadow-sm transition font-mono" />
                        </div>
                        <div className="flex gap-3">
                            <div className="space-y-1.5 flex-1">
                                <label className="text-[9px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest ml-1">Bank Tujuan</label>
                                <select value={depositForm.bank} onChange={(e)=>setDepositForm({...depositForm, bank: e.target.value})} className="w-full input-theme rounded-xl py-3.5 px-4 focus:border-purple-500 text-sm shadow-sm transition appearance-none">
                                    <option value="BCA">BCA</option><option value="MANDIRI">MANDIRI</option><option value="BRI">BRI</option><option value="BSI">BSI</option>
                                </select>
                            </div>
                            <div className="space-y-1.5 flex-1">
                                <label className="text-[9px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest ml-1">Nama Pemilik Rekening</label>
                                <input type="text" required value={depositForm.owner_name} onChange={(e)=>setDepositForm({...depositForm, owner_name: e.target.value})} placeholder="Nama Anda" className="w-full input-theme rounded-xl py-3.5 px-4 focus:border-purple-500 text-sm shadow-sm transition uppercase" />
                            </div>
                        </div>
                        <button type="submit" disabled={sysLoading.active || !adminGasUrl} className="w-full mt-4 bg-purple-600 hover:bg-purple-500 text-white font-black py-4 rounded-xl shadow-lg transition text-xs uppercase tracking-widest disabled:opacity-50 hover:scale-[1.02] flex items-center justify-center gap-2">
                            Minta Tiket Transfer
                        </button>
                    </form>
                    
                    {depositResult && (
                        <div className="mt-6 p-4 bg-white dark:bg-black/50 border-2 border-dashed border-purple-500/50 rounded-2xl">
                            <p className="text-[10px] font-black text-sub-theme uppercase mb-2">Instruksi Transfer:</p>
                            <p className="text-sm font-medium mb-1 text-main">{depositResult.notes}</p>
                            <div className="text-xl font-black font-mono text-primary mt-2">{formatRupiah(depositResult.amount)}</div>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-orange-50 dark:bg-orange-950/20 p-6 md:p-8 rounded-[2.5rem] border border-orange-500/30 shadow-inner flex flex-col h-full mt-4">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-black text-orange-700 dark:text-orange-400 drop-shadow-sm flex items-center gap-2"><IconCheckCircle className="w-5 h-5"/> Validasi Top Up (Pending)</h3>
                    <button onClick={() => setIsScannerOpen(true)} className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-md transition flex items-center gap-2 hover:scale-105"><IconCamera className="w-4 h-4"/> Scan Kasir</button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3 render-optimized">
                    {(adminOrders||[]).filter((o:any) => o.gameId === 'TOPUP_SALDO' && o.status === 'Pending').map((order:any) => (
                        <div key={order.id} className="bg-white dark:bg-black/40 p-4 rounded-2xl border border-orange-500/20 shadow-sm flex flex-col gap-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs font-black text-main">{order.targetUserId}</p>
                                    <p className="text-[9px] text-sub-theme font-mono">Trx ID: {order.id}</p>
                                    <p className="text-[9px] font-bold mt-1 text-primary bg-primary-light px-2 py-0.5 rounded border border-primary/20 inline-block uppercase tracking-widest">{order.paymentMethod}</p>
                                </div>
                                <span className="bg-orange-500/10 text-orange-600 dark:text-orange-400 px-2 py-1 rounded text-[9px] font-black uppercase border border-orange-500/20">Pending</span>
                            </div>
                            <div className="flex justify-between items-center border-t border-orange-500/10 pt-3">
                                <span className="font-mono font-black text-sm text-emerald-600 dark:text-emerald-400">{formatRupiah(order.priceTotal)}</span>
                                <button onClick={() => { handleApproveCashOrder(order); }} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-md transition flex items-center gap-1"><IconCheck className="w-3 h-3"/> Validasi</button>
                            </div>
                        </div>
                    ))}
                    {(adminOrders||[]).filter((o:any) => o.gameId === 'TOPUP_SALDO' && o.status === 'Pending').length === 0 && <div className="text-center py-8 text-sub-theme text-xs font-bold border border-dashed border-orange-500/30 rounded-xl">Belum ada pengajuan isi saldo.</div>}
                </div>
            </div>
        </div>
    );
};
