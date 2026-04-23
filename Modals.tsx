import React, { useState, useEffect, useCallback } from 'react';
import { IconTrash, IconEye, IconEyeOff, IconLock, IconLoader, IconShieldAlert, IconPhone, IconChevronLeft, IconX, IconCheckCircle, IconSearch, IconQrcode, IconScanFace } from '../components/Icons';
import { auth } from '../lib/firebase';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { useToast } from '../context/ToastContext';
import { formatRupiah, calculateVIPLevel } from '../lib/utils';

export const GlobalLoadingOverlay = ({ active, message }: { active: boolean, message?: string }) => { 
  if (!active) return null; 
  return ( 
    <div className="fixed inset-0 z-[12000] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-200"> 
       <div className="cyber-loader mb-6 transform scale-75"><div></div><div></div><div></div></div> 
       <h3 className="text-white font-black tracking-widest uppercase text-sm mb-1 flex items-center gap-2">MOHON TUNGGU</h3> 
       <p className="text-gray-400 text-xs font-medium animate-pulse">{message || 'Sistem memproses...'}</p> 
    </div> 
  ); 
};

export const ConfirmDialog = ({ isOpen, message, onConfirm, onCancel, confirmText = "Ya, Lanjutkan" }: any) => { 
  if (!isOpen) return null; 
  return ( 
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"> 
      <div className="clean-card p-6 md:p-8 max-w-sm w-full text-center relative overflow-hidden shadow-2xl"> 
        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20"><IconTrash className="w-8 h-8" /></div> 
        <h3 className="text-xl font-black mb-2 text-main">Konfirmasi Aksi</h3> 
        <p className="text-sm text-sub-theme mb-8 font-medium">{message}</p> 
        <div className="flex gap-3"> 
          <button onClick={onCancel} className="flex-1 py-3.5 rounded-xl font-bold bg-gray-200 dark:bg-white/5 hover:bg-gray-300 dark:hover:bg-white/10 transition text-main text-sm border border-theme">Batal</button> 
          <button onClick={onConfirm} className="flex-1 py-3.5 rounded-xl font-bold bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/30 transition text-sm">{confirmText}</button> 
        </div> 
      </div> 
    </div> 
  ) 
}

export const DangerDialog = ({ isOpen, message, onConfirm, onCancel, authEmail }: any) => { 
  const [pass, setPass] = useState(''); const [err, setErr] = useState(''); const [loading, setLoading] = useState(false); const [showPass, setShowPass] = useState(false); 
  if (!isOpen) return null; 
  const handleSubmit = async (e: any) => { 
    e.preventDefault(); setLoading(true); setErr(''); 
    try { 
      const credential = EmailAuthProvider.credential(authEmail, pass); 
      await reauthenticateWithCredential(auth.currentUser!, credential); 
      onConfirm(); setPass(''); 
    } catch(error) { 
      setErr('Kata Sandi Admin salah!'); 
    } finally { 
      setLoading(false); 
    } 
  }; 
  return ( 
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"> 
      <div className="bg-gradient-to-br from-primary to-navy-900 p-6 md:p-8 max-w-sm w-full rounded-[2rem] text-center shadow-2xl relative overflow-hidden border border-primary/30"> 
        <div className="w-16 h-16 bg-white/10 text-white rounded-full flex items-center justify-center mx-auto mb-4 relative z-10"><IconShieldAlert className="w-8 h-8" /></div> 
        <h3 className="text-xl font-black mb-2 text-white relative z-10 uppercase tracking-widest">Zona Berbahaya</h3> 
        <p className="text-xs text-white/90 mb-6 relative z-10 bg-black/20 p-3 rounded-xl border border-white/10">{message}</p> 
        <form onSubmit={handleSubmit} className="relative z-10"> 
          <div className="relative mb-4"> 
            <IconLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" /> 
            <input type={showPass?"text":"password"} required value={pass} onChange={(e)=>setPass(e.target.value)} placeholder="Sandi Admin" className="w-full bg-black/30 rounded-xl py-3.5 pl-11 pr-12 text-sm text-white placeholder-white/60 focus:outline-none focus:border-white/50 border border-transparent" /> 
            <button type="button" onClick={()=>setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white">{showPass ? <IconEyeOff className="w-4 h-4"/>:<IconEye className="w-4 h-4"/>}</button> 
          </div> 
          {err && <div className="text-xs font-bold text-red-200 mb-4 animate-pulse">{err}</div>} 
          <div className="flex gap-3"> 
            <button type="button" onClick={()=>{setPass(''); setErr(''); setShowPass(false); onCancel();}} className="flex-1 py-3.5 rounded-xl font-bold bg-black/20 text-white text-sm hover:bg-black/30 transition">Batal</button> 
            <button type="submit" disabled={!pass || loading} className="flex-[1.5] py-3.5 rounded-xl font-black bg-primary hover:bg-primary-hover text-white text-sm shadow-md transition disabled:opacity-50">{loading ? <IconLoader className="w-4 h-4 mx-auto"/> : 'Otorisasi'}</button> 
          </div> 
        </form> 
      </div> 
    </div> 
  ) 
}

export const GoogleSetupModal = ({ isOpen, isNew, existingData, onSubmit, onCancel, loading }: any) => { 
  const [phone, setPhone] = useState(''); const [password, setPassword] = useState(''); const [showPass, setShowPass] = useState(false); 
  if(!isOpen) return null; 
  return ( 
    <div className="fixed inset-0 z-[12000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"> 
      <div className="clean-card p-6 md:p-8 max-w-sm w-full relative shadow-2xl border-primary/50"> 
        <div className="w-16 h-16 bg-primary-light text-primary rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20"> 
          <IconShieldAlert className="w-8 h-8" /> 
        </div> 
        <h3 className="text-xl font-black text-center mb-2 text-main">Pengamanan Akun</h3> 
        <p className="text-xs text-sub-theme text-center mb-6">Demi keamanan dan kelengkapan data, pengguna Google {isNew ? 'baru' : 'lama'} wajib memiliki Nomor HP unik dan Kata Sandi cadangan.</p> 
        <form onSubmit={(e) => onSubmit(e, phone, password)} className="space-y-4"> 
          <div className="relative group"> 
            <IconPhone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sub-theme" /> 
            <input type="tel" required value={phone} onChange={(e)=>{ const val = e.target.value; if(val && !/^\d*$/.test(val)) return; setPhone(val); }} className="w-full input-theme rounded-2xl py-4 pl-12 pr-4 text-sm" placeholder="No HP/WA (10-13 Angka)" /> 
          </div> 
          <div className="relative group"> 
            <IconLock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sub-theme" /> 
            <input type={showPass?"text":"password"} required minLength={6} value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full input-theme rounded-2xl py-4 pl-12 pr-12 text-sm" placeholder="Sandi Cadangan (Min. 6)" /> 
            <button type="button" onClick={()=>setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-sub-theme hover:text-main">{showPass ? <IconEyeOff className="w-5 h-5"/>:<IconEye className="w-5 h-5"/>}</button> 
          </div> 
          <div className="flex gap-3 mt-6"> 
            <button type="button" onClick={onCancel} disabled={loading} className="flex-1 py-4 rounded-2xl font-bold bg-gray-200 dark:bg-white/5 text-main text-xs uppercase border border-theme hover:bg-gray-300 dark:hover:bg-white/10 transition">Batal</button> 
            <button type="submit" disabled={loading || phone.length < 10 || password.length < 6} className="flex-[1.5] py-4 rounded-2xl font-black bg-primary hover:bg-primary-hover text-white shadow-lg text-xs uppercase disabled:opacity-50 transition">{loading ? <IconLoader className="w-5 h-5 mx-auto animate-spin"/> : 'Simpan Data'}</button> 
          </div> 
        </form> 
      </div> 
    </div> 
  ) 
}

export const PinModal = ({ isOpen, mode, expectedPin, onSuccess, onCancel }: any) => { 
  const [pin, setPin] = useState(''); const [error, setError] = useState(''); 
  useEffect(() => { setPin(''); setError(''); }, [isOpen]); 
  if(!isOpen) return null; 
  const handleKey = (num: string) => { 
    const newPin = pin + num; 
    if(newPin.length <= 6) setPin(newPin); 
    if(newPin.length === 6) { 
      if(mode === 'verify') { 
        if(window.btoa(newPin) === expectedPin) onSuccess(); 
        else { setError('PIN Salah!'); setTimeout(()=>setPin(''), 1000); } 
      } else { onSuccess(newPin); } 
    } 
  }; 
  const handleDelete = () => setPin(p => p.slice(0, -1)); 
  return ( 
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"> 
      <div className="clean-card w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl relative border border-theme"> 
        <button onClick={onCancel} className="absolute top-6 right-6 text-sub-theme hover:text-main z-20"><IconX className="w-5 h-5"/></button> 
        <div className="text-center mb-6"> 
          <div className="w-14 h-14 bg-primary-light text-primary rounded-full flex items-center justify-center mx-auto mb-4"><IconLock className="w-7 h-7"/></div> 
          <h3 className="text-xl font-black text-main">{mode === 'verify' ? 'Masukkan PIN' : 'Buat PIN Baru'}</h3> 
        </div> 
        <div className="flex justify-center gap-3 mb-6"> 
          {[0,1,2,3,4,5].map(i => (<div key={i} className={`w-4 h-4 rounded-full border-2 transition-colors ${i < pin.length ? 'bg-primary border-primary' : 'border-gray-300 dark:border-gray-600'}`}></div>))} 
        </div> 
        {error && <p className="text-red-500 text-xs font-black text-center mb-4 animate-pulse">{error}</p>} 
        <div className="grid grid-cols-3 gap-3"> 
          {[1,2,3,4,5,6,7,8,9].map(num => (<button key={num} onClick={()=>handleKey(num.toString())} className="bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-2xl py-4 text-2xl font-black text-main border border-theme transition shadow-sm">{num}</button>))} 
          <div></div> 
          <button onClick={()=>handleKey('0')} className="bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-2xl py-4 text-2xl font-black text-main border border-theme transition shadow-sm">0</button> 
          <button onClick={handleDelete} className="bg-red-500/10 hover:bg-red-50 hover:text-white text-red-500 rounded-2xl py-4 flex items-center justify-center border border-red-500/20 transition shadow-sm"><IconChevronLeft className="w-8 h-8"/></button> 
        </div> 
      </div> 
    </div> 
  ); 
};

export const ChangePinModal = ({ isOpen, authEmail, oldPinHash, onSuccess, onCancel }: any) => { 
  const [step, setStep] = useState(oldPinHash ? 1 : 2); const [pinInput, setPinInput] = useState(''); const [newPinCache, setNewPinCache] = useState(''); const [passInput, setPassInput] = useState(''); const [error, setError] = useState(''); const { addToast } = useToast(); const [showPass, setShowPass] = useState(false); 
  useEffect(() => { setPinInput(''); setPassInput(''); setStep(oldPinHash ? 1 : 2); setError(''); setShowPass(false); }, [isOpen, oldPinHash]); 
  const handleKey = useCallback((num: string) => setPinInput(p => p.length >= 6 ? p : p + num), []); 
  const handleDelete = useCallback(() => setPinInput(p => p.slice(0, -1)), []); 
  useEffect(() => { const h = (e: any) => { if (!isOpen || step === 4) return; if (/^[0-9]$/.test(e.key)) handleKey(e.key); else if (e.key === 'Backspace') handleDelete(); }; window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h); }, [isOpen, step, handleKey, handleDelete]); 
  useEffect(() => { if (pinInput.length === 6) { if (step === 1) { if (window.btoa(pinInput) === oldPinHash) { setStep(2); setPinInput(''); } else { setError('PIN Salah!'); addToast('PIN salah', 'error'); setTimeout(() => { setPinInput(''); setError(''); }, 1000); } } else if (step === 2) { setNewPinCache(pinInput); setStep(3); setPinInput(''); } else if (step === 3) { if (pinInput === newPinCache) onSuccess(pinInput); else { setError('Konfirmasi Gagal!'); addToast('Konfirmasi PIN beda', 'error'); setStep(2); setTimeout(() => { setPinInput(''); setError(''); }, 1000); } } } }, [pinInput, step, oldPinHash, newPinCache, onSuccess, addToast]); 
  if (!isOpen) return null; 
  const handleForgotSubmit = async (e: any) => { e.preventDefault(); setError(''); try { const credential = EmailAuthProvider.credential(authEmail, passInput); await reauthenticateWithCredential(auth.currentUser!, credential); setStep(2); setPinInput(''); setPassInput(''); addToast('Berhasil. Buat PIN baru.', 'success'); } catch(err) { setError('Sandi Salah!'); } }; 
  const titles: Record<number, string> = { 1: 'Masukkan PIN Lama', 2: 'Buat PIN Baru', 3: 'Konfirmasi PIN', 4: 'Lupa PIN' }; 
  return ( 
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"> 
      <div className={`w-full sm:max-w-sm rounded-[2.5rem] p-6 md:p-8 shadow-2xl relative border ${step === 4 ? 'bg-gradient-to-br from-primary to-navy-900 border-primary/30' : 'clean-card border-theme'}`}> 
        <button onClick={onCancel} className={`absolute top-6 right-6 hover:opacity-70 transition z-20 ${step === 4 ? 'text-white' : 'text-sub-theme hover:text-main'}`}><IconX className="w-6 h-6"/></button> 
        <div className="text-center mb-8 mt-2 relative z-10"> 
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${step === 4 ? 'bg-white/20 text-white' : 'bg-primary-light text-primary border border-primary/20'}`}><IconLock className="w-8 h-8"/></div> 
          <h3 className={`text-xl font-black ${step === 4 ? 'text-white' : 'text-main'}`}>{titles[step]}</h3> 
        </div> 
        {step === 4 ? ( 
          <form onSubmit={handleForgotSubmit} className="relative z-10"> 
            <div className="relative mb-4"> 
              <IconLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" /> 
              <input type={showPass?"text":"password"} required value={passInput} onChange={(e)=>setPassInput(e.target.value)} placeholder="Password Akun" className="w-full bg-black/30 rounded-xl py-4 pl-11 pr-12 text-sm text-white placeholder-white/60 focus:outline-none border border-transparent focus:border-primary transition" /> 
              <button type="button" onClick={()=>setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white">{showPass ? <IconEyeOff className="w-4 h-4"/> : <IconEye className="w-4 h-4"/>}</button> 
            </div> 
            {error && <p className="text-red-200 text-xs font-black text-center mb-4">{error}</p>} 
            <div className="flex gap-2"> 
              <button type="button" onClick={()=>{setStep(1); setError(''); setShowPass(false);}} className="flex-1 py-3.5 rounded-xl font-bold bg-black/20 text-white text-sm hover:bg-black/30 transition">Batal</button> 
              <button type="submit" className="flex-[2] py-3.5 rounded-xl font-black bg-white text-primary text-sm hover:bg-gray-100 transition shadow-md">Verifikasi</button> 
            </div> 
          </form> 
        ) : ( 
          <div className="relative z-10"> 
            <div className="flex justify-center gap-3 mb-8"> 
              {[0,1,2,3,4,5].map(i => (<div key={i} className={`w-4 h-4 rounded-full border-2 transition-colors ${i < pinInput.length ? 'bg-primary border-primary' : 'border-gray-300 dark:border-gray-600'}`}></div>))} 
            </div> 
            {error && <p className="text-red-500 text-xs font-black text-center mb-4 animate-pulse">{error}</p>} 
            <div className="grid grid-cols-3 gap-3"> 
              {[1,2,3,4,5,6,7,8,9].map(num => (<button key={num} onClick={()=>handleKey(num.toString())} className="bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-2xl py-4 text-2xl font-black text-main border border-theme transition shadow-sm">{num}</button>))} 
              {step === 1 ? <button onClick={()=>{setStep(4); setError('');}} className="text-[10px] font-bold text-primary hover:text-primary-hover underline">Lupa PIN?</button> : <div></div>} 
              <button onClick={()=>handleKey('0')} className="bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-2xl py-4 text-2xl font-black text-main border border-theme transition shadow-sm">0</button> 
              <button onClick={handleDelete} className="bg-red-500/10 hover:bg-red-50 hover:text-white text-red-500 rounded-2xl py-4 flex items-center justify-center border border-red-500/20 transition shadow-sm"><IconChevronLeft className="w-8 h-8"/></button> 
            </div> 
          </div> 
        )} 
      </div> 
    </div> 
  ); 
}

export const OrderSummaryModal = ({ isOpen, data, onConfirm, onCancel, isProcessing }: any) => { 
  if(!isOpen || !data) return null; 
  return ( 
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in zoom-in-95 duration-200"> 
      <div className="clean-card w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl"> 
        <div className="bg-gradient-to-r from-primary to-navy-800 p-6 text-center border-b border-primary/30"> 
          <h3 className="font-black text-xl text-white uppercase tracking-widest">Detail Pesanan</h3> 
        </div> 
        <div className="p-6 md:p-8 space-y-6 bg-card"> 
          <div className="flex items-center gap-4 bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-theme shadow-inner"> 
            <img src={data.gameImage} className="w-14 h-14 rounded-xl object-cover border border-theme shadow-sm" alt="" /> 
            <div><div className="font-black text-base text-main">{data.gameName}</div><div className="text-xs text-primary font-bold">{data.itemName}</div></div> 
          </div> 
          <div className="space-y-3 text-sm"> 
            <div className="flex justify-between items-center"><span className="text-sub-theme text-xs font-bold">Tujuan Pengisian</span><span className="font-mono font-black text-main bg-gray-100 dark:bg-black/50 px-2 py-1 rounded border border-theme shadow-sm">{data.userId} {data.zoneId ? `(${data.zoneId})` : ''}</span></div> 
            {data.nickname && <div className="flex justify-between items-center bg-primary-light p-2.5 rounded-xl border border-primary/20 shadow-sm"><span className="text-primary font-black uppercase text-xs">Nickname</span><span className="font-black text-main">{data.nickname}</span></div>} 
            <div className="flex justify-between items-center"><span className="text-sub-theme text-xs font-bold">Metode Pembayaran</span><span className="font-black text-primary">{data.paymentName}</span></div> 
            {data.usedCashback > 0 && <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-500"><span className="text-xs font-bold">Cashback Terpakai</span><span className="font-mono font-black">- {formatRupiah(data.usedCashback)}</span></div>} 
          </div> 
          <div className="border-t border-theme pt-5 pb-2 flex justify-between items-end"> 
            <span className="text-sub-theme text-xs font-black uppercase tracking-widest">Total Tagihan</span> 
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-500 font-mono drop-shadow-sm">{formatRupiah(data.finalPrice)}</span> 
          </div> 
          <div className="flex gap-3 pt-4"> 
            <button onClick={onCancel} disabled={isProcessing} className="flex-1 py-4 rounded-xl font-bold bg-gray-200 dark:bg-white/10 text-main hover:bg-gray-300 dark:hover:bg-white/20 transition text-xs uppercase border border-theme shadow-sm">Batal</button> 
            <button onClick={onConfirm} disabled={isProcessing} className="flex-[2] py-4 rounded-xl font-black bg-emerald-600 hover:bg-emerald-500 text-white flex justify-center items-center gap-2 text-xs uppercase transition shadow-lg shadow-emerald-500/30 disabled:opacity-50">{isProcessing ? <IconLoader className="w-5 h-5 animate-spin"/> : 'Konfirmasi & Bayar'}</button> 
          </div> 
        </div> 
      </div> 
    </div> 
  ) 
}

export const PostpaidInquiryModal = ({ isOpen, data, onConfirm, onCancel, isProcessing }: any) => { 
  if(!isOpen || !data) return null; 
  return ( 
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in zoom-in-95 duration-200"> 
      <div className="clean-card w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl border-t-4 border-t-emerald-500"> 
        <div className="p-6 md:p-8 space-y-6 bg-card"> 
          <div className="text-center mb-6"> 
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4"><IconSearch className="w-8 h-8"/></div> 
            <h3 className="font-black text-2xl text-main">Rincian Tagihan</h3> 
            <p className="text-xs text-sub-theme">Data ditemukan. Pastikan detail di bawah ini sudah benar sebelum membayar.</p> 
          </div> 
          <div className="bg-gray-50 dark:bg-black/50 border border-theme rounded-2xl p-5 space-y-3 shadow-inner text-sm"> 
            <div className="flex justify-between items-center border-b border-theme pb-2"><span className="text-sub-theme font-bold text-xs">Pelanggan</span><span className="font-black text-main">{data.customer_name}</span></div> 
            <div className="flex justify-between items-center border-b border-theme pb-2"><span className="text-sub-theme font-bold text-xs">Periode</span><span className="font-black text-main">{data.desc?.detail?.[0]?.periode || '-'}</span></div> 
            <div className="flex justify-between items-center pt-2"><span className="text-sub-theme font-bold text-xs">Total Pembayaran</span><span className="font-black text-emerald-600 dark:text-emerald-500 text-xl font-mono">{formatRupiah(data.price)}</span></div> 
          </div> 
          <div className="flex gap-3 pt-2"> 
            <button onClick={onCancel} disabled={isProcessing} className="flex-1 py-4 rounded-xl font-bold bg-gray-200 dark:bg-white/10 text-main hover:bg-gray-300 dark:hover:bg-white/20 transition text-xs uppercase border border-theme shadow-sm">Tutup</button> 
            <button onClick={onConfirm} disabled={isProcessing} className="flex-[2] py-4 rounded-xl font-black bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 text-xs uppercase transition shadow-lg shadow-emerald-500/30 disabled:opacity-50">{isProcessing ? <IconLoader className="w-5 h-5 animate-spin"/> : 'Lanjut Bayar'}</button> 
          </div> 
        </div> 
      </div> 
    </div> 
  ) 
}

export const OrderSuccessModal = ({ isOpen, onToHistory, onDone }: any) => { 
  if(!isOpen) return null; 
  return ( 
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in zoom-in-95 duration-200"> 
      <div className="clean-card p-6 md:p-8 max-w-sm w-full text-center border-2 border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.2)]"> 
        <div className="w-24 h-24 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"><IconCheckCircle className="w-12 h-12"/></div> 
        <h3 className="text-2xl font-black text-main mb-2">Pesanan Berhasil Dibuat</h3> 
        <p className="text-xs text-sub-theme mb-8 font-medium px-4">Segera lakukan pembayaran sesuai instruksi pada tiket tagihan Anda.</p> 
        <div className="flex gap-3"> 
          <button onClick={onDone} className="flex-1 py-4 rounded-xl font-bold bg-gray-100 dark:bg-white/5 text-main border border-theme hover:bg-gray-200 dark:hover:bg-white/10 transition text-xs uppercase shadow-sm">Selesai</button> 
          <button onClick={onToHistory} className="flex-[1.5] py-4 rounded-xl font-black bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-lg shadow-emerald-600/30 text-xs uppercase tracking-widest hover:scale-[1.02]">Lihat Tagihan</button> 
        </div> 
      </div> 
    </div> 
  ) 
}

export const ScannerResultModal = ({ isOpen, order, allGlobalOrders, onClose, onValidate, onCancelOrder, isProcessing }: any) => { 
  if (!isOpen || !order) return null; 
  const pastOrders = (allGlobalOrders||[]).filter((o:any) => o.userEmail === order.userEmail && o.status === 'Sukses').length; 
  const vip = calculateVIPLevel(pastOrders); 
  const cashbackEarned = order.priceTotal * vip.cashback; 
  return ( 
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"> 
      <div className="clean-card p-6 md:p-8 w-full max-w-md shadow-2xl relative"> 
        <button onClick={onClose} disabled={isProcessing} className="absolute top-4 right-4 text-sub-theme hover:text-main transition disabled:opacity-50"><IconX className="w-5 h-5"/></button> 
        <h3 className="text-xl font-black mb-5 text-main flex items-center gap-2"><IconQrcode className="w-6 h-6 text-primary"/> Validasi Pesanan</h3> 
        <div className="bg-gray-50 dark:bg-black/50 p-5 rounded-2xl border border-theme shadow-inner space-y-3 mb-6 text-sm"> 
          <div className="flex justify-between items-center border-b border-theme pb-2"><span className="text-sub-theme text-xs font-bold">ID Pesanan</span><span className="font-mono font-black text-main">{order.id}</span></div> 
          <div className="flex justify-between items-center border-b border-theme pb-2"><span className="text-sub-theme text-xs font-bold">Game & Item</span><span className="font-black text-main text-right">{order.gameName}<br/><span className="text-primary text-[10px] uppercase font-bold">{order.nominalName}</span></span></div> 
          <div className="flex justify-between items-center border-b border-theme pb-2"><span className="text-sub-theme text-xs font-bold">Target ID</span><span className="font-mono font-black text-main text-right">{order.targetUserId} {order.targetZoneId ? `(${order.targetZoneId})` : ''}</span></div> 
          {order.targetNickname && <div className="flex justify-between items-center border-b border-theme pb-2"><span className="text-sub-theme text-xs font-bold">Nickname</span><span className="font-black text-main">{order.targetNickname}</span></div>} 
          <div className="flex justify-between items-center pt-2"><span className="text-sub-theme text-xs font-bold">Total Harga</span><span className="font-black text-emerald-600 dark:text-emerald-500 text-xl">{formatRupiah(order.priceTotal)}</span></div> 
          {cashbackEarned > 0 && <div className="flex justify-between items-center pt-2 border-t border-theme"><span className="text-sub-theme text-xs font-bold">Cashback User</span><span className="font-black text-primary font-mono text-xs">+{formatRupiah(cashbackEarned)}</span></div>} 
        </div> 
        <div className="flex flex-col gap-3"> 
          <button onClick={() => onValidate(order, 'Sukses')} disabled={isProcessing} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-xl text-xs uppercase shadow-lg shadow-emerald-500/20 transition hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2">{isProcessing ? <IconLoader className="w-4 h-4 animate-spin"/> : 'Validasi Lunas & Proses API'}</button> 
          <button onClick={() => onCancelOrder(order.id, 'Batal')} disabled={isProcessing} className="w-full bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/30 text-red-600 dark:text-red-500 font-black py-3.5 rounded-xl text-xs uppercase shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2">{isProcessing ? <IconLoader className="w-4 h-4 animate-spin"/> : 'Batalkan Pesanan'}</button> 
        </div> 
      </div> 
    </div> 
  ) 
}

export const AdminFaceModal = ({ isOpen, imageSrc, memberName, onClose }: any) => { 
  if (!isOpen) return null; 
  return ( 
    <div className="fixed inset-0 z-[13000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"> 
      <div className="clean-card p-6 md:p-8 max-w-sm w-full text-center relative overflow-hidden shadow-[0_0_40px_rgba(59,130,246,0.15)] border-t-4 border-t-primary"> 
        <button onClick={onClose} className="absolute top-4 right-4 text-sub-theme hover:text-main transition z-20"><IconX className="w-6 h-6"/></button> 
        <div className="w-16 h-16 bg-primary-light text-primary rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20 shadow-inner"><IconScanFace className="w-8 h-8" /></div> 
        <h3 className="text-lg font-black mb-1 text-main">Data Face ID</h3> 
        <p className="text-[10px] text-sub-theme mb-6 font-black uppercase tracking-widest bg-gray-100 dark:bg-white/5 py-1 px-3 rounded-md inline-block border border-theme">{memberName}</p> 
        <div className="w-48 h-48 mx-auto rounded-3xl overflow-hidden border-2 border-primary/30 shadow-lg mb-8 bg-gray-100 dark:bg-black p-1"> 
          <div className="w-full h-full rounded-2xl overflow-hidden border border-theme"> 
            <img src={imageSrc} className="w-full h-full object-cover transform scale-x-[-1]" alt="" /> 
          </div> 
        </div> 
        <button onClick={onClose} className="w-full py-3.5 rounded-xl font-bold bg-gray-200 dark:bg-white/10 text-main border border-theme hover:bg-gray-300 dark:hover:bg-white/20 transition text-sm shadow-sm">Tutup Pratinjau</button> 
      </div> 
    </div> 
  ); 
};
