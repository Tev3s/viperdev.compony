import React from 'react';
import { IconDatabase, IconKey, IconShield, IconEye, IconEyeOff } from '../../components/Icons';

export const AdminDatabase = ({ 
    globalConfig, setGlobalConfig, handleSaveConfig, isSaveConfigLoading, showDigiflazzApi, setShowDigiflazzApi,
    showVipResellerApi, setShowVipResellerApi 
}: any) => {

    return (
        <div className="animate-slide-down flex flex-col h-full w-full max-w-4xl space-y-6">
            <h2 className="text-2xl font-black mb-2 text-main flex items-center gap-2 drop-shadow-sm"><IconDatabase className="w-6 h-6 text-primary"/> Konfigurasi Integrasi</h2>
            <p className="text-xs text-sub-theme font-medium bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 p-3 rounded-xl border border-blue-500/20 shadow-sm">Kredensial API DigiFlazz saat ini dikonfigurasi melalui konfigurasi .env backend (Environmental Variables) demi keamanan.</p>
            
            <form onSubmit={handleSaveConfig} className="space-y-6 bg-card p-6 md:p-8 rounded-[2.5rem] border border-theme shadow-lg">
                <div className="border border-purple-500/30 rounded-2xl p-5 md:p-6 bg-purple-50 dark:bg-purple-900/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-bl-full"></div>
                    <div className="flex items-center gap-3 mb-5 relative z-10 border-b border-purple-500/20 pb-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400"><IconKey className="w-4 h-4"/></div>
                        <h4 className="text-sm font-black text-purple-700 dark:text-purple-400 uppercase tracking-widest">Status Integrasi Server</h4>
                    </div>
                    <div className="text-sm font-medium text-sub-theme relative z-10">
                        <p>API Digiflazz: <span className="font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded">Aktif (Via Backend Secure ENV)</span></p>
                    </div>
                </div>

                <div className="border border-orange-500/30 rounded-2xl p-5 md:p-6 bg-orange-50 dark:bg-orange-900/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-bl-full"></div>
                    <div className="flex items-center gap-3 mb-5 relative z-10 border-b border-orange-500/20 pb-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-600 dark:text-orange-400"><IconKey className="w-4 h-4"/></div>
                        <h4 className="text-sm font-black text-orange-700 dark:text-orange-400 uppercase tracking-widest">VIP Reseller API Setting</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-orange-600/80 dark:text-orange-400">API ID (Sign)</label>
                            <input type="text" value={globalConfig?.vipResellerApiId || ''} onChange={(e)=>setGlobalConfig({...globalConfig, vipResellerApiId: e.target.value})} className="w-full input-theme text-sm p-3.5 rounded-xl border-orange-500/20 shadow-inner font-mono" placeholder="Contoh: 12345" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-orange-600/80 dark:text-orange-400">API Key VIP Reseller</label>
                            <div className="relative">
                                <input type={showVipResellerApi ? 'text' : 'password'} value={globalConfig?.vipResellerApiKey || ''} onChange={(e)=>setGlobalConfig({...globalConfig, vipResellerApiKey: e.target.value})} className="w-full input-theme text-sm p-3.5 pr-10 rounded-xl border-orange-500/20 shadow-inner font-mono text-[10px]" placeholder="xxxxx-xxxxx-xxxxx" />
                                <button type="button" onClick={()=>setShowVipResellerApi(!showVipResellerApi)} className="absolute right-3 top-1/2 -translate-y-1/2 text-sub-theme">{showVipResellerApi ? <IconEyeOff className="w-4 h-4"/> : <IconEye className="w-4 h-4"/>}</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-2">
                    <button type="submit" disabled={isSaveConfigLoading} className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2 hover:scale-[1.02]"><IconShield className="w-4 h-4"/> Simpan Konfigurasi Server Integrasi</button>
                </div>
            </form>
        </div>
    );
};
