'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  primaryColor: string;
  themePreset: string;
  setThemeColor: (color: string, preset?: string) => void;
}

const defaultPrimaryColor = '#f53d2d';

const ThemeContext = createContext<ThemeContextType>({
  primaryColor: defaultPrimaryColor,
  themePreset: 'orange',
  setThemeColor: () => {},
});

function applyThemeVariables(color: string) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.style.setProperty('--color-primary', color);
  
  // Calculate slightly darker for hover
  try {
    const num = parseInt(color.replace('#', ''), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) - 20));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) - 20));
    const b = Math.max(0, Math.min(255, (num & 0x0000ff) - 20));
    const hoverColor = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    root.style.setProperty('--color-primary-hover', hoverColor);
    root.style.setProperty('--color-primary-light', `${color}15`);
  } catch (e) {
    root.style.setProperty('--color-primary-hover', color);
    root.style.setProperty('--color-primary-light', '#fff7ed');
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [primaryColor, setPrimaryColorState] = useState<string>(defaultPrimaryColor);
  const [themePreset, setThemePresetState] = useState<string>('orange');

  useEffect(() => {
    // 1. Check localStorage first for instant responsiveness
    const saved = localStorage.getItem('betashop_primary_color');
    const savedPreset = localStorage.getItem('betashop_theme_preset');
    if (saved) {
      setPrimaryColorState(saved);
      if (savedPreset) setThemePresetState(savedPreset);
      applyThemeVariables(saved);
    }

    // 2. Fetch live settings from server
    fetch('/api/settings')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data?.primaryColor) {
          const sColor = res.data.primaryColor;
          const sPreset = res.data.themePreset || 'custom';
          setPrimaryColorState(sColor);
          setThemePresetState(sPreset);
          localStorage.setItem('betashop_primary_color', sColor);
          localStorage.setItem('betashop_theme_preset', sPreset);
          applyThemeVariables(sColor);
        }
      })
      .catch(() => {});
  }, []);

  const setThemeColor = (color: string, preset: string = 'custom') => {
    setPrimaryColorState(color);
    setThemePresetState(preset);
    localStorage.setItem('betashop_primary_color', color);
    localStorage.setItem('betashop_theme_preset', preset);
    applyThemeVariables(color);
  };

  return (
    <ThemeContext.Provider value={{ primaryColor, themePreset, setThemeColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
