import { create } from 'zustand';

interface ThemeState {
  theme: 'dark';
}

document.documentElement.setAttribute('data-theme', 'dark');
localStorage.setItem('kuavanta-theme', 'dark');

export const useThemeStore = create<ThemeState>(() => ({
  theme: 'dark',
}));
