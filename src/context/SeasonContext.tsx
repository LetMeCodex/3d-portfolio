import React, { createContext, useContext, useState } from 'react';

type Season = 'summer' | 'rain';
type WeatherEffect = 'none' | 'sakura' | 'rain';

interface SeasonContextType {
  season: Season;
  activeEffect: WeatherEffect;
  setActiveEffect: (effect: WeatherEffect) => void;
  toggleSeason: () => void;
}

const SeasonContext = createContext<SeasonContextType | undefined>(undefined);

export function SeasonProvider({ children }: { children: React.ReactNode }) {
  const [season, setSeason] = useState<Season>('summer');
  const [activeEffect, setActiveEffectState] = useState<WeatherEffect>('none');

  const setActiveEffect = (effect: WeatherEffect) => {
    setActiveEffectState(effect);
    if (effect !== 'none') {
      setSeason(effect === 'sakura' ? 'summer' : 'rain');
    }
  };

  const toggleSeason = () => {
    const nextSeason = season === 'summer' ? 'rain' : 'summer';
    setSeason(nextSeason);
    // Automatically activate the corresponding effect when toggled via menu
    setActiveEffectState(nextSeason === 'summer' ? 'sakura' : 'rain');
  };

  return (
    <SeasonContext.Provider value={{ season, activeEffect, setActiveEffect, toggleSeason }}>
      {children}
    </SeasonContext.Provider>
  );
}

export function useSeason() {
  const context = useContext(SeasonContext);
  if (!context) {
    throw new Error('useSeason must be used within a SeasonProvider');
  }
  return context;
}
