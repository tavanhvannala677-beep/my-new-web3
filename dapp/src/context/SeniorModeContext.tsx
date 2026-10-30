import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Accessibility configuration for rural farmers and elderly users.
 * Supports larger fonts, simplified controls, high-contrast visibility under outdoor sunlight,
 * and audio guidance prompts.
 */
interface SeniorModeContextType {
  isSeniorMode: boolean;
  toggleSeniorMode: () => void;
  isHighContrast: boolean;
  toggleHighContrast: () => void;
  fontSizeScale: number;
  audioGuidanceEnabled: boolean;
  toggleAudioGuidance: () => void;
}

const SeniorModeContext = createContext<SeniorModeContextType>({
  isSeniorMode: true,
  toggleSeniorMode: () => {},
  isHighContrast: false,
  toggleHighContrast: () => {},
  fontSizeScale: 1.25,
  audioGuidanceEnabled: false,
  toggleAudioGuidance: () => {},
});

export const SeniorModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Senior Mode state (default to true for maximum ease of use)
  const [isSeniorMode, setIsSeniorMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('senior_mode');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  // 2. High Contrast mode state (for outdoor sunlight visibility)
  const [isHighContrast, setIsHighContrast] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('senior_high_contrast');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  // 3. Audio guidance prompt toggle
  const [audioGuidanceEnabled, setAudioGuidanceEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('senior_audio_guidance');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  // Sync state to LocalStorage and DOM classes
  useEffect(() => {
    try {
      localStorage.setItem('senior_mode', String(isSeniorMode));
      localStorage.setItem('senior_high_contrast', String(isHighContrast));
      localStorage.setItem('senior_audio_guidance', String(audioGuidanceEnabled));

      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('senior-mode', isSeniorMode);
        document.documentElement.classList.toggle('high-contrast-mode', isHighContrast);
      }
    } catch {
      // Ignore storage errors in restrictive environments
    }
  }, [isSeniorMode, isHighContrast, audioGuidanceEnabled]);

  const toggleSeniorMode = () => setIsSeniorMode(prev => !prev);
  const toggleHighContrast = () => setIsHighContrast(prev => !prev);
  const toggleAudioGuidance = () => setAudioGuidanceEnabled(prev => !prev);

  const fontSizeScale = isSeniorMode ? 1.25 : 1.0;

  return (
    <SeniorModeContext.Provider
      value={{
        isSeniorMode,
        toggleSeniorMode,
        isHighContrast,
        toggleHighContrast,
        fontSizeScale,
        audioGuidanceEnabled,
        toggleAudioGuidance,
      }}
    >
      {children}
    </SeniorModeContext.Provider>
  );
};

export const useSeniorMode = () => useContext(SeniorModeContext);
