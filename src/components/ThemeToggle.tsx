import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import './ThemeToggle.css';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle glass"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="icon text-primary" size={20} />
      ) : (
        <Sun className="icon text-primary" size={20} />
      )}
    </button>
  );
};
