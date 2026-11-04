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
        return 'var(--space-3)';
      case 'lg':
        return 'var(--space-8)';
      case 'md':
      default:
        return 'var(--space-5)';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`gatherly-card ${className}`}
      style={{
        background: glass ? 'var(--bg-glass)' : 'var(--bg-secondary)',
        backdropFilter: glass ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: glass ? 'blur(12px)' : 'none',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: getPadding(),
        boxShadow: 'var(--shadow-sm)',
        transition: 'all var(--transition-base)',
        cursor: onClick ? 'pointer' : 'default',
        ...(hoverable && {
          ':hover': {
            borderColor: 'var(--border-strong)',
            transform: 'translateY(-3px)',
            boxShadow: 'var(--shadow-md)',
          },
        }),
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;

