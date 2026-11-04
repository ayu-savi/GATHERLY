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
      case 'accent':
      case 'turquoise':
      case 'cyan':
        return {
          background: 'var(--accent-secondary)',
          color: 'var(--text-inverse)',
          border: 'none',
          boxShadow: '0 2px 12px rgba(var(--accent-secondary-rgb), 0.28)',
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
          color: 'var(--text-inverse)',
          border: 'none',
          boxShadow: '0 3px 14px rgba(var(--primary-rgb), 0.3)',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: '6px 14px',
          fontSize: 'var(--text-xs)',
          gap: '6px',
          borderRadius: 'var(--radius-md)',
        };
      case 'lg':
        return {
          padding: '13px 26px',
          fontSize: 'var(--text-base)',
          gap: '10px',
          borderRadius: 'var(--radius-lg)',
        };
      case 'md':
      default:
        return {
          padding: '9px 18px',
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
    fontFamily: 'var(--font-heading)',
    fontWeight: 'var(--weight-bold)',
    letterSpacing: '-0.01em',
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
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.transform = 'translateY(-1px)';
          if (variant === 'secondary') {
            e.currentTarget.style.borderColor = 'var(--border-strong)';
            e.currentTarget.style.background = 'var(--bg-hover)';
          }
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.transform = 'translateY(0)';
          if (variant === 'secondary') {
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
            e.currentTarget.style.background = 'var(--bg-elevated)';
          }
        }
      }}
      {...props}
    >
      {loading ? (
        <span
          style={{
            display: 'inline-block',
            width: '16px',
            height: '16px',
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite',
          }}
        />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />}
        </>
      )}
    </button>
  );
};

export default Button;
