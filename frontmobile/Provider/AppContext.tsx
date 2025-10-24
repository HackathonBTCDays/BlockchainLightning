import React, { createContext, useState, useContext } from 'react';

type AppContextType = {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  selectedCertificateType: string | null;
  setSelectedCertificateType: React.Dispatch<React.SetStateAction<string | null>>;
  userData: Record<string, any>;
  setUserData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  paymentInfo: any;
  setPaymentInfo: React.Dispatch<React.SetStateAction<any>>;
  certificateInfo: any;
  setCertificateInfo: React.Dispatch<React.SetStateAction<any>>;
  resetState: () => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [selectedCertificateType, setSelectedCertificateType] = useState<string | null>(null);
  const [userData, setUserData] = useState<Record<string, any>>({});
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [certificateInfo, setCertificateInfo] = useState<any>(null);

  const resetState = () => {
    setSelectedCertificateType(null);
    setUserData({});
    setPaymentInfo(null);
    setCertificateInfo(null);
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        selectedCertificateType,
        setSelectedCertificateType,
        userData,
        setUserData,
        paymentInfo,
        setPaymentInfo,
        certificateInfo,
        setCertificateInfo,
        resetState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
