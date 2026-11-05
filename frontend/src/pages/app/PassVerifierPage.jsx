import React, { useState } from 'react';
import {
  ShieldCheck,
  QrCode,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Search,
  UserCheck,
  Calendar,
  MapPin,
  Clock,
  Ticket,
} from 'lucide-react';
import { passService } from '../../services/passService';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const PassVerifierPage = () => {
  const [tokenInput, setTokenInput] = useState('PASS-GATH-2026-7891');
  const [loading, setLoading] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [checkInMessage, setCheckInMessage] = useState(null);

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    if (!tokenInput.trim()) return;

    setLoading(true);
    setVerifyResult(null);
    setCheckInMessage(null);

    try {
      const isPassId = tokenInput.trim().startsWith('PASS-');
      const payload = isPassId
        ? { passId: tokenInput.trim() }
        : { qrToken: tokenInput.trim() };

      const res = await passService.verifyPass(payload);
      setVerifyResult(res);
    } catch (err) {
      setVerifyResult({
        success: false,
        valid: false,
        message: err.response?.data?.message || err.message || 'Pass verification failed.',
        reason: err.response?.data?.reason || 'ERROR',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!verifyResult?.data?.passId) return;

    setCheckInLoading(true);
    setCheckInMessage(null);
    try {
      const res = await passService.checkInPass({ passId: verifyResult.data.passId });
      setCheckInMessage({
        success: true,
        text: 'Participant admitted! Gate check-in confirmed.',
      });
      // Re-verify to update status
      await handleVerify();
    } catch (err) {
      setCheckInMessage({
        success: false,
        text: err.response?.data?.message || err.message || 'Check-in failed.',
      });
    } finally {
      setCheckInLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '780px' }}>
      {/* Header */}
      <div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 10px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-elevated)',
            fontSize: '0.68rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--primary)',
            fontWeight: '700',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}
        >
          <ShieldCheck size={14} />
          <span>Campus Security & Organizer Portal</span>
        </div>

        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: '800', color: 'var(--text-primary)', margin: 0, fontFamily: 'var(--font-heading)' }}>
          QR Gate Admission Verifier
        </h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
          Real-time cryptographic validation of student admission passes. Validates authenticity, event registration, and prevents duplicate gate entries.
        </p>
      </div>

      {/* Verification Input Box */}
      <div
        style={{
          background: 'var(--bg-secondary)',
          border: '1.5px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-6)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Enter Pass ID or Decoded QR Token:
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="e.g. PASS-GATH-2026-7891 or GATHERLY:PASS:..."
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-strong)',
                  color: 'var(--text-primary)',
                  fontSize: 'var(--text-sm)',
                  fontFamily: 'var(--font-mono)',
                  outline: 'none',
                }}
              />
              <Button type="submit" variant="primary" loading={loading} icon={Search}>
                Verify Pass
              </Button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Quick Test Pass:</span>
            <button
              type="button"
              onClick={() => {
                setTokenInput('PASS-GATH-2026-7891');
                setTimeout(() => handleVerify(), 50);
              }}
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '3px 8px',
                fontSize: '0.7rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--primary)',
                cursor: 'pointer',
              }}
            >
              PASS-GATH-2026-7891 (Aarav Sharma)
            </button>
          </div>
        </form>
      </div>

      {/* Verification Result Card */}
      {verifyResult && (
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: `1.5px solid ${verifyResult.valid ? 'var(--success)' : 'var(--error)'}`,
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-6)',
            boxShadow: 'var(--shadow-md)',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          {/* Status Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--space-5)' }}>
            {verifyResult.valid ? (
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'var(--success-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--success)',
                }}
              >
                <CheckCircle2 size={24} />
              </div>
            ) : (
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'var(--error-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--error)',
                }}
              >
                <XCircle size={24} />
              </div>
            )}

            <div>
              <h3
                style={{
                  fontSize: 'var(--text-base)',
                  fontWeight: 'bold',
                  margin: 0,
                  color: verifyResult.valid ? 'var(--success)' : 'var(--error)',
                }}
              >
                {verifyResult.valid ? 'VALID PASS — READY FOR ADMISSION' : 'PASS VERIFICATION REJECTED'}
              </h3>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                {verifyResult.message}
              </p>
            </div>
          </div>

          {/* Pass Details (if available) */}
          {verifyResult.data && (
            <div
              style={{
                padding: '16px',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '14px',
                marginBottom: 'var(--space-5)',
              }}
            >
              <div>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                  Participant Name
                </span>
                <p style={{ margin: '2px 0 0', fontWeight: 'bold', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                  {verifyResult.data.participantName}
                </p>
                {verifyResult.data.studentId && (
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ID: {verifyResult.data.studentId}</span>
                )}
              </div>

              <div>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                  Event Title
                </span>
                <p style={{ margin: '2px 0 0', fontWeight: 'bold', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                  {verifyResult.data.eventTitle}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                  Event Date
                </span>
                <p style={{ margin: '2px 0 0', fontWeight: 'bold', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                  {verifyResult.data.eventDate}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                  Pass ID
                </span>
                <p style={{ margin: '2px 0 0', fontWeight: 'bold', fontSize: 'var(--text-sm)', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                  {verifyResult.data.passId}
                </p>
              </div>
            </div>
          )}

          {/* Admission Action */}
          {verifyResult.valid && !verifyResult.alreadyCheckedIn && (
            <div>
              {checkInMessage && (
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: checkInMessage.success ? 'var(--success-bg)' : 'var(--error-bg)',
                    color: checkInMessage.success ? 'var(--success)' : 'var(--error)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'bold',
                    marginBottom: '12px',
                  }}
                >
                  {checkInMessage.text}
                </div>
              )}

              <Button
                variant="primary"
                size="md"
                fullWidth
                loading={checkInLoading}
                onClick={handleCheckIn}
                icon={UserCheck}
              >
                Admit Participant & Check In
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PassVerifierPage;

