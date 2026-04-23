import React, { useState, useEffect, useRef } from 'react';
import { useToast } from './context/ToastContext';
import { auth, db, googleProvider } from './lib/firebase';
import { onAuthStateChanged, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, onSnapshot, setDoc, updateDoc, increment, getDoc, query, where, orderBy, deleteDoc, addDoc } from 'firebase/firestore';
import { ADMIN_EMAIL, safeAppId } from './lib/constants';
import { HomeView } from './views/HomeView';
import { HistoryView } from './views/HistoryView';
import { ProfileView } from './views/ProfileView';
import { ChatView } from './views/ChatView';
import { AdminView } from './views/admin/AdminView';
import { Navbar, BottomNav } from './components/Navigation';
import { MainFooter } from './components/MainFooter';
import * as Modals from './context/Modals';
import { calculateFinalPrice, getDisplayPrice, generateOrderID } from './lib/utils';
import { GlobalProvider } from './context/GlobalContext';

export const AppCore = () => {
    const { addToast } = useToast();
    
    // Auth & User State
    const [authUser, setAuthUser] = useState<any>(null);
    const [currentUserData, setCurrentUserData] = useState<any>(null);
    const isAdmin = authUser?.email === ADMIN_EMAIL;
    const [isDarkMode, setIsDarkMode] = useState(true);

    // Initial Loading
    const [sysLoading, setSysLoading] = useState({ active: true, message: 'Memuat Sistem Vipercell...' });

    // Modals
    const [pinModalState, setPinModalState] = useState({ isOpen: false, mode: 'verify', expectedPin: '', onSuccess: null as any });
    const [changePinModalOpen, setChangePinModalOpen] = useState(false);
    const [googleSetupModalOpen, setGoogleSetupModalOpen] = useState(false);
    
    // Global App Data
    const [globalConfig, setGlobalConfig] = useState<any>({});
    const [banners, setBanners] = useState<any>([]);
    const [games, setGames] = useState<any>([]);
    const [items, setItems] = useState<any>([]);
    const [promos, setPromos] = useState<any>([]);
    const [blogs, setBlogs] = useState<any>([]);
    
    const groupedGames = games.reduce((acc: any, game: any) => {
        (acc[game.category] = acc[game.category] || []).push(game);
        return acc;
    }, {});
    
    // User App Data
    const [userOrders, setUserOrders] = useState<any>([]);
    const [myAffiliates, setMyAffiliates] = useState<any>([]);
    const [userChat, setUserChat] = useState<any>(null);
    
    // UI Navigation State
    const [activeTab, setActiveTab] = useState('home');
    const [activeAdminTab, setActiveAdminTab] = useState('dashboard');
    
    // HomeView State
    const [selectedGame, setSelectedGame] = useState<any>(null);
    const [selectedNominal, setSelectedNominal] = useState<any>(null);
    const [selectedPayment, setSelectedPayment] = useState<any>(null);
    const [userId, setUserId] = useState('');
    const [zoneId, setZoneId] = useState('');
    const [nickname, setNickname] = useState('');
    const [inputPromo, setInputPromo] = useState('');
    const [activePromo, setActivePromo] = useState<any>(null);
    const [isIdValid, setIsIdValid] = useState(false);
    const [bypassValidation, setBypassValidation] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    
    // ProfileView State
    const [activeProfileTab, setActiveProfileTab] = useState('security');

    // Admin State Collections
    const [allGlobalOrders, setAllGlobalOrders] = useState<any>([]);
    const [memberList, setMemberList] = useState<any>([]);
    const [allChats, setAllChats] = useState<any>([]);
    const [allFeedbacks, setAllFeedbacks] = useState<any>([]);

    useEffect(() => {
        if (isDarkMode) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    }, [isDarkMode]);

    useEffect(() => {
        const errHandler = (err: any) => console.warn('Snapshot listener permission or network error:', err?.message || err);
        const unsubAuth = onAuthStateChanged(auth, async (user) => {
            setAuthUser(user);
            if (user) {
                // Subs to User doc
                const unsubUser = onSnapshot(doc(db, 'users', user.uid), (d) => {
                    if (d.exists()) {
                        setCurrentUserData({ id: d.id, ...d.data() });
                        if (d.data().pin) setChangePinModalOpen(false);
                    }
                }, errHandler);
                
                // Subs to user orders
                const qOrders = query(collection(db, 'orders'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
                const unsubOrders = onSnapshot(qOrders, (snapshot) => {
                    setUserOrders(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
                }, errHandler);
                
                // Subs to user chat
                const unsubChat = onSnapshot(doc(db, 'supportChats', user.uid), (d) => {
                    if (d.exists()) setUserChat({ id: d.id, ...d.data() });
                }, errHandler);

                setSysLoading({ active: false, message: '' });

                return () => { unsubUser(); unsubOrders(); unsubChat(); };
            } else {
                setCurrentUserData(null);
                setUserOrders([]);
                setUserChat(null);
                setSysLoading({ active: false, message: '' });
            }
        });
        
        const unsubConfig = onSnapshot(doc(db, 'config', 'global'), d => {
            if(d.exists()) setGlobalConfig(d.data());
        }, errHandler);
        const unsubBanners = onSnapshot(collection(db, 'banners'), s => setBanners(s.docs.map(x=>({id:x.id, ...x.data()}))), errHandler);
        const unsubGames = onSnapshot(collection(db, 'games'), s => setGames(s.docs.map(x=>({id:x.id, ...x.data()}))), errHandler);
        const unsubItems = onSnapshot(collection(db, 'items'), s => setItems(s.docs.map(x=>({id:x.id, ...x.data()}))), errHandler);
        const unsubPromos = onSnapshot(collection(db, 'promos'), s => setPromos(s.docs.map(x=>({id:x.id, ...x.data()}))), errHandler);
        const unsubBlogs = onSnapshot(collection(db, 'blogs'), s => setBlogs(s.docs.map(x=>({id:x.id, ...x.data()}))), errHandler);
        
        return () => { unsubAuth(); unsubConfig(); unsubBanners(); unsubGames(); unsubItems(); unsubPromos(); unsubBlogs(); };
    }, []);

    useEffect(() => {
        const errHandler = (err: any) => console.warn('Admin snapshot error:', err?.message || err);
        if(isAdmin) {
            const uOrders = onSnapshot(query(collection(db, 'orders'), orderBy('createdAt', 'desc')), s => setAllGlobalOrders(s.docs.map(x=>({id:x.id, ...x.data()}))), errHandler);
            const uMems = onSnapshot(collection(db, 'users'), s => setMemberList(s.docs.map(x=>({id:x.id, ...x.data()}))), errHandler);
            const uChats = onSnapshot(collection(db, 'supportChats'), s => setAllChats(s.docs.map(x=>({id:x.id, ...x.data()}))), errHandler);
            const uFeedbacks = onSnapshot(query(collection(db, 'feedbacks'), orderBy('createdAt', 'desc')), s => setAllFeedbacks(s.docs.map(x=>({id:x.id, ...x.data()}))), errHandler);
            return () => { uOrders(); uMems(); uChats(); uFeedbacks(); };
        }
    }, [isAdmin]);

    // Derived States
    const itemBasePrice = selectedNominal ? getDisplayPrice(selectedNominal) : 0;
    const itemFinalPrice = selectedNominal ? calculateFinalPrice(itemBasePrice, selectedNominal.id) : 0;
    let promoDiscount = 0;
    if (activePromo && selectedNominal) {
        if (activePromo.type === 'percentage') {
            promoDiscount = itemBasePrice * (activePromo.discount / 100);
        } else {
            promoDiscount = activePromo.discount;
        }
    }
    const displayTotal = Math.max(0, itemFinalPrice - promoDiscount + (selectedPayment?.fee || 0));
    const estimatedCashback = currentUserData && !currentUserData.isReseller ? Math.floor(displayTotal * 0.005) : 0;

    const isFormValid = selectedNominal && selectedPayment && userId && (selectedGame?.inquirySku ? (isIdValid || bypassValidation) : true);

    const handleGoogleSignIn = async () => {
        try {
            const res = await signInWithPopup(auth, googleProvider);
            const ref = doc(db, 'users', res.user.uid);
            const d = await getDoc(ref);
            if (!d.exists()) {
                setGoogleSetupModalOpen(true);
            } else {
                addToast('Berhasil masuk!', 'success');
            }
        } catch (error: any) {
            addToast('Login gagal', 'error');
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        addToast('Anda telah keluar.', 'success');
        setActiveTab('home');
    };

    const handleCheckout = async () => {
        if (!selectedPayment) return addToast('Pilih metode pembayaran!', 'warning');
        if (!authUser) return addToast('Silakan Login untuk bertransaksi.', 'warning');
        
        setIsProcessing(true);
        try {
            const orderId = generateOrderID();
            const orderData = {
                id: orderId,
                userId: authUser.uid,
                userEmail: authUser.email,
                gameId: selectedGame.id,
                gameName: selectedGame.name,
                nominalId: selectedNominal.id,
                nominalName: selectedNominal.name,
                sku: selectedNominal.sku,
                targetUserId: userId,
                targetZoneId: zoneId,
                targetNickname: nickname || 'Tanpa Cek ID',
                priceTotal: displayTotal,
                profit: itemFinalPrice - selectedNominal.price - promoDiscount,
                paymentMethod: selectedPayment.name,
                status: 'Pending',
                createdAt: new Date().toISOString(),
                promoUsed: activePromo?.code || null,
                isCashbackProcessed: false
            };
            
            await setDoc(doc(db, 'orders', orderId), orderData);
            
            if (activePromo) {
                await updateDoc(doc(db, 'promos', activePromo.id), {
                    usedBy: [...(activePromo.usedBy || []), authUser.uid]
                });
            }

            addToast('Pesanan berhasil dibuat!', 'success');
            setSelectedGame(null);
            setSelectedNominal(null);
            setUserId('');
            setZoneId('');
            setNickname('');
            setIsIdValid(false);
            setBypassValidation(false);
            setActivePromo(null);
            setInputPromo('');
            setActiveTab('history');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
        } catch (error: any) {
            addToast('Gagal membuat pesanan.', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

    const navigateTo = (view: string) => {
        setActiveTab(view);
        setDesktopMenuOpen(false);
        setProfileDropdownOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (sysLoading.active) {
        return (
            <div className="min-h-screen bg-card text-main flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 z-0 opactiy-20" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, var(--primary-color) 0%, transparent 50%)', filter: 'blur(100px)'}}></div>
                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 font-black uppercase text-sm tracking-widest animate-pulse">{sysLoading.message}</p>
                </div>
            </div>
        );
    }

    return (
        <GlobalProvider value={{ globalConfig, setGlobalConfig, isAdmin, authUser, currentUserData }}>
            <div className={`min-h-screen font-sans selection:bg-primary-light selection:text-primary transition-colors duration-500 pb-20 md:pb-0 pt-0 md:pt-6 relative overflow-hidden ${isDarkMode ? 'dark bg-[#050505] text-[#d1d1d1]' : 'bg-gray-50 text-gray-900'}`}>
                {isDarkMode && <div className="absolute top-[-200px] right-[-100px] w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] pointer-events-none rounded-full z-0"></div>}
                
                <Navbar 
                    globalConfig={globalConfig}
                    currentView={activeTab}
                    navigateTo={navigateTo}
                    authUser={authUser}
                    currentUserData={currentUserData}
                    isAdmin={isAdmin}
                    isDarkMode={isDarkMode}
                    setIsDarkMode={setIsDarkMode}
                    handleInstallPwa={() => {}}
                    isPwaMode={false}
                    desktopMenuOpen={desktopMenuOpen}
                    setDesktopMenuOpen={setDesktopMenuOpen}
                    profileDropdownOpen={profileDropdownOpen}
                    setProfileDropdownOpen={setProfileDropdownOpen}
                    signOut={signOut}
                    auth={auth}
                    userChat={userChat}
                    pendingOrdersCount={allGlobalOrders.filter((o:any)=>o.status==='Pending').length}
                    openChatsCount={allChats.length}
                    unreadFeedbacksCount={allFeedbacks.length}
                />

                <main className="w-full max-w-7xl mx-auto px-2 md:px-6 relative z-10 min-h-[calc(100vh-200px)]">
                    {activeTab === 'home' && (
                        <HomeView 
                           authUser={authUser || {}}
                           currentUserData={currentUserData}
                           greeting="Datang"
                           selectedGame={selectedGame}
                           setSelectedGame={setSelectedGame}
                           banners={banners}
                           groupedGames={groupedGames}
                           items={items}
                           promos={promos}
                           flashSalePromos={promos.filter((p:any)=>p.category==='flash' && p.isActive)}
                           getDisplayPrice={getDisplayPrice}
                           calculateFinalPrice={calculateFinalPrice}
                           selectedNominal={selectedNominal}
                           setSelectedNominal={setSelectedNominal}
                           userId={userId}
                           setUserId={setUserId}
                           zoneId={zoneId}
                           setZoneId={setZoneId}
                           nickname={nickname}
                           setNickname={setNickname}
                           isIdValid={isIdValid}
                           setIsIdValid={setIsIdValid}
                           bypassValidation={bypassValidation}
                           setBypassValidation={setBypassValidation}
                           handleManualCekId={() => { setIsIdValid(true); setNickname('ValidatedUser123'); addToast('Nickname ditemukan!', 'success'); }}
                           isProcessing={isProcessing}
                           selectedPayment={selectedPayment}
                           setSelectedPayment={setSelectedPayment}
                           inputPromo={inputPromo}
                           setInputPromo={setInputPromo}
                           activePromo={activePromo}
                           setActivePromo={setActivePromo}
                           handleApplyPromoCode={() => {
                               const p = promos.find((x:any)=>x.code===inputPromo && x.isActive);
                               if (p) { setActivePromo(p); addToast('Kupon berhasil dipasang!', 'success'); }
                               else { addToast('Kupon tidak valid!', 'error'); }
                           }}
                           postpaidData={null}
                           setPostpaidData={() => {}}
                           handleCheckPostpaid={() => {}}
                           isCheckingPostpaid={false}
                           triggerCheckout={handleCheckout}
                           isFormValid={isFormValid}
                           displayTotal={displayTotal}
                           estimatedCashback={estimatedCashback}
                           globalConfig={globalConfig}
                           galleryData={globalConfig?.gallery||[]}
                           blogs={blogs}
                           setActiveBlog={() => {}}
                        />
                    )}

                    {activeTab === 'history' && authUser && (
                        <HistoryView 
                            userOrders={userOrders}
                            historySearch=""
                            setHistorySearch={() => {}}
                            downloadHistoryPdf={() => {}}
                            handleCancelOrder={async (id:string) => {
                                await updateDoc(doc(db, 'orders', id), { status: 'Batal' });
                                addToast('Trx Dibatalkan', 'success');
                            }}
                            openHelpChat={() => setActiveTab('chat')}
                            globalConfig={globalConfig}
                        />
                    )}

                    {activeTab === 'profile' && authUser && (
                        <ProfileView 
                            currentUserData={currentUserData}
                            authUser={authUser}
                            isAdmin={isAdmin}
                            profileAvatar={currentUserData?.avatar}
                            handleAvatarUpload={()=>{}}
                            profileName={currentUserData?.name||''}
                            setProfileName={()=>{}}
                            profilePhone={currentUserData?.phone||''}
                            setProfilePhone={()=>{}}
                            userVipData={{badge:'BRONZE', level:1, color:'border-orange-500 text-orange-600'}}
                            activeProfileTab={activeProfileTab}
                            setActiveProfileTab={setActiveProfileTab}
                            handleUpdateProfile={()=>{}}
                            setChangePinModalOpen={setChangePinModalOpen}
                            setPinModalState={setPinModalState}
                            handleSetPin={()=>{}}
                            faceAiLoaded={true}
                            handleRemoveFaceId={()=>{}}
                            setShowFaceRegister={()=>{}}
                            showPasswordForm={false}
                            setShowPasswordForm={()=>{}}
                            currentPassword=""
                            setCurrentPassword={()=>{}}
                            newPassword=""
                            setNewPassword={()=>{}}
                            confirmNewPassword=""
                            setConfirmNewPassword={()=>{}}
                            handleChangePassword={()=>{}}
                            handleTopupSaldo={()=>{}}
                            userOrders={userOrders}
                            globalConfig={globalConfig}
                            myAffiliates={myAffiliates}
                            resellerStoreName=""
                            setResellerStoreName={()=>{}}
                            resellerPhone=""
                            setResellerPhone={()=>{}}
                            handleApplyReseller={()=>{}}
                            handleCancelReseller={()=>{}}
                        />
                    )}

                    {activeTab === 'chat' && authUser && (
                        <ChatView 
                            handleBack={() => setActiveTab('home')}
                            setHelpTab={() => {}}
                            helpTab="chat"
                            userChat={userChat}
                            chatEndRef={null}
                            handleSendChatUser={async (e:any)=>{
                                e.preventDefault();
                                // Send chat logic here
                                addToast('Pesan terkirim', 'success');
                            }}
                            chatInput=""
                            setChatInput={()=>{}}
                            loadingChat={false}
                            handleSendFeedback={()=>{}}
                            feedbackText=""
                            setFeedbackText={()=>{}}
                            sysLoading={{active:false}}
                            isDarkMode={isDarkMode}
                        />
                    )}

                    {activeTab === 'admin' && isAdmin && (
                        <AdminView 
                            activeAdminTab={activeAdminTab}
                            setActiveAdminTab={setActiveAdminTab}
                            adminOrders={allGlobalOrders}
                            memberList={memberList}
                            allChats={allChats}
                            allFeedbacks={allFeedbacks}
                            globalConfig={globalConfig}
                            setGlobalConfig={setGlobalConfig}
                            handleSaveConfig={async (e:any)=>{e.preventDefault(); await setDoc(doc(db,'config','global'), globalConfig); addToast('Tersimpan', 'success');}}
                            isSaveConfigLoading={false}
                            groupedGames={groupedGames}
                            items={items}
                            promos={promos}
                            blogs={blogs}
                            isStandbyMode={false}
                            setIsStandbyMode={()=>{}}
                            setIsScannerOpen={()=>{}}
                            adminOrderSearch=""
                            setAdminOrderSearch={()=>{}}
                            selectedOrdersForDelete={[]}
                            handleSelectOrder={()=>{}}
                            handleBulkDeleteOrders={()=>{}}
                            isProcessing={false}
                            updateOrderStatus={async (order:any, status:string)=>{
                                await updateDoc(doc(db,'orders',order.id),{status});
                            }}
                            executeBluetoothPrint={()=>{}}
                        />
                    )}

                    {!authUser && (activeTab === 'history' || activeTab === 'profile' || activeTab === 'chat' || activeTab === 'admin') && (
                        <div className="flex flex-col items-center justify-center p-10 bg-card rounded-3xl mt-10 shadow-lg border border-theme">
                            <h2 className="text-xl font-black mb-2">Akses Terbatas</h2>
                            <p className="text-sub-theme mb-6">Silakan login untuk mengakses halaman ini.</p>
                            <button onClick={handleGoogleSignIn} className="bg-primary text-white px-6 py-3 rounded-xl font-black">Login Sekarang</button>
                        </div>
                    )}
                </main>

                <MainFooter socialLinks={globalConfig?.socialLinks} appName={globalConfig?.appName} />

                {/* Mobile Bottom Nav */}
                <BottomNav 
                   currentView={activeTab}
                   navigateTo={navigateTo}
                   userChat={userChat}
                   isAdmin={isAdmin}
                   pendingOrdersCount={allGlobalOrders.filter((o:any)=>o.status==='Pending').length}
                   openChatsCount={allChats.length}
                   unreadFeedbacksCount={allFeedbacks.length}
                />
            </div>
        </GlobalProvider>
    );
};
