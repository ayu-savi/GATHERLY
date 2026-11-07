import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { BrandLogo } from '../../components/common/BrandLogo';
import { authService } from '../../services/authService';
import {
  KeyRound,
  Mail,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  RotateCw,
  Eye,
  EyeOff,
  AlertCircle,
  Lock,
} from 'lucide-react';

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  // Multi-step flow: 1 = Email, 2 = OTP, 3 = New Password, 4 = Success
  const [step, setStep] = useState(1);

  // Form states
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState('');

  // Password visibility toggles
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & error handling
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);

  // Countdown timer for resend OTP cooldown
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // Step 1: Submit email to request OTP
  const handleRequestOtp = async (e) => {
    e?.preventDefault();
    if (!email.trim()) {
      setError('Please enter your campus email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await authService.forgotPassword(email.trim());
      if (res.data?.success) {
        setStep(2);
        setCooldown(res.data?.data?.cooldownSeconds || 60);
      } else {
        setError(res.data?.message || 'Could not send reset code. Please try again.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to process request';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP in Step 2
  const handleResendOtp = async () => {
    if (cooldown > 0 || loading) return;
    setLoading(true);
    setError('');

    try {
      const res = await authService.forgotPassword(email.trim());
      if (res.data?.success) {
        setCooldown(res.data?.data?.cooldownSeconds || 60);
        setOtp('');
      } else {
        setError(res.data?.message || 'Could not resend code.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to resend code';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    const cleanOtp = otp.trim();

    if (!cleanOtp) {
      setError('Please enter the 6-digit verification code');
      return;
    }
    if (cleanOtp.length !== 6 || !/^\d{6}$/.test(cleanOtp)) {
      setError('Verification code must be exactly 6 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await authService.verifyResetOtp(email.trim(), cleanOtp);
      if (res.data?.success && res.data?.data?.resetToken) {
        setResetToken(res.data.data.resetToken);
        setStep(3);
      } else {
        setError(res.data?.message || 'Invalid verification code');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Verification failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e?.preventDefault();
    setError('');

    if (!newPassword) {
      setError('Please enter your new password');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await authService.resetPassword(
        email.trim(),
        resetToken,
        newPassword,
        confirmPassword
      );
      if (res.data?.success) {
        setStep(4);
      } else {
        setError(res.data?.message || 'Could not update password');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Password reset failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 'var(--space-16) 0', flex: 1, display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '440px' }}>
        
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <BrandLogo size={52} />
            </Link>
          </div>

          <div className="editorial-eyebrow" style={{ justifyContent: 'center' }}>
            <KeyRound size={13} />
            <span>Account Security</span>
          </div>

          <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: '900', letterSpacing: '-0.02em', marginBottom: '6px' }}>
            {step === 1 && 'Reset Password'}
            {step === 2 && 'Verify Code'}
            {step === 3 && 'New Password'}
            {step === 4 && 'All Set!'}
          </h2>

          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
            {step === 1 && 'Enter your campus email to receive a 6-digit verification code.'}
            {step === 2 && `We sent a 6-digit code to ${email || 'your email'}.`}
            {step === 3 && 'Choose a secure password for your GATHERLY account.'}
            {step === 4 && 'Your password has been changed successfully.'}
          </p>
        </div>

        {/* Step Progression Indicators */}
        {step < 4 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: 'var(--space-6)' }}>
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                style={{
                  height: '4px',
                  width: num === step ? '32px' : '16px',
                  borderRadius: '2px',
                  backgroundColor: num <= step ? 'var(--primary)' : 'var(--border-subtle)',
                  transition: 'all var(--transition-normal)',
                }}
              />
            ))}
          </div>
        )}

        {/* Main Card */}
        <Card glass style={{ padding: 'var(--space-8)' }}>

          {/* Error Notice */}
          {error && (
            <div
              style={{
                marginBottom: 'var(--space-4)',
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444',
                fontSize: 'var(--text-xs)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                lineHeight: 1.4,
              }}
              role="alert"
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: Email Form */}
          {step === 1 && (
            <form onSubmit={handleRequestOtp} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <Input
                label="Registered Campus Email"
                type="email"
                placeholder="student@campus.edu"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                required
                autoFocus
              />

              <Button
                fullWidth
                variant="primary"
                size="md"
                type="submit"
                loading={loading}
                icon={Mail}
              >
                Send Verification Code
              </Button>

              <div style={{ textAlign: 'center', marginTop: 'var(--space-3)', fontSize: 'var(--text-xs)' }}>
                <Link
                  to="/login"
                  style={{
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <ArrowLeft size={13} />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}

          {/* STEP 2: OTP Verification Form */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div>
                <label
                  htmlFor="otp-input"
                  style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--weight-medium)',
                    color: 'var(--text-secondary)',
                    display: 'block',
                    marginBottom: '8px',
                    textAlign: 'center',
                  }}
                >
                  Enter 6-Digit Code
                </label>
                <input
                  id="otp-input"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="------"
                  value={otp}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setOtp(val);
                    if (error) setError('');
                  }}
                  autoFocus
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    fontSize: '1.75rem',
                    letterSpacing: '0.4em',
                    textAlign: 'center',
                    fontWeight: '700',
                    fontFamily: 'monospace',
                    background: 'var(--bg-secondary)',
                    border: '1.5px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color var(--transition-fast)',
                  }}
                />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '6px' }}>
                  Code expires in 10 minutes.
                </p>
              </div>

              <Button
                fullWidth
                variant="primary"
                size="md"
                type="submit"
                loading={loading}
                icon={ShieldCheck}
                disabled={otp.length !== 6}
              >
                Verify Code
              </Button>

              {/* Resend Cooldown Control */}
              <div style={{ textAlign: 'center', marginTop: 'var(--space-2)' }}>
                {cooldown > 0 ? (
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                    Resend code in <strong>{cooldown}s</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <RotateCw size={12} />
                    <span>Resend Verification Code</span>
                  </button>
                )}
              </div>

              <div style={{ textAlign: 'center', marginTop: 'var(--space-2)', fontSize: 'var(--text-xs)' }}>
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setError('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <ArrowLeft size={13} />
                  <span>Change email address</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Set New Password Form */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div>
                <label
                  style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--weight-medium)',
                    color: 'var(--text-secondary)',
                    display: 'block',
                    marginBottom: '6px',
                  }}
                >
                  New Password <span style={{ color: 'var(--error)' }}>*</span>
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (error) setError('');
                    }}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 42px 10px 14px',
                      background: 'var(--bg-secondary)',
                      border: '1.5px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-primary)',
                      fontSize: 'var(--text-base)',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label
                  style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--weight-medium)',
                    color: 'var(--text-secondary)',
                    display: 'block',
                    marginBottom: '6px',
                  }}
                >
                  Confirm New Password <span style={{ color: 'var(--error)' }}>*</span>
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (error) setError('');
                    }}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 42px 10px 14px',
                      background: 'var(--bg-secondary)',
                      border: '1.5px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-primary)',
                      fontSize: 'var(--text-base)',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Password Requirements Guide */}
              <div
                style={{
                  padding: 'var(--space-3)',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: newPassword.length >= 6 ? '#10b981' : 'var(--text-muted)',
                  }}
                >
                  <CheckCircle2 size={12} />
                  <span>Minimum 6 characters</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color:
                      newPassword && confirmPassword && newPassword === confirmPassword
                        ? '#10b981'
                        : 'var(--text-muted)',
                  }}
                >
                  <CheckCircle2 size={12} />
                  <span>Passwords match</span>
                </div>
              </div>

              <Button
                fullWidth
                variant="primary"
                size="md"
                type="submit"
                loading={loading}
                icon={Lock}
                disabled={newPassword.length < 6 || newPassword !== confirmPassword}
              >
                Set New Password
              </Button>
            </form>
          )}

          {/* STEP 4: Success Confirmation */}
          {step === 4 && (
            <div style={{ textAlign: 'center', padding: 'var(--space-2) 0' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '2px solid rgba(16, 185, 129, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--space-4) auto',
                  color: '#10b981',
                }}
              >
                <CheckCircle2 size={36} />
              </div>

              <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: '800', marginBottom: '8px' }}>
                Password Updated!
              </h3>
              <p
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  marginBottom: 'var(--space-6)',
                }}
              >
                Your GATHERLY campus password has been securely reset. You can now use your new password to sign in.
              </p>

              <Button
                fullWidth
                variant="primary"
                size="md"
                onClick={() => navigate('/login', { replace: true })}
                icon={ArrowRight}
              >
                Proceed to Sign In
              </Button>
            </div>
          )}

        </Card>

        {/* Footer Support Notice */}
        <div style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
          Need assistance? Contact <span style={{ color: 'var(--text-secondary)' }}>support@gatherly.campus.edu</span>
        </div>

      </div>
    </div>
  );
};

export default ForgotPasswordPage;
