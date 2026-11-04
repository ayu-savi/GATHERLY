import React from 'react';

export const Card = ({
  children,
  hoverable = false,
  glass = false,
  padding = 'md',
  className = '',
  style = {},
  onClick,
  ...props
}) => {
  const getPadding = () => {
    switch (padding) {
      case 'none':
        return 0;
      case 'sm':
        return 'var(--space-4)';
      case 'lg':
        return 'var(--space-8)';
      case 'md':
      default:
        return 'var(--space-6)';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`gatherly-card ${className}`}
      style={{
        background: glass ? 'var(--bg-glass)' : 'var(--bg-secondary)',
        backdropFilter: glass ? 'blur(14px)' : 'none',
        WebkitBackdropFilter: glass ? 'blur(14px)' : 'none',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: getPadding(),
        boxShadow: 'var(--shadow-sm)',
        transition: 'all var(--transition-base)',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (hoverable) {
          e.currentTarget.style.borderColor = 'var(--primary)';
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }
      }}
      onMouseLeave={(e) => {
        if (hoverable) {
          e.currentTarget.style.borderColor = 'var(--border-subtle)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        }
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
