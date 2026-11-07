import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Ticket,
  Users,
  CreditCard,
  QrCode,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '../common/Button';
import { useAuth } from '../../hooks/useAuth';
import { registrationService } from '../../services/registrationService';

export const RegistrationModal = ({ event, isOpen, onClose, onRegistered }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: details, 2: team (if applicable), 3: payment (if paid), 4: success
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successData, setSuccessData] = useState(null);
  const [countdown, setCountdown] = useState(2);

  // Form Fields
  const [formData, setFormData] = useState({
    participantName: '',
    participantEmail: '',
    participantPhone: '',
    studentId: '',
    department: '',
    registrationType: 'individual',
    teamName: '',
    teamMembers: [],
  });

  // Pre-fill user data only when modal opens (do not reset if parent updates event props)
  useEffect(() => {
    if (isOpen) {
      if (user) {
        setFormData({
          participantName: user.fullName || '',
          participantEmail: user.email || '',
          participantPhone: user.phone || '+91 98765 00000',
          studentId: user.studentId || 'STU-2026-089',
          department: user.department || 'Computer Science & Engineering',
          registrationType: 'individual',
          teamName: '',
          teamMembers: [],
        });
      }
      setStep(1);
      setLoading(false);
      setIsSubmitting(false);
      setErrorMessage('');
      setSuccessData(null);
      setCountdown(2);
    }
  }, [isOpen]);

  // Automatic 2-second modal closure after confirmed registration
  useEffect(() => {
    let timer = null;
    if (step === 4 && successData) {
      setCountdown(2);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [step, successData, onClose]);

  if (!isOpen || !event) return null;

  const isPaid = (event.registrationFee || 0) > 0;
  const teamAllowed = event.teamPolicy?.allowed || false;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    setErrorMessage('');
    // Step 1 Validation
    if (!formData.participantName.trim()) {
      return setErrorMessage('Participant name is required.');
    }
    if (!formData.participantEmail.trim() || !formData.participantEmail.includes('@')) {
      return setErrorMessage('Please enter a valid university email address.');
    }
    if (!formData.participantPhone.trim()) {
      return setErrorMessage('Contact phone number is required.');
    }

    if (formData.registrationType === 'team' && teamAllowed && step === 1) {
      return setStep(2);
    }

    if (isPaid && step < 3) {
      return setStep(3);
    }

    // Submit directly if free individual
    handleSubmitRegistration();
  };

  const handleSubmitRegistration = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/events/${event.slug || event.id}` } });
      return;
    }

    // Prevent duplicate submission attempts and repeated rapid clicks
    if (loading || isSubmitting) return;

    setLoading(true);
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        eventId: event.slug || event.id || event._id,
        participantName: formData.participantName,
        participantEmail: formData.participantEmail,
        participantPhone: formData.participantPhone,
        studentId: formData.studentId,
        department: formData.department,
        registrationType: formData.registrationType,
        teamName: formData.teamName,
        teamMembers: formData.teamMembers,
        paymentReference: isPaid ? `DEMO-TXN-${Date.now().toString().slice(-7)}` : null,
        isDemoPayment: isPaid,
      };

      const res = await registrationService.register(payload);
      if (res && res.data) {
        setSuccessData(res.data);
        setStep(4);
        if (onRegistered) onRegistered(res.data);
      } else {
        throw new Error(res.message || 'Registration could not be completed.');
      }
    } catch (err) {
      // Handle duplicate registration gracefully
      if (err.response?.status === 409 || err.response?.data?.isAlreadyRegistered) {
        const existingData = err.response?.data?.data;
        if (existingData && onRegistered) {
          onRegistered(existingData);
        }
        setErrorMessage(
          err.response?.data?.message ||
            'You are already registered for this event. Your pass is ready in your dashboard.'
        );
      } else {
        const msg = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
        setErrorMessage(msg);
      }
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-4)',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'var(--bg-overlay)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      />

      {/* Modal Dialog */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '560px',
          background: 'var(--bg-secondary)',
          border: '1.5px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          zIndex: 1001,
          animation: 'fadeIn 0.2s ease-out',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: 'var(--space-5) var(--space-6)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-elevated)',
          }}
        >
          <div>
            <span
              style={{
                fontSize: '0.68rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--primary)',
                fontWeight: '700',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              Event Registration Portal
            </span>
            <h3
              style={{
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--weight-bold)',
                color: 'var(--text-primary)',
                margin: '2px 0 0',
                lineHeight: 1.25,
              }}
            >
              {step === 4 ? 'Registration Confirmed!' : event.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: 'var(--space-6)', maxHeight: '70vh', overflowY: 'auto' }}>
          {errorMessage && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--error-bg)',
                border: '1px solid var(--error)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-xs)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: 'var(--space-5)',
              }}
            >
              <AlertCircle size={16} style={{ color: 'var(--error)', flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Not Authenticated Warning */}
          {!isAuthenticated && step !== 4 && (
            <div
              style={{
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-strong)',
                marginBottom: 'var(--space-5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <div>
                <p style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>
                  Authentication Required
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                  Sign in with your student account to register and receive your digital pass.
                </p>
              </div>
              <Button
                size="sm"
                variant="primary"
                onClick={() => navigate('/login', { state: { from: `/events/${event.slug || event.id}` } })}
              >
                Sign In
              </Button>
            </div>
          )}

          {/* STEP 1: PARTICIPANT DETAILS */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: 'var(--text-xs)',
                    fontWeight: '600',
                    color: 'var(--text-secondary)',
                    marginBottom: '6px',
                  }}
                >
                  Full Participant Name *
                </label>
                <input
                  type="text"
                  name="participantName"
                  value={formData.participantName}
                  onChange={handleInputChange}
                  placeholder="e.g. Aarav Sharma"
                  className="gatherly-input"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: 'var(--text-sm)',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: 'var(--text-xs)',
                      fontWeight: '600',
                      color: 'var(--text-secondary)',
                      marginBottom: '6px',
                    }}
                  >
                    Campus Email *
                  </label>
                  <input
                    type="email"
                    name="participantEmail"
                    value={formData.participantEmail}
                    onChange={handleInputChange}
                    placeholder="student@campus.edu"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: 'var(--text-sm)',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: 'var(--text-xs)',
                      fontWeight: '600',
                      color: 'var(--text-secondary)',
                      marginBottom: '6px',
                    }}
                  >
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="participantPhone"
                    value={formData.participantPhone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 00000"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: 'var(--text-sm)',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: 'var(--text-xs)',
                      fontWeight: '600',
                      color: 'var(--text-secondary)',
                      marginBottom: '6px',
                    }}
                  >
                    Student Roll / ID
                  </label>
                  <input
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    placeholder="STU-2026-089"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: 'var(--text-sm)',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: 'var(--text-xs)',
                      fontWeight: '600',
                      color: 'var(--text-secondary)',
                      marginBottom: '6px',
                    }}
                  >
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="Computer Science"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: 'var(--text-sm)',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Registration Type Choice (if team allowed) */}
              {teamAllowed && (
                <div style={{ marginTop: 'var(--space-2)' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: 'var(--text-xs)',
                      fontWeight: '600',
                      color: 'var(--text-secondary)',
                      marginBottom: '8px',
                    }}
                  >
                    Participation Mode
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                    <button
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, registrationType: 'individual' }))}
                      style={{
                        padding: '12px',
                        borderRadius: 'var(--radius-md)',
                        border: formData.registrationType === 'individual' ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                        background: formData.registrationType === 'individual' ? 'var(--bg-elevated)' : 'transparent',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <p style={{ margin: 0, fontWeight: 'bold', fontSize: 'var(--text-xs)' }}>Solo / Individual</p>
                      <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: 'var(--text-muted)' }}>Single entry pass</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, registrationType: 'team' }))}
                      style={{
                        padding: '12px',
                        borderRadius: 'var(--radius-md)',
                        border: formData.registrationType === 'team' ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                        background: formData.registrationType === 'team' ? 'var(--bg-elevated)' : 'transparent',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <p style={{ margin: 0, fontWeight: 'bold', fontSize: 'var(--text-xs)' }}>Team Roster</p>
                      <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {event.teamPolicy?.minSize || 2} - {event.teamPolicy?.maxSize || 4} members
                      </p>
                    </button>
                  </div>
                </div>
              )}

              {/* Fee Notice */}
              <div
                style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-elevated)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 'var(--space-2)',
                }}
              >
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Registration Fee:</span>
                <span
                  style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: '800',
                    fontFamily: 'var(--font-mono)',
                    color: isPaid ? 'var(--primary)' : 'var(--success)',
                  }}
                >
                  {isPaid ? `₹${event.registrationFee}` : 'FREE ENTRY'}
                </span>
              </div>
            </div>
          )}

          {/* STEP 2: TEAM DETAILS (if team chosen) */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: 'var(--text-xs)',
                    fontWeight: '600',
                    color: 'var(--text-secondary)',
                    marginBottom: '6px',
                  }}
                >
                  Official Team Name *
                </label>
                <input
                  type="text"
                  name="teamName"
                  value={formData.teamName}
                  onChange={handleInputChange}
                  placeholder="e.g. CyberKnights"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: 'var(--text-sm)',
                    outline: 'none',
                  }}
                />
              </div>

              <div
                style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <p style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', margin: '0 0 6px', color: 'var(--text-primary)' }}>
                  Team Leader: {formData.participantName}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                  Additional teammates may link using your Team Pass ID after registration.
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: DEMO PAYMENT SANDBOX (if paid event) */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--bg-elevated)',
                  border: '1.5px dashed var(--primary)',
                  textAlign: 'center',
                }}
              >
                <CreditCard size={32} style={{ color: 'var(--primary)', margin: '0 auto 10px' }} />
                <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', margin: '0 0 4px', color: 'var(--text-primary)' }}>
                  Campus Payment Sandbox
                </h4>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '0 0 16px' }}>
                  This is an academic demo payment workflow. No real currency will be deducted.
                </p>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-xs)',
                    marginBottom: '8px',
                  }}
                >
                  <span style={{ color: 'var(--text-secondary)' }}>Registration Fee:</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                    ₹{event.registrationFee}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-xs)',
                  }}
                >
                  <span style={{ color: 'var(--text-secondary)' }}>Demo Reference:</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    DEMO-TXN-{Date.now().toString().slice(-7)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: REGISTRATION SUCCESS & DIGITAL PASS PREVIEW */}
          {step === 4 && successData && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', alignItems: 'center' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'var(--success-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--success)',
                  border: '1.5px solid rgba(16, 185, 129, 0.35)',
                  boxShadow: '0 0 24px rgba(16, 185, 129, 0.22)',
                }}
              >
                <CheckCircle2 size={36} />
              </div>

              <div style={{ textAlign: 'center' }}>
                <h4 style={{ fontSize: '1.35rem', fontWeight: '900', margin: 0, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                  Registration Successful!
                </h4>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.5 }}>
                  You are successfully registered for <strong>{event.title}</strong>. Your digital pass is ready.
                </p>
              </div>

              {/* Digital Pass Ticket Box */}
              <div
                style={{
                  width: '100%',
                  background: 'var(--bg-elevated)',
                  border: '1.5px solid var(--border-strong)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '16px',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: '16px',
                  alignItems: 'center',
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--primary)',
                      fontWeight: '800',
                      letterSpacing: '0.1em',
                    }}
                  >
                    OFFICIAL ADMISSION PASS
                  </span>
                  <h5 style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', margin: '4px 0 2px', color: 'var(--text-primary)' }}>
                    {successData.eventTitle}
                  </h5>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                    Attendee: {successData.participantName} ({successData.studentId || 'Student'})
                  </p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--primary)', fontFamily: 'var(--font-mono)', fontWeight: 'bold', margin: '6px 0 0' }}>
                    {successData.passId}
                  </p>
                </div>

                {/* QR Code Container */}
                <div
                  style={{
                    width: '76px',
                    height: '76px',
                    background: '#FFFFFF',
                    padding: '4px',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  dangerouslySetInnerHTML={{ __html: successData.qrSvg }}
                />
              </div>

              {/* 2-Second Auto-Close Notice */}
              <div
                style={{
                  width: '100%',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.74rem',
                  color: 'var(--text-muted)',
                }}
              >
                <span>
                  Closing automatically in <strong>{countdown}s</strong>...
                </span>
                <span style={{ color: 'var(--success)', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={13} /> Active in Passes
                </span>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)', width: '100%' }}>
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={() => {
                    onClose();
                    navigate(`/app/passes/${successData.passId || ''}`);
                  }}
                  icon={Ticket}
                >
                  View Digital Pass Now
                </Button>
                <Button variant="secondary" size="md" fullWidth onClick={onClose}>
                  Close Window
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {step < 4 && (
          <div
            style={{
              padding: 'var(--space-4) var(--space-6)',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-elevated)',
            }}
          >
            {step > 1 ? (
              <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)} disabled={loading || isSubmitting}>
                Back
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={onClose} disabled={loading || isSubmitting}>
                Cancel
              </Button>
            )}

            <Button
              variant="primary"
              size="sm"
              loading={loading}
              disabled={loading || isSubmitting}
              onClick={step === 3 || (!isPaid && step === (teamAllowed && formData.registrationType === 'team' ? 2 : 1)) ? handleSubmitRegistration : handleNextStep}
              icon={ArrowRight}
              iconPosition="right"
            >
              {loading
                ? isPaid && step === 3
                  ? 'Authorizing...'
                  : 'Registering...'
                : step === 3
                ? 'Authorize & Confirm'
                : step === 2
                ? 'Continue to Confirmation'
                : isPaid
                ? 'Continue to Payment'
                : 'Confirm Registration'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationModal;

