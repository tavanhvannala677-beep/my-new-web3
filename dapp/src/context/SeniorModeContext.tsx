import React, { createContext, useContext, useState, useEffect } from 'react';

interface SeniorModeContextType {
  isSeniorMode: boolean;
  toggleSeniorMode: () => void;
}

const SeniorModeContext = createContext<SeniorModeContextType>({
  isSeniorMode: true,
  toggleSeniorMode: () => {},
});

export const SeniorModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Elderly mode is enabled by default for maximum friendliness
  const [isSeniorMode, setIsSeniorMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('senior_mode');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('senior_mode', String(isSeniorMode));
    } catch {
      // ignore
    }
  }, [isSeniorMode]);

  const toggleSeniorMode = () => {
    setIsSeniorMode(prev => !prev);
  };

  return (
    <SeniorModeContext.Provider
      value={{
        isSeniorMode,
        toggleSeniorMode,
      }}
    >
      {children}
    </SeniorModeContext.Provider>
  );
};

export const useSeniorMode = () => useContext(SeniorModeContext);
