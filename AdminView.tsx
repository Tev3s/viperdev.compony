import React from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminDashboard } from './AdminDashboard';
import { AdminFinance } from './AdminFinance';
import { AdminOrders } from './AdminOrders';
import { AdminMembers } from './AdminMembers';
import { AdminSupport } from './AdminSupport';
import { AdminDatabase } from './AdminDatabase';
import { AdminSettings } from './AdminSettings';
import { AdminBlog } from './AdminBlog';
import { AdminKatalog } from './AdminKatalog';
import { AdminPromo } from './AdminPromo';

export const AdminView = (props: any) => {
    const {
        activeAdminTab, setActiveAdminTab, adminOrders, memberList, allChats, allFeedbacks
    } = props;

    const pendingOrdersCount = (adminOrders||[]).filter((o:any) => o.status === 'Pending').length;
    const openChatsCount = (allChats||[]).filter((c:any) => c.status === 'Buka').length;
    const unreadFeedbacksCount = (allFeedbacks||[]).filter((f:any) => f.status === 'Unread').length;

    return (
        <div className="flex flex-col lg:flex-row gap-6 w-full max-w-[1400px] mx-auto min-h-screen pt-4 pb-10 px-2 sm:px-4">
            <AdminSidebar 
                activeAdminTab={activeAdminTab} 
                setActiveAdminTab={setActiveAdminTab} 
                pendingOrdersCount={pendingOrdersCount}
                memberList={memberList}
                openChatsCount={openChatsCount}
                unreadFeedbacksCount={unreadFeedbacksCount}
            />

            <div className="flex-1 w-full min-w-0 pb-10">
                {activeAdminTab === 'dashboard' && <AdminDashboard {...props} />}
                {activeAdminTab === 'finance' && <AdminFinance {...props} />}
                {activeAdminTab === 'orders' && <AdminOrders {...props} />}
                {activeAdminTab === 'members' && <AdminMembers {...props} />}
                {activeAdminTab === 'support' && <AdminSupport {...props} />}
                {activeAdminTab === 'database' && <AdminDatabase {...props} />}
                {activeAdminTab === 'settings' && <AdminSettings {...props} />}
                {activeAdminTab === 'blog' && <AdminBlog {...props} />}
                {activeAdminTab === 'katalog' && <AdminKatalog {...props} />}
                {activeAdminTab === 'promo' && <AdminPromo {...props} />}
            </div>
        </div>
    );
};
