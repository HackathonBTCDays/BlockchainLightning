import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [selectedCertificateType, setSelectedCertificateType] = useState(null);
  const [userData, setUserData] = useState({});
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [certificateInfo, setCertificateInfo] = useState(null);

  const resetState = () => {
    setSelectedCertificateType(null);
    setUserData({});
    setPaymentInfo(null);
    setCertificateInfo(null);
  };

  return (
    <AppContext.Provider
      value={{
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

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
