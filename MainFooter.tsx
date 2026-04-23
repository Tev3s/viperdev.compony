import React from 'react';
import { IconZap, IconInstagram, IconWhatsapp, IconTiktok, IconFacebook, IconTelegram, IconYoutube } from './Icons';

export const MainFooter = ({ socialLinks, appName }: { socialLinks: any, appName: string }) => {
  return (
    <footer className="mt-auto border-t border-theme bg-[#0a0a0a] pt-12 pb-8 px-6 text-center z-10 relative">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-4">
          <IconZap className="w-6 h-6 text-primary" />
          <span className="text-xl font-black tracking-wider text-main uppercase">
            {(appName || 'VIPERCELL').substring(0, Math.floor((appName || 'VIPERCELL').length / 2))}
            <span className="text-primary">{(appName || 'VIPERCELL').substring(Math.floor((appName || 'VIPERCELL').length / 2))}</span>
          </span>
        </div>
        <p className="text-sub-theme text-sm mb-6 max-w-2xl mx-auto font-medium">Platform penyedia layanan top up game tercepat, termurah, dan terpercaya.</p>
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          {socialLinks?.ig && <a href={socialLinks.ig} target="_blank" rel="noreferrer" className="p-3 bg-gray-100 dark:bg-white/5 border border-theme rounded-2xl hover:bg-pink-600 hover:text-white transition shadow-sm hover:scale-110"><IconInstagram className="w-5 h-5 text-sub-theme group-hover:text-white" /></a>}
          {socialLinks?.wa && <a href={socialLinks.wa} target="_blank" rel="noreferrer" className="p-3 bg-gray-100 dark:bg-white/5 border border-theme rounded-2xl hover:bg-green-500 hover:text-white transition shadow-sm hover:scale-110"><IconWhatsapp className="w-5 h-5 text-sub-theme group-hover:text-white" /></a>}
          {socialLinks?.tt && <a href={socialLinks.tt} target="_blank" rel="noreferrer" className="p-3 bg-gray-100 dark:bg-white/5 border border-theme rounded-2xl hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition shadow-sm hover:scale-110"><IconTiktok className="w-5 h-5 text-sub-theme group-hover:text-white dark:group-hover:text-black" /></a>}
          {socialLinks?.fb && <a href={socialLinks.fb} target="_blank" rel="noreferrer" className="p-3 bg-gray-100 dark:bg-white/5 border border-theme rounded-2xl hover:bg-blue-600 hover:text-white transition shadow-sm hover:scale-110"><IconFacebook className="w-5 h-5 text-sub-theme group-hover:text-white" /></a>}
          {socialLinks?.tg && <a href={socialLinks.tg} target="_blank" rel="noreferrer" className="p-3 bg-gray-100 dark:bg-white/5 border border-theme rounded-2xl hover:bg-blue-400 hover:text-white transition shadow-sm hover:scale-110"><IconTelegram className="w-5 h-5 text-sub-theme group-hover:text-white" /></a>}
          {socialLinks?.yt && <a href={socialLinks.yt} target="_blank" rel="noreferrer" className="p-3 bg-gray-100 dark:bg-white/5 border border-theme rounded-2xl hover:bg-red-600 hover:text-white transition shadow-sm hover:scale-110"><IconYoutube className="w-5 h-5 text-sub-theme group-hover:text-white" /></a>}
        </div>
        <div className="text-xs text-sub-theme font-bold uppercase tracking-widest">
          &copy; {new Date().getFullYear()} {appName || 'Vipercell'}. <span className="px-2 py-0.5 bg-gray-200 dark:bg-white/10 rounded-md font-mono text-[9px] text-main border border-theme ml-2 shadow-inner">v16.5 Enterprise</span>
        </div>
      </div>
    </footer>
  );
};
