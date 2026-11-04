import React from 'react';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  icon: Icon,
  mono = false,
  className = '',
  style = {},
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: 'rgba(var(--primary-rgb), 0.15)',
          color: 'var(--primary)',
          border: '1px solid rgba(var(--primary-rgb), 0.35)',
        };
      case 'secondary':
      case 'accent':
      case 'cyan':
      case 'turquoise':
        return {
          background: 'rgba(var(--accent-secondary-rgb), 0.16)',
          color: 'var(--accent-secondary)',
          border: '1px solid rgba(var(--accent-secondary-rgb), 0.35)',
        };
      case 'highlight':
      case 'pink':
        return {
          background: 'rgba(var(--highlight-rgb), 0.18)',
          color: 'var(--highlight)',
          border: '1px solid rgba(var(--highlight-rgb), 0.35)',
        };
      case 'featured':
        return {
          background: 'linear-gradient(135deg, var(--primary), var(--accent-secondary))',
          color: 'var(--text-inverse)',
          border: 'none',
          boxShadow: '0 2px 8px rgba(var(--primary-rgb), 0.3)',
        };
      case 'success':
        return {
          background: 'var(--success-bg)',
          color: 'var(--success)',
          border: '1px solid var(--success)',
        };
      case 'warning':
        return {
          background: 'var(--warning-bg)',
          color: 'var(--warning)',
          border: '1px solid var(--warning)',
        };
      case 'error':
        return {
          background: 'var(--error-bg)',
          color: 'var(--error)',
          border: '1px solid var(--error)',
        };
      case 'peach':
        return {
          background: 'var(--bg-elevated)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-subtle)',
        };
      case 'default':
      default:
        return {
          background: 'var(--bg-elevated)',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border-subtle)',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: '2px 8px',
          fontSize: '0.68rem',
          borderRadius: 'var(--radius-sm)',
        };
      case 'lg':
        return {
          padding: '5px 12px',
          fontSize: 'var(--text-xs)',
          borderRadius: 'var(--radius-md)',
        };
      case 'md':
      default:
        return {
          padding: '3px 10px',
          fontSize: '0.72rem',
          borderRadius: 'var(--radius-sm)',
        };
    }
  };

  return (
    <span
      className={`gatherly-badge ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        fontWeight: 'var(--weight-bold)',
        letterSpacing: mono ? '0.04em' : '0.02em',
        fontFamily: mono ? 'var(--font-mono)' : 'var(--font-heading)',
        lineHeight: 1.2,
        textTransform: 'uppercase',
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...style,
      }}
    >
      {Icon && <Icon size={size === 'sm' ? 11 : size === 'lg' ? 14 : 12} />}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
