import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export const ThemeToggle = ({ size = 'md', className = '', style = {} }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  const buttonSize = size === 'sm' ? 32 : size === 'lg' ? 44 : 38;
  const iconSize = size === 'sm' ? 15 : size === 'lg' ? 20 : 17;

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`Current: ${isDark ? 'Graphite + Coral Pink' : 'Peach + Emerald + Turquoise'} (Click to switch)`}
      className={`gatherly-theme-toggle ${className}`}
      style={{
        width: `${buttonSize}px`,
        height: `${buttonSize}px`,
        borderRadius: 'var(--radius-full)',
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-subtle)',
        color: isDark ? 'var(--accent-secondary)' : 'var(--primary)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all var(--transition-base)',
        boxShadow: 'var(--shadow-sm)',
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--primary)';
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {isDark ? <Sun size={iconSize} /> : <Moon size={iconSize} />}
    </button>
  );
};

export default ThemeToggle;
