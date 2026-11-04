import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className = '',
  style = {},
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          background: 'var(--bg-elevated)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-subtle)',
        };
      case 'outline':
        return {
          background: 'transparent',
          color: 'var(--text-primary)',
          border: '1.5px solid var(--border-strong)',
        };
      case 'ghost':
        return {
          background: 'transparent',
          color: 'var(--text-secondary)',
          border: '1px solid transparent',
        };
      case 'cyan':
        return {
          background: 'var(--accent-cyan)',
          color: '#080D1A',
          border: 'none',
          boxShadow: '0 2px 10px rgba(var(--accent-cyan-rgb), 0.3)',
        };
      case 'danger':
        return {
          background: 'var(--error)',
          color: '#ffffff',
          border: 'none',
        };
      case 'primary':
      default:
        return {
          background: 'var(--primary)',
          color: '#ffffff',
          border: 'none',
          boxShadow: '0 4px 14px rgba(var(--primary-rgb), 0.3)',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: '6px 12px',
          fontSize: 'var(--text-xs)',
          gap: '6px',
          borderRadius: 'var(--radius-sm)',
        };
      case 'lg':
        return {
          padding: '14px 28px',
          fontSize: 'var(--text-lg)',
          gap: '10px',
          borderRadius: 'var(--radius-md)',
        };
      case 'md':
      default:
        return {
          padding: '10px 20px',
          fontSize: 'var(--text-sm)',
          gap: '8px',
          borderRadius: 'var(--radius-md)',
        };
    }
  };

  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'var(--weight-semibold)',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: 'all var(--transition-fast)',
    width: fullWidth ? '100%' : 'auto',
    ...getVariantStyles(),
    ...getSizeStyles(),
    ...style,
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      style={baseStyles}
      className={`gatherly-btn ${className}`}
      {...props}
    >
      {loading ? (
        <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
        </>
      )}
    </button>
  );
};

export default Button;

