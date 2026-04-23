import React from 'react';
import { IconShieldAlert, IconTrendingUp, IconCreditCard, IconList, IconGamepad, IconPercent, IconFileText, IconUsers, IconMessageSquare, IconDatabase, IconSettings } from '../../components/Icons';

export const AdminSidebar = ({ activeAdminTab, setActiveAdminTab, pendingOrdersCount, memberList, openChatsCount, unreadFeedbacksCount }: any) => {
    return (
        <div className="w-full lg:w-72 clean-card p-5 shadow-2xl flex flex-col shrink-0 lg:sticky lg:top-24 lg:h-[calc(100vh-140px)] z-30">
             <div className="flex items-center gap-3 mb-8 px-2 pt-2">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shrink-0 shadow-lg"><IconShieldAlert className="w-6 h-6 text-white" /></div>
                <div className="min-w-0">
                   <h1 className="text-lg font-black text-main truncate drop-shadow-sm">Admin Panel</h1>
                   <span className="text-[8px] bg-gray-200 dark:bg-white/10 text-sub-theme px-2 py-0.5 rounded uppercase font-bold mt-1 inline-block border border-theme shadow-inner">System v16.5 Enterprise</span>
                </div>
             </div>

             <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto pb-4 lg:pb-0 custom-scrollbar flex-1">
                {[ 
                    { id: 'dashboard', label: 'Statistik Sistem', icon: IconTrendingUp }, 
                    { id: 'finance', label: 'Manajemen Keuangan', icon: IconCreditCard }, 
                    { id: 'orders', label: 'Daftar Pesanan', icon: IconList, notif: pendingOrdersCount }, 
                    { id: 'katalog', label: 'Katalog & Harga', icon: IconGamepad }, 
                    { id: 'promo', label: 'Pusat Promosi', icon: IconPercent }, 
                    { id: 'blog', label: 'Kelola Berita', icon: IconFileText }, 
                    { id: 'members', label: 'Data Member & Reseller', icon: IconUsers, notif: (memberList||[]).filter((m:any)=>m.resellerStatus==='pending').length }, 
                    { id: 'support', label: 'Pusat Bantuan', icon: IconMessageSquare, notif: openChatsCount + unreadFeedbacksCount }, 
                    { id: 'database', label: 'Integrasi API KEY', icon: IconDatabase }, 
                    { id: 'settings', label: 'Pengaturan Web', icon: IconSettings } 
                ].map(tab => {
                   const TabIcon = tab.icon;
                   return (
                   <button key={tab.id} onClick={() => setActiveAdminTab(tab.id)} className={`w-auto lg:w-full flex items-center gap-3 px-4 py-4 rounded-2xl font-bold transition-all whitespace-nowrap shrink-0 border ${activeAdminTab === tab.id ? 'bg-primary text-white border-primary shadow-lg' : 'bg-transparent text-sub-theme border-transparent hover:bg-gray-100 dark:hover:bg-white/5 hover:border-theme'}`}>
                      <TabIcon className={`w-5 h-5 ${activeAdminTab === tab.id ? 'text-white' : ''}`} />
                      <span className="text-sm tracking-wide">{tab.label}</span>
                      {(tab.notif || 0) > 0 && <span className="ml-2 lg:ml-auto bg-red-500 text-white px-2 py-0.5 rounded-full text-[10px] font-black shadow-sm">{tab.notif}</span>}
                   </button>
                )})}
             </div>
          </div>
    );
};
