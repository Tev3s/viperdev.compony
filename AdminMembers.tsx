import React from 'react';
import { IconUsers, IconSearch, IconTrendingUp, IconScanFace, IconWhatsapp, IconBlock, IconTrash, IconBox, IconCheckCircle, IconLoader } from '../../components/Icons';
import { formatRupiah } from '../../lib/utils';

export const AdminMembers = ({ 
    adminMemberTab, setAdminMemberTab, memberList, handleAdminAddMember,
    newMemberEmail, setNewMemberEmail, newMemberName, setNewMemberName,
    newMemberPhone, setNewMemberPhone, newMemberPassword, setNewMemberPassword,
    authLoading, adminApiKey, adminMemberSearch, setAdminMemberSearch, setAdminViewFaceModal,
    handleBlockMember, handleDeleteMember, handleResellerAction, requestConfirm, addToast
}: any) => {

    return (
        <div className="animate-slide-down flex flex-col h-full w-full p-2 md:p-6 bg-gray-50 dark:bg-black/20 rounded-[2.5rem] border border-theme shadow-inner">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-black text-main flex items-center gap-2 drop-shadow-sm"><IconUsers className="w-6 h-6 text-primary"/> Manajemen Pengguna</h2>
                <div className="flex bg-card border border-theme p-1 rounded-xl shadow-sm">
                    <button onClick={()=>setAdminMemberTab('all')} className={`px-4 py-2 text-xs font-bold rounded-lg transition ${adminMemberTab==='all' ? 'bg-primary text-white' : 'text-sub-theme hover:bg-gray-100 dark:hover:bg-white/5'}`}>Daftar Member</button>
                    <button onClick={()=>setAdminMemberTab('reseller')} className={`px-4 py-2 text-xs font-bold rounded-lg transition relative ${adminMemberTab==='reseller' ? 'bg-orange-500 text-white' : 'text-sub-theme hover:bg-gray-100 dark:hover:bg-white/5'}`}>
                        Kelola Reseller
                        {(memberList||[]).filter((m:any)=>m.resellerStatus==='pending').length > 0 && <span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span></span>}
                    </button>
                </div>
            </div>

            {adminMemberTab === 'all' && (
                <>
                    <form onSubmit={handleAdminAddMember} className="bg-card p-5 rounded-2xl border border-theme shadow-sm mb-6 flex flex-wrap gap-3 items-end">
                        <div className="flex-1 min-w-[180px]"><label className="text-[10px] font-black text-sub-theme uppercase mb-1 block">Email Baru</label><input type="email" required value={newMemberEmail} onChange={(e)=>setNewMemberEmail(e.target.value)} className="w-full input-theme p-3 rounded-xl text-xs" placeholder="email@gmail.com"/></div>
                        <div className="flex-1 min-w-[180px]"><label className="text-[10px] font-black text-sub-theme uppercase mb-1 block">Sandi Akun</label><input type="text" required minLength={6} value={newMemberPassword} onChange={(e)=>setNewMemberPassword(e.target.value)} className="w-full input-theme p-3 rounded-xl text-xs" placeholder="Min. 6 Karakter"/></div>
                        <div className="flex-1 min-w-[180px]"><label className="text-[10px] font-black text-sub-theme uppercase mb-1 block">Nama Lengkap</label><input type="text" required value={newMemberName} onChange={(e)=>setNewMemberName(e.target.value)} className="w-full input-theme p-3 rounded-xl text-xs" placeholder="Nama Member"/></div>
                        <div className="flex-1 min-w-[180px]"><label className="text-[10px] font-black text-sub-theme uppercase mb-1 block">No Handphone</label><input type="tel" required value={newMemberPhone} onChange={(e)=>setNewMemberPhone(e.target.value)} className="w-full input-theme p-3 rounded-xl text-xs" placeholder="08xx"/></div>
                        <button type="submit" disabled={authLoading || !adminApiKey} className="bg-primary hover:bg-primary-hover text-white font-black px-6 py-3 rounded-xl shadow-md transition disabled:opacity-50">Daftarkan</button>
                        {!adminApiKey && <p className="text-[10px] text-red-500 w-full mt-1">⚠️ Fitur ini butuh 'API Key Web' Firebase (Simpan di Pengaturan Web).</p>}
                    </form>

                    <div className="relative mb-6">
                        <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-sub-theme w-5 h-5" />
                        <input type="text" placeholder="Cari Nama atau Email Member..." value={adminMemberSearch} onChange={(e) => setAdminMemberSearch(e.target.value)} className="w-full input-theme rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-primary font-medium transition shadow-sm" />
                    </div>

                    <div className="flex-1 w-full max-w-full overflow-x-auto custom-scrollbar bg-white dark:bg-black/50 rounded-[2rem] border border-theme shadow-inner render-optimized">
                        <table className="w-full text-left text-sm text-main min-w-[900px]">
                        <thead className="text-[10px] text-sub-theme uppercase tracking-widest bg-gray-100 dark:bg-white/5 sticky top-0 z-10 border-b border-theme shadow-sm">
                            <tr>
                                <th className="px-5 py-4 font-black">Informasi Pengguna</th>
                                <th className="px-5 py-4 font-black">Kontak Akun</th>
                                <th className="px-5 py-4 font-black text-primary">Saldo Cashback</th>
                                <th className="px-5 py-4 font-black">Keamanan & Tipe</th>
                                <th className="px-5 py-4 font-black">Bergabung Pada</th>
                                <th className="px-5 py-4 text-center font-black">Aksi Cepat</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-theme">
                        {(memberList||[]).filter((m:any) => (m?.email||'').toLowerCase().includes((adminMemberSearch||'').toLowerCase()) || (m?.name||'').toLowerCase().includes((adminMemberSearch||'').toLowerCase())).map((m:any) => (
                            <tr key={m.id} className={`transition-colors ${m.isBlocked ? 'opacity-50 bg-red-500/5' : 'hover:bg-gray-50 dark:hover:bg-white/[0.03]'}`}>
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center font-black text-xs text-main overflow-hidden border border-theme shrink-0 shadow-sm">
                                        {m.avatar ? <img src={m.avatar} className="w-full h-full object-cover" alt="" /> : (m.name||'U').charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="font-bold text-main truncate max-w-[150px]">{m.name}</div>
                                        <div className="text-[9px] text-sub-theme font-mono mt-0.5 truncate max-w-[150px]">{m.email}</div>
                                    </div>
                                    </div>
                                </td>
                                <td className="px-5 py-4 font-mono text-sub-theme text-xs bg-gray-100 dark:bg-black/50 px-2 py-1 rounded inline-block mt-3 border border-theme shadow-sm">{m.phone || 'Belum diisi'}</td>
                                <td className="px-5 py-4">
                                    <div className="font-mono text-sm font-black text-emerald-600 dark:text-emerald-400">{formatRupiah(m.saldoCashback || 0)}</div>
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex flex-col gap-1.5 items-start">
                                        {m.isBlocked ? <span className="px-2 py-1 rounded-md text-[8px] font-black bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 uppercase tracking-widest shadow-sm">Diblokir</span> : <span className="px-2 py-1 rounded-md text-[8px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 uppercase tracking-widest shadow-sm">Aktif</span>}
                                        {m.isReseller && <span className="px-2 py-1 rounded-md text-[8px] font-black bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/30 uppercase tracking-widest shadow-sm flex items-center gap-1"><IconTrendingUp className="w-2.5 h-2.5"/> Reseller</span>}
                                        {m.registeredFace && (
                                            <button onClick={() => setAdminViewFaceModal({isOpen:true, imageSrc: m.registeredFace, memberName: m.name})} className="px-2 py-1 rounded-md text-[8px] font-black bg-primary-light text-primary border border-primary/30 uppercase tracking-widest hover:bg-primary hover:text-white transition flex items-center gap-1 shadow-sm"><IconScanFace className="w-3 h-3"/> Lihat Wajah</button>
                                        )}
                                    </div>
                                </td>
                                <td className="px-5 py-4 text-xs font-bold text-sub-theme">{m.createdAt ? new Date(m.createdAt).toLocaleDateString('id-ID') : '-'}</td>
                                <td className="px-5 py-4">
                                    <div className="flex items-center justify-center gap-2">
                                    {m.phone && (
                                        <button onClick={()=>window.open(`https://wa.me/${m.phone.replace(/^0/,'62')}?text=Halo%20${m.name},%20kami%20dari%20Vipercell.%20Kami%20ingin%20menginformasikan%20sesuatu%20tentang%20akun%20Anda.`, '_blank')} className="p-2 bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-500 rounded-xl hover:bg-green-50 hover:text-white transition tooltip shadow-sm hover:scale-105" title="Chat WhatsApp">
                                            <IconWhatsapp className="w-4 h-4"/>
                                        </button>
                                    )}
                                    <button onClick={()=>handleBlockMember(m.id, m.isBlocked)} className={`p-2 rounded-xl transition tooltip shadow-sm border hover:scale-105 ${m.isBlocked ? 'bg-gray-200 dark:bg-white/10 text-main border-theme hover:bg-gray-300 dark:hover:bg-white/20' : 'bg-primary-light text-primary border-primary/30 hover:bg-primary hover:text-white'}`} title={m.isBlocked ? 'Buka Blokir Akun' : 'Blokir Akun'}>
                                        <IconBlock className="w-4 h-4"/>
                                    </button>
                                    <button onClick={()=>handleDeleteMember(m.id)} className="p-2 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition tooltip shadow-sm hover:scale-105" title="Hapus Permanen">
                                        <IconTrash className="w-4 h-4"/>
                                    </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {(!memberList || memberList.length === 0) && (<tr><td colSpan={6} className="text-center py-20 text-sub-theme font-bold border border-dashed border-theme rounded-2xl bg-white/50 dark:bg-white/5">Belum ada member terdaftar.</td></tr>)}
                        </tbody>
                        </table>
                    </div>
                </>
            )}

            {adminMemberTab === 'reseller' && (
                <div className="grid grid-cols-1 gap-6 h-full pb-4 render-optimized overflow-y-auto custom-scrollbar">
                    <div className="bg-orange-50 dark:bg-orange-950/10 p-6 rounded-[2rem] border border-orange-500/30 shadow-inner">
                        <h3 className="text-lg font-black text-orange-600 dark:text-orange-500 mb-2 flex items-center gap-2"><IconTrendingUp className="w-5 h-5"/> Pengajuan Menunggu Persetujuan</h3>
                        <p className="text-xs text-sub-theme mb-4">Validasi toko atau counter yang ingin bergabung menjadi Reseller VIP.</p>
                        
                        <div className="space-y-3">
                            {(memberList||[]).filter((m:any) => m.resellerStatus === 'pending').map((m:any) => (
                                <div key={m.id} className="bg-white dark:bg-card p-4 rounded-2xl border border-theme shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-transform hover:scale-[1.01]">
                                    <div className="flex gap-4 items-center">
                                        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-orange-500 shrink-0"><IconBox className="w-6 h-6"/></div>
                                        <div>
                                            <div className="font-black text-main text-base">{m.resellerStore || 'Nama Toko Tidak Diisi'}</div>
                                            <div className="text-[10px] text-sub-theme font-mono mt-0.5">Pemilik: {m.name} | {m.email}</div>
                                            <div className="text-xs font-bold text-primary mt-1">WA: {m.resellerWa || m.phone || '-'}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 w-full md:w-auto">
                                        <button onClick={() => handleResellerAction(m.id, 'reject')} className="flex-1 md:flex-none px-4 py-2.5 bg-red-500/10 text-red-600 border border-red-500/30 rounded-xl text-[10px] font-black uppercase hover:bg-red-500 hover:text-white transition shadow-sm">Tolak</button>
                                        <button onClick={() => handleResellerAction(m.id, 'approve')} className="flex-1 md:flex-none px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-[10px] font-black uppercase shadow-md transition transform hover:scale-105 flex items-center justify-center gap-1"><IconCheckCircle className="w-3.5 h-3.5"/> Terima Reseller</button>
                                    </div>
                                </div>
                            ))}
                            {(memberList||[]).filter((m:any) => m.resellerStatus === 'pending').length === 0 && (
                                <div className="text-center py-8 text-sub-theme text-sm font-bold border border-dashed border-orange-500/30 rounded-2xl bg-white/50 dark:bg-black/20">Tidak ada pengajuan reseller baru.</div>
                            )}
                        </div>
                    </div>

                    <div className="bg-card p-6 rounded-[2rem] border border-theme shadow-sm">
                        <h3 className="text-lg font-black text-main mb-2 flex items-center gap-2"><IconCheckCircle className="w-5 h-5 text-emerald-500"/> Reseller VIP Aktif</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                            {(memberList||[]).filter((m:any) => m.isReseller === true).map((m:any) => (
                                <div key={m.id} className="p-4 rounded-2xl border border-primary/30 bg-primary-light shadow-sm flex flex-col justify-between">
                                    <div className="mb-3">
                                        <div className="font-black text-primary text-lg mb-1 truncate">{m.resellerStore || 'Toko Reseller'}</div>
                                        <div className="text-xs font-bold text-main">{m.name}</div>
                                        <div className="text-[10px] text-sub-theme font-mono">{m.email}</div>
                                    </div>
                                    <div className="flex justify-between items-end border-t border-primary/20 pt-3">
                                        <span className="text-[9px] font-black uppercase bg-emerald-500 text-white px-2 py-0.5 rounded shadow-sm">Aktif</span>
                                        <button onClick={() => requestConfirm('Cabut status reseller dari pengguna ini? Harga akan kembali normal.', () => handleResellerAction(m.id, 'revoke'), 'Cabut Status')} className="text-[9px] text-red-600 bg-red-500/10 px-2 py-1 rounded font-bold hover:bg-red-500 hover:text-white transition">Berhentikan</button>
                                    </div>
                                </div>
                            ))}
                            {(memberList||[]).filter((m:any) => m.isReseller === true).length === 0 && (
                                <div className="col-span-full text-center py-8 text-sub-theme text-sm font-bold border border-dashed border-theme rounded-2xl bg-gray-50 dark:bg-white/5">Belum ada reseller yang aktif.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
