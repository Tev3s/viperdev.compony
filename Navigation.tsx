import React from 'react';
import { IconZap, IconDownloadCloud, IconSun, IconMoon, IconWallet, IconUser, IconLogOut, IconHome, IconHistory, IconMessageSquare, IconShieldAlert } from '../components/Icons';
import { formatRupiah } from '../lib/utils';

export const Navbar = ({ 
    globalConfig, isDarkMode, setIsDarkMode, isPwaMode, handleInstallPwa,
    currentUserData, authUser, navigateTo, profileDropdownOpen, setProfileDropdownOpen, signOut, auth, setDesktopMenuOpen, desktopMenuOpen, userChat, pendingOrdersCount, openChatsCount, unreadFeedbacksCount, isAdmin, currentView 
}: any) => {

    return (
        <nav className="fixed top-0 left-0 w-full z-40 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10 shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="relative z-50">
                        <button onClick={() => setDesktopMenuOpen(!desktopMenuOpen)} className="p-2 text-main bg-[#050505] rounded-xl border border-white/10 hover:bg-white/5 transition relative">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                            {(userChat?.status === 'Dijawab' || pendingOrdersCount > 0) && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-black animate-pulse"></span>}
                        </button>
                        {desktopMenuOpen && (
                            <div className="fixed top-0 left-0 h-screen w-72 bg-[#080808] shadow-2xl border-r border-white/10 z-50 animate-slide-in-left flex flex-col">
                                <div className="p-5 border-b border-theme flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <IconZap className="w-6 h-6 text-primary"/>
                                        <span className="text-lg font-black tracking-widest text-main flex items-center">
                                            {(globalConfig?.appName || 'VIPERCELL').substring(0, Math.floor((globalConfig?.appName || 'VIPERCELL').length/2))}
                                            <span className="text-primary">{(globalConfig?.appName || 'VIPERCELL').substring(Math.floor((globalConfig?.appName || 'VIPERCELL').length/2))}</span>
                                        </span>
                                    </div>
                                    <button onClick={() => setDesktopMenuOpen(false)} className="p-2 bg-gray-100 dark:bg-white/5 text-sub-theme rounded-lg hover:text-red-500 transition"><IconX className="w-4 h-4"/></button>
                                </div>
                                
                                <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                                    <p className="text-[10px] font-black text-sub-theme uppercase tracking-widest px-4 mb-2">Navigasi Utama</p>
                                    <button onClick={()=>{navigateTo('home'); setDesktopMenuOpen(false);}} className={`w-full text-left px-4 py-3.5 rounded-2xl font-bold flex items-center gap-4 transition-all ${currentView === 'home' ? 'bg-primary-light text-primary border border-primary/20 shadow-sm' : 'text-sub-theme hover:bg-gray-100 dark:hover:bg-white/5'}`}><IconHome className="w-5 h-5"/> Beranda Utama</button>
                                    <button onClick={()=>{navigateTo('history'); setDesktopMenuOpen(false);}} className={`w-full text-left px-4 py-3.5 rounded-2xl font-bold flex items-center gap-4 transition-all ${currentView === 'history' ? 'bg-primary-light text-primary border border-primary/20 shadow-sm' : 'text-sub-theme hover:bg-gray-100 dark:hover:bg-white/5'}`}><IconHistory className="w-5 h-5"/> Riwayat Transaksi</button>
                                    <button onClick={()=>{navigateTo('chat'); setDesktopMenuOpen(false);}} className={`w-full text-left px-4 py-3.5 rounded-2xl font-bold flex items-center gap-4 transition-all relative ${currentView === 'chat' ? 'bg-primary-light text-primary border border-primary/20 shadow-sm' : 'text-sub-theme hover:bg-gray-100 dark:hover:bg-white/5'}`}>
                                        <IconMessageSquare className="w-5 h-5"/> Pusat Bantuan 
                                        {(userChat?.status === 'Dijawab') && <span className="absolute right-4 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
                                    </button>
                                    
                                    {isAdmin && (
                                        <>
                                            <div className="my-6 border-t border-theme"></div>
                                            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest px-4 mb-2 flex items-center gap-1"><IconShieldAlert className="w-3 h-3"/> Zona Administrator</p>
                                            <button onClick={()=>{navigateTo('admin'); setDesktopMenuOpen(false);}} className={`w-full text-left px-4 py-3.5 rounded-2xl font-bold flex items-center justify-between transition-all ${currentView === 'admin' ? 'bg-red-500/10 text-red-600 dark:text-red-500 border border-red-500/20 shadow-sm' : 'text-main hover:bg-red-500/5'}`}>
                                                <div className="flex items-center gap-4"><IconTrendingUp className="w-5 h-5"/> Dashboard Admin</div>
                                                {(pendingOrdersCount+openChatsCount+unreadFeedbacksCount) > 0 && <span className="bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-full shadow-sm">{pendingOrdersCount+openChatsCount+unreadFeedbacksCount}</span>}
                                            </button>
                                        </>
                                    )}
                                </div>
                                
                                <div className="p-5 border-t border-theme bg-gray-50 dark:bg-black/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center font-black text-xs text-main overflow-hidden border border-theme shadow-sm">
                                            {currentUserData?.avatar ? <img src={currentUserData.avatar} className="w-full h-full object-cover"/> : (currentUserData?.name||authUser?.email||'U').charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-black text-main truncate">{currentUserData?.name || (authUser?.email||'').split('@')[0] || 'User'}</p>
                                            <p className="text-[9px] text-sub-theme font-mono truncate">{authUser?.email}</p>
                                        </div>
                                        <button onClick={() => {navigateTo('profile'); setDesktopMenuOpen(false);}} className="p-2 bg-gray-200 dark:bg-white/10 text-main rounded-xl hover:bg-primary hover:text-white transition shadow-sm"><IconSettings className="w-4 h-4"/></button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateTo('home')}>
                        <IconZap className="text-primary w-6 h-6 hidden sm:block" />
                        <span className="text-lg font-black tracking-widest text-main drop-shadow-sm flex items-center">
                            {(globalConfig?.appName || 'VIPERCELL').substring(0, Math.floor((globalConfig?.appName || 'VIPERCELL').length/2))}
                            <span className="text-primary">{(globalConfig?.appName || 'VIPERCELL').substring(Math.floor((globalConfig?.appName || 'VIPERCELL').length/2))}</span>
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3 relative">
                    {!isPwaMode && <button onClick={handleInstallPwa} className="hidden sm:flex items-center gap-2 bg-primary text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md hover:scale-105 transition"><IconDownloadCloud className="w-4 h-4"/> Instal</button>}
                    <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 text-sub-theme bg-gray-100 dark:bg-white/5 rounded-xl border border-theme hidden sm:block">{isDarkMode ? <IconSun className="w-5 h-5"/> : <IconMoon className="w-5 h-5"/>}</button>
                    <div className="text-right mr-2 flex items-center gap-2 bg-primary-light px-3 py-1.5 rounded-xl border border-primary/20 cursor-pointer hover:bg-primary/20 transition" onClick={()=>navigateTo('profile')}>
                        <span className="hidden sm:inline text-[10px] font-black uppercase text-primary">Saldo</span>
                        <IconWallet className="w-4 h-4 text-primary sm:hidden"/>
                        <span className="text-xs font-mono font-bold text-primary">{formatRupiah(currentUserData?.saldoAkun || 0)}</span>
                    </div>
                    <button onClick={() => setProfileDropdownOpen(!profileDropdownOpen)} className="w-10 h-10 rounded-full border-2 border-theme shadow-sm text-main overflow-hidden bg-gray-200 dark:bg-black flex items-center justify-center shrink-0">
                        {currentUserData?.avatar ? ( <img src={currentUserData.avatar} className="w-full h-full object-cover" alt="" /> ) : ( <span className="font-black text-sm text-sub-theme">{(currentUserData?.name || authUser?.email || 'U').charAt(0).toUpperCase()}</span> )}
                    </button>
                    {profileDropdownOpen && (
                        <div className="absolute right-0 top-12 mt-2 w-56 bg-card rounded-2xl shadow-2xl border border-theme overflow-hidden py-2 z-50 animate-slide-down">
                            <div className="px-4 py-3 border-b border-theme mb-2 bg-gray-50 dark:bg-black/50">
                                <p className="text-sm font-black text-main truncate">{currentUserData?.name || (authUser.email||'').split('@')[0] || 'User'}</p>
                                <p className="text-[10px] text-sub-theme font-mono truncate mt-0.5">{authUser.email}</p>
                            </div>
                            {!isPwaMode && <button onClick={() => {handleInstallPwa(); setProfileDropdownOpen(false);}} className="w-full text-left px-4 py-2.5 text-sm font-bold text-primary flex items-center gap-3 sm:hidden border-b border-theme"><IconDownloadCloud className="w-4 h-4"/> Instal Aplikasi PWA</button>}
                            <button onClick={() => {setIsDarkMode(!isDarkMode); setProfileDropdownOpen(false);}} className="w-full text-left px-4 py-2.5 text-sm font-bold text-sub-theme flex items-center gap-3 sm:hidden"><IconSun className="w-4 h-4"/> Mode {isDarkMode ? 'Terang' : 'Gelap'}</button>
                            <button onClick={() => {navigateTo('profile'); setProfileDropdownOpen(false);}} className="w-full text-left px-4 py-2.5 text-sm font-bold text-sub-theme flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/5"><IconUser className="w-4 h-4"/> Profil & Keamanan</button>
                            <button onClick={() => signOut(auth)} className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-500 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/5"><IconLogOut className="w-4 h-4"/> Keluar Sesi</button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export const BottomNav = ({ navigateTo, currentView, userChat, isAdmin, pendingOrdersCount, openChatsCount, unreadFeedbacksCount }: any) => {
    return (
        <div className="md:hidden fixed bottom-0 left-0 w-full z-40 bg-card/90 backdrop-blur-xl border-t border-theme flex justify-around items-center pt-2 px-1 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] pb-safe-bottom">
            <button onClick={()=>navigateTo('home')} className={`flex flex-col items-center p-2 transition-colors ${currentView === 'home' ? 'text-primary' : 'text-sub-theme'}`}><IconHome className="w-5 h-5 mb-1" /><span className="text-[9px] font-black uppercase tracking-wider">Beranda</span></button>
            <button onClick={()=>navigateTo('history')} className={`flex flex-col items-center p-2 transition-colors ${currentView === 'history' ? 'text-primary' : 'text-sub-theme'}`}><IconHistory className="w-5 h-5 mb-1" /><span className="text-[9px] font-black uppercase tracking-wider">Riwayat</span></button>
            <button onClick={()=>navigateTo('chat')} className={`flex flex-col items-center p-2 relative transition-colors ${currentView === 'chat' ? 'text-primary' : 'text-sub-theme'}`}>
                <IconMessageSquare className="w-5 h-5 mb-1" />
                <span className="text-[9px] font-black uppercase tracking-wider">Bantuan</span>
                {(userChat?.status === 'Dijawab') && <span className="absolute top-1 right-2 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border border-card"></span>}
            </button>
            {isAdmin && (
                <button onClick={()=>navigateTo('admin')} className={`flex flex-col items-center p-2 relative transition-colors ${currentView === 'admin' ? 'text-red-500' : 'text-sub-theme'}`}>
                    <IconShieldAlert className="w-5 h-5 mb-1" />
                    <span className="text-[9px] font-black uppercase tracking-wider">Admin</span>
                    {(pendingOrdersCount + openChatsCount + unreadFeedbacksCount) > 0 && <span className="absolute top-1 right-2 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border border-card"></span>}
                </button>
            )}
        </div>
    );
};

const IconX = ({ className: c }: { className?: string }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={c}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
const IconTrendingUp = ({ className: c }: { className?: string }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={c}><polyline points="23 6 13.5 15.5 8 10 1 18" /><polyline points="17 6 23 6 23 12" /></svg>;
const IconSettings = ({ className: c }: { className?: string }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={c}><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06-.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>;
