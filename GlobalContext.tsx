import React, { createContext, useContext } from 'react';

const GlobalContext = createContext<any>(null);

export const useGlobal = () => {
    const context = useContext(GlobalContext);
    if (!context) throw new Error('useGlobal must be used within GlobalProvider');
    return context;
};

export const GlobalProvider = ({ children, value }: { children: React.ReactNode, value: any }) => {
    return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
};
