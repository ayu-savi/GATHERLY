import React, { forwardRef } from 'react';

export const Input = forwardRef(({
  label,
  id,
  error,
  helperText,
  icon: Icon,
  iconPosition = 'left',
  type = 'text',
  placeholder = '',
  value,
  onChange,
  disabled = false,
  required = false,
  className = '',
  style = {},
  ...props
}, ref) => {
  const generatedId = id || (label ? `input-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` : undefined);
  const errorId = error && generatedId ? `${generatedId}-error` : undefined;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', ...style }}>
      {label && (
        <label
          htmlFor={generatedId}
          style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--weight-medium)',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {label}
          {required && <span style={{ color: 'var(--error)' }} aria-hidden="true">*</span>}
        </label>
      )}

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {Icon && iconPosition === 'left' && (
          <span style={{
            position: 'absolute',
            left: '12px',
            color: error ? 'var(--error)' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'none',
          }} aria-hidden="true">
            <Icon size={18} />
          </span>
        )}

        <input
          ref={ref}
          id={generatedId}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          aria-required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className={`gatherly-input ${className}`}
          style={{
            width: '100%',
            padding: '10px 14px',
            paddingLeft: Icon && iconPosition === 'left' ? '38px' : '14px',
            paddingRight: Icon && iconPosition === 'right' ? '38px' : '14px',
            background: 'var(--bg-secondary)',
            border: `1.5px solid ${error ? 'var(--error)' : 'var(--border-subtle)'}`,
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            fontSize: 'var(--text-base)',
            transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
            outline: 'none',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = error ? 'var(--error)' : 'var(--primary)';
            e.target.style.boxShadow = `0 0 0 3px ${error ? 'var(--error-bg)' : 'var(--border-glow)'}`;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? 'var(--error)' : 'var(--border-subtle)';
            e.target.style.boxShadow = 'none';
          }}
          {...props}
        />

        {Icon && iconPosition === 'right' && (
          <span style={{
            position: 'absolute',
            right: '12px',
            color: error ? 'var(--error)' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'none',
          }}>
            <Icon size={18} />
          </span>
        )}
      </div>

      {error ? (
        <span id={errorId} role="alert" style={{ fontSize: 'var(--text-xs)', color: 'var(--error)', marginTop: '2px' }}>
          {error}
        </span>
      ) : helperText ? (
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '2px' }}>
          {helperText}
        </span>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

