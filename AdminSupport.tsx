import React from 'react';
import { IconMessageSquare, IconCheckCircle, IconTrash, IconSend } from '../../components/Icons';

export const AdminSupport = ({ 
    activeSupportTab, setActiveSupportTab, allChats, allFeedbacks,
    selectedChatId, handleSelectChat, chatAdminInput, setChatAdminInput,
    handleAdminSendChat, chatEndRef, handleCloseChat, handleDeleteChat,
    handleDeleteFeedback
}: any) => {

    return (
        <div className="animate-slide-down flex flex-col h-[calc(100vh-250px)] w-full">
            <h2 className="text-2xl font-black mb-4 text-main px-2 shrink-0 flex items-center gap-2 drop-shadow-sm"><IconMessageSquare className="w-6 h-6 text-primary"/> Pusat Bantuan (CS)</h2>
            <div className="flex px-2 mb-4 shrink-0">
                <div className="flex bg-card border border-theme p-1 rounded-xl shadow-sm">
                   <button onClick={() => setActiveSupportTab('chat')} className={`px-5 py-2.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 ${activeSupportTab === 'chat' ? 'bg-primary text-white shadow-md' : 'text-sub-theme hover:bg-gray-100 dark:hover:bg-white/5'}`}>
                      Live Chat
                      {(allChats||[]).filter((c:any)=>c.status==='Buka'&&c.hasUnread).length > 0 && <span className="bg-red-500 text-white w-4 h-4 flex items-center justify-center rounded-full text-[8px] animate-pulse">{(allChats||[]).filter((c:any)=>c.status==='Buka'&&c.hasUnread).length}</span>}
                   </button>
                   <button onClick={() => setActiveSupportTab('feedback')} className={`px-5 py-2.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 ${activeSupportTab === 'feedback' ? 'bg-emerald-600 text-white shadow-md' : 'text-sub-theme hover:bg-gray-100 dark:hover:bg-white/5'}`}>
                      Masukan & Bug
                      {(allFeedbacks||[]).filter((f:any)=>f.status==='Unread').length > 0 && <span className="bg-red-500 text-white w-4 h-4 flex items-center justify-center rounded-full text-[8px] animate-pulse">{(allFeedbacks||[]).filter((f:any)=>f.status==='Unread').length}</span>}
                   </button>
                </div>
            </div>

            {activeSupportTab === 'chat' ? (
                <div className="flex flex-col md:flex-row flex-1 bg-card rounded-[2.5rem] border border-theme overflow-hidden shadow-2xl relative min-h-0">
                   <div className="w-full md:w-1/3 border-r border-theme flex flex-col shrink-0 h-[30vh] md:h-full">
                      <div className="p-4 border-b border-theme bg-gray-50 dark:bg-black/50 shrink-0 shadow-sm"><h3 className="font-black text-sm text-main uppercase tracking-widest pl-1">Daftar Tiket Aktif</h3></div>
                      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 render-optimized">
                         {(allChats||[]).filter((c:any)=>c.status==='Buka').map((chat:any) => (
                             <div key={chat.id} onClick={() => handleSelectChat(chat.id)} className={`p-4 border-b border-theme/50 last:border-b-0 cursor-pointer transition-colors rounded-xl mb-1 ${selectedChatId === chat.id ? 'bg-primary-light border-primary' : 'hover:bg-gray-100 dark:hover:bg-white/5'}`}>
                                <div className="flex justify-between items-start mb-2">
                                   <div className="font-bold text-sm text-main truncate pr-2">{(chat.userEmail || '').split('@')[0]}</div>
                                   {chat.hasUnread && <span className="w-2.5 h-2.5 bg-red-500 rounded-full shrink-0 shadow-sm animate-pulse flex"></span>}
                                </div>
                                <div className="text-[10px] text-sub-theme truncate">
                                   {chat.messages && chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].text : 'Belum ada pesan'}
                                </div>
                                <div className="text-[8px] mt-2 opacity-50 font-mono text-right">{new Date(chat.updatedAt).toLocaleTimeString('id-ID')}</div>
                             </div>
                         ))}
                         {(allChats||[]).filter((c:any)=>c.status==='Buka').length === 0 && <div className="text-center p-8 text-xs text-sub-theme font-bold">Tidak ada tiket chat yang terbuka.</div>}
                         
                         {/* CHAT SELESAI */}
                         <div className="mt-4"><h4 className="text-[10px] font-black uppercase text-sub-theme px-3 mb-2">Tiket Selesai</h4></div>
                         {(allChats||[]).filter((c:any)=>c.status==='Selesai').map((chat:any) => (
                             <div key={chat.id} onClick={() => handleSelectChat(chat.id)} className={`p-3 border-b border-theme/50 opacity-60 last:border-b-0 cursor-pointer transition-colors rounded-xl mb-1 ${selectedChatId === chat.id ? 'bg-gray-200 dark:bg-white/10' : 'hover:bg-gray-100 dark:hover:bg-white/5'}`}>
                                <div className="font-bold text-xs text-main truncate">{(chat.userEmail || '').split('@')[0]}</div>
                             </div>
                         ))}
                      </div>
                   </div>
                   
                   <div className="flex-1 flex flex-col h-[60vh] md:h-full relative bg-gray-50/50 dark:bg-black/20">
                      {selectedChatId ? (
                         <>
                         <div className="p-4 border-b border-theme bg-white dark:bg-black/40 flex justify-between items-center shadow-sm shrink-0">
                            <div>
                               <h3 className="font-black text-sm text-main uppercase tracking-widest pl-1">ID Tiket: <span className="text-primary font-mono lowercase">{selectedChatId.substring(0,8)}</span></h3>
                               {allChats.find((c:any) => c.id === selectedChatId)?.status === 'Selesai' && <span className="text-[9px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded font-black border border-emerald-500/20 ml-1">Selesai</span>}
                            </div>
                            <div className="flex gap-2">
                               {allChats.find((c:any) => c.id === selectedChatId)?.status === 'Buka' && (
                                   <button onClick={() => handleCloseChat(selectedChatId)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase shadow-sm transition flex items-center gap-1"><IconCheckCircle className="w-3 h-3"/> Tutup Tiket</button>
                               )}
                               <button onClick={() => handleDeleteChat(selectedChatId)} className="bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white px-3 py-1.5 border border-red-500/30 rounded-lg text-[9px] font-black uppercase shadow-sm transition flex items-center gap-1"><IconTrash className="w-3 h-3"/> Hapus</button>
                            </div>
                         </div>
                         <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar relative z-10 render-optimized">
                            {(allChats.find((c:any) => c.id === selectedChatId)?.messages || []).map((m:any, i:number) => (
                               <div key={i} className={`flex w-full ${m.sender === 'admin' ? 'justify-end' : 'justify-start'} animate-slide-down`}>
                                   <div className={`flex flex-col ${m.sender === 'admin' ? 'items-end' : 'items-start'} max-w-[80%]`}>
                                       <span className="text-[9px] font-bold text-sub-theme mb-1 ml-2">{m.sender === 'admin' ? 'Anda (Admin)' : 'Pelanggan'}</span>
                                       <div className="px-4 py-2.5 text-sm shadow-md font-medium" 
                                            style={{
                                                backgroundColor: m.sender === 'admin' ? 'var(--chat-user)' : 'var(--chat-admin)',
                                                color: m.sender === 'admin' ? '#ffffff' : 'var(--chat-text)',
                                                borderRadius: m.sender === 'admin' ? '1.5rem 1.5rem 0 1.5rem' : '1.5rem 1.5rem 1.5rem 0'
                                            }}>
                                            {m.text}
                                            <div className="text-[9px] mt-1.5 text-right opacity-60">
                                               {m.time ? new Date(m.time).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}) : ''}
                                            </div>
                                       </div>
                                   </div>
                               </div>
                            ))}
                            <div ref={chatEndRef} />
                         </div>
                         <div className="p-4 bg-white dark:bg-black/60 border-t border-theme shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
                            <form onSubmit={handleAdminSendChat} className="flex gap-2">
                               <input type="text" required value={chatAdminInput} onChange={(e) => setChatAdminInput(e.target.value)} disabled={allChats.find((c:any) => c.id === selectedChatId)?.status === 'Selesai'} placeholder={allChats.find((c:any) => c.id === selectedChatId)?.status === 'Selesai' ? 'Tiket sudah ditutup' : 'Balas pesan pelanggan...'} className="flex-1 input-theme rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition shadow-inner disabled:opacity-50" />
                               <button type="submit" disabled={!chatAdminInput.trim() || allChats.find((c:any) => c.id === selectedChatId)?.status === 'Selesai'} className="bg-primary hover:bg-primary-hover text-white px-5 rounded-xl transition shadow-md disabled:opacity-50 transform hover:scale-105 active:scale-95"><IconSend className="w-5 h-5"/></button>
                            </form>
                         </div>
                         </>
                      ) : (
                         <div className="flex-1 flex flex-col items-center justify-center text-sub-theme opacity-50 p-6">
                            <IconMessageSquare className="w-16 h-16 mb-4"/>
                            <p className="text-sm font-bold">Pilih obrolan dari daftar untuk mulai membalas.</p>
                         </div>
                      )}
                   </div>
                </div>
            ) : (
                <div className="flex-1 bg-card rounded-[2.5rem] border border-theme shadow-2xl overflow-y-auto p-4 md:p-6 custom-scrollbar render-optimized">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {allFeedbacks.map((fb:any) => (
                         <div key={fb.id} className={`p-5 rounded-2xl border transition-all ${fb.status === 'Unread' ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-500/30 shadow-md scale-[1.01]' : 'bg-gray-50 dark:bg-white/5 border-theme shadow-sm'}`}>
                            <div className="flex justify-between items-start mb-3">
                               <div>
                                  <div className="text-sm font-black text-main">{fb.userEmail || 'Anonim'}</div>
                                  <div className="text-[9px] text-sub-theme font-mono">{new Date(fb.createdAt).toLocaleDateString('id-ID')} {new Date(fb.createdAt).toLocaleTimeString('id-ID')}</div>
                               </div>
                               {fb.status === 'Unread' ? (
                                   <span className="bg-emerald-500 text-white px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest shadow-sm animate-pulse-fast">Baru</span>
                               ) : (
                                   <span className="bg-gray-200 dark:bg-white/10 text-sub-theme px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border border-theme">Dibaca</span>
                               )}
                            </div>
                            <div className="text-xs text-sub-theme leading-relaxed bg-white dark:bg-black/20 p-3 rounded-xl border border-theme shadow-inner font-medium mb-3">{fb.text}</div>
                            <div className="flex justify-end border-t border-theme pt-3">
                                <button onClick={() => handleDeleteFeedback(fb.id)} className="text-[10px] uppercase font-black tracking-widest text-red-600 dark:text-red-500 hover:text-red-700 hover:underline flex items-center gap-1"><IconTrash className="w-3 h-3"/> Hapus</button>
                            </div>
                         </div>
                      ))}
                      {(allFeedbacks||[]).length === 0 && <div className="col-span-full text-center py-12 text-sm text-sub-theme font-bold border border-dashed border-theme rounded-3xl bg-gray-50 dark:bg-black/20">Belum ada saran atau laporan bug yang masuk.</div>}
                   </div>
                </div>
            )}
        </div>
    );
};
