import { create } from 'zustand';

interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => {
  // Check local storage or system preference on load
  const isDark =
    localStorage.getItem('kuavanta-theme') === 'dark' ||
    (!('kuavanta-theme' in localStorage) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (isDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  return {
    theme: isDark ? 'dark' : 'light',
    toggleTheme: () =>
      set((state) => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('kuavanta-theme', newTheme);
        
        if (newTheme === 'dark') {
          document.documentElement.setAttribute('data-theme', 'dark');
        } else {
          document.documentElement.removeAttribute('data-theme');
        }
        
        return { theme: newTheme };
      }),
  };
});
