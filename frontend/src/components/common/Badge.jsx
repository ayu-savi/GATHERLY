import React from 'react';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  icon: Icon,
  className = '',
  style = {},
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: 'rgba(var(--primary-rgb), 0.15)',
          color: 'var(--primary)',
          border: '1px solid rgba(var(--primary-rgb), 0.3)',
        };
      case 'cyan':
        return {
          background: 'rgba(var(--accent-cyan-rgb), 0.15)',
          color: 'var(--accent-cyan)',
          border: '1px solid rgba(var(--accent-cyan-rgb), 0.3)',
        };
      case 'pink':
        return {
          background: 'rgba(var(--highlight-pink-rgb), 0.15)',
          color: 'var(--highlight-pink)',
          border: '1px solid rgba(var(--highlight-pink-rgb), 0.3)',
        };
      case 'featured':
        return {
          background: 'linear-gradient(135deg, var(--primary), var(--highlight-pink))',
          color: '#ffffff',
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
          fontSize: '0.7rem',
          borderRadius: 'var(--radius-sm)',
        };
      case 'lg':
        return {
          padding: '6px 14px',
          fontSize: 'var(--text-sm)',
          borderRadius: 'var(--radius-md)',
        };
      case 'md':
      default:
        return {
          padding: '4px 10px',
          fontSize: 'var(--text-xs)',
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
        fontWeight: 'var(--weight-semibold)',
        letterSpacing: '0.02em',
        lineHeight: 1,
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...style,
      }}
    >
      {Icon && <Icon size={size === 'sm' ? 11 : size === 'lg' ? 15 : 13} />}
      <span>{children}</span>
    </span>
  );
};

export default Badge;

