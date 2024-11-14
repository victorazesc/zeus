import React, { createContext, useContext, useState, ReactNode } from "react";

interface HeaderContextType {
    header: ReactNode;
    setHeader: (header: ReactNode) => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export const HeaderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [header, setHeader] = useState<ReactNode>(null);

    return (
        <HeaderContext.Provider value={{ header, setHeader }}>
            {children}
        </HeaderContext.Provider>
    );
};

export const useHeader = () => {
    const context = useContext(HeaderContext);
    if (!context) throw new Error("useHeader must be used within a HeaderProvider");
    return context;
};