import React from 'react';
import { IconMessageSquare, IconX, IconSend } from '../components/Icons';

export const ChatView = ({ 
    handleBack, setHelpTab, helpTab, userChat, chatEndRef, handleSendChatUser, chatInput, setChatInput, loadingChat, handleSendFeedback, feedbackText, setFeedbackText, sysLoading, isDarkMode 
}: any) => {
    return (
        <div className="flex-1 w-full max-w-4xl mx-auto bg-card flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] mt-4 md:mt-8 rounded-[2rem] border border-theme shadow-2xl overflow-hidden relative z-20 animate-slide-down">
            <div className="p-4 md:p-6 border-b border-theme bg-gray-50 dark:bg-black/50 flex items-center justify-between shadow-sm shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white shadow-md">
                        <IconMessageSquare className="w-6 h-6"/>
                    </div>
                    <div>
                        <h2 className="text-lg md:text-xl font-black text-main">Pusat Bantuan</h2>
                        <p className="text-[10px] md:text-xs text-sub-theme font-bold">CS Siap Membantu Anda</p>
                    </div>
                </div>
                <button onClick={handleBack} className="p-2 md:p-3 bg-gray-200 dark:bg-white/10 text-main rounded-xl hover:bg-gray-300 dark:hover:bg-white/20 transition"><IconX className="w-5 h-5"/></button>
            </div>
            
            <div className="flex border-b border-theme bg-card shrink-0">
                <button onClick={() => setHelpTab('chat')} className={`flex-1 py-3 text-xs font-black uppercase tracking-widest transition-colors ${helpTab === 'chat' ? 'border-b-2 border-primary text-primary bg-primary-light' : 'text-sub-theme hover:bg-gray-50 dark:hover:bg-white/5'}`}>Live Chat</button>
                <button onClick={() => setHelpTab('faq')} className={`flex-1 py-3 text-xs font-black uppercase tracking-widest transition-colors ${helpTab === 'faq' ? 'border-b-2 border-primary text-primary bg-primary-light' : 'text-sub-theme hover:bg-gray-50 dark:hover:bg-white/5'}`}>Kirim Saran</button>
            </div>

            {helpTab === 'chat' && (
                <>
                    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar bg-gray-50/50 dark:bg-[#0a0a0a]/50 render-optimized relative">
                        {(!userChat?.messages || userChat.messages.length === 0) && (
                            <div className="flex flex-col items-center justify-center h-full text-center opacity-70">
                                <IconMessageSquare className="w-12 h-12 text-sub-theme mb-3"/>
                                <p className="text-sm font-bold text-main">Belum ada obrolan.</p>
                                <p className="text-xs text-sub-theme">Kirim pesan pertama Anda di bawah.</p>
                            </div>
                        )}
                        {(userChat?.messages || []).map((m:any, i:number) => (
                            <div key={i} className={`flex w-full ${m.sender === 'user' ? 'justify-end' : 'justify-start'} animate-slide-down`}>
                                <div className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'} max-w-[85%] md:max-w-[75%]`}>
                                    <div className="px-4 py-2.5 text-sm shadow-md font-medium leading-relaxed" 
                                         style={{
                                             backgroundColor: m.sender === 'user' ? 'var(--chat-user)' : 'var(--chat-admin)',
                                             color: m.sender === 'user' ? (isDarkMode ? '#ffffff' : '#111827') : 'var(--chat-text)',
                                             borderRadius: m.sender === 'user' ? '1.5rem 1.5rem 0 1.5rem' : '1.5rem 1.5rem 1.5rem 0'
                                         }}>
                                        {m.text}
                                        <div className="text-[9px] font-bold mt-1.5 text-right opacity-60">
                                            {m.time ? new Date(m.time).toLocaleTimeString('id-ID', {hour: '2-digit', minute: '2-digit'}) : ''}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef} className="h-2" />
                    </div>
                    <div className="p-3 md:p-4 bg-card border-t border-theme shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
                        {userChat?.status === 'Selesai' && (
                            <div className="text-center text-[10px] font-bold text-emerald-500 bg-emerald-500/10 py-2 rounded-xl mb-3 border border-emerald-500/20 shadow-sm">Sesi bantuan ini telah ditutup oleh Admin. Pesan baru akan membuka tiket baru.</div>
                        )}
                        <form onSubmit={handleSendChatUser} className="flex gap-2">
                            <input type="text" required value={chatInput} onChange={(e) => setChatInput(e.target.value)} disabled={loadingChat} placeholder="Ketik pesan Anda di sini..." className="flex-1 input-theme rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-primary shadow-inner transition disabled:opacity-50" />
                            <button type="submit" disabled={loadingChat || !chatInput.trim()} className="bg-primary hover:bg-primary-hover text-white px-5 rounded-xl font-black shadow-lg disabled:opacity-50 transition transform hover:scale-105 active:scale-95"><IconSend className="w-5 h-5"/></button>
                        </form>
                    </div>
                </>
            )}

            {helpTab === 'faq' && (
                <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar bg-gray-50/50 dark:bg-[#0a0a0a]/50">
                    <div className="bg-card p-6 rounded-2xl border border-theme shadow-sm">
                        <h3 className="font-black text-main mb-2">Punya Saran atau Masukan?</h3>
                        <p className="text-xs text-sub-theme mb-6">Bantu kami meningkatkan layanan Vipercell. Kirimkan ide, kritik, atau laporan bug di sini.</p>
                        <form onSubmit={handleSendFeedback}>
                            <textarea required value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} placeholder="Tulis masukan Anda..." className="w-full h-32 input-theme rounded-xl p-4 text-sm resize-none focus:border-primary shadow-inner mb-4"></textarea>
                            <button type="submit" disabled={!feedbackText.trim() || sysLoading.active} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-md transition disabled:opacity-50">Kirim Masukan</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
