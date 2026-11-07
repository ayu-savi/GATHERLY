import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Ticket,
  Printer,
  Download,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Compass,
  Sparkles,
  ShieldCheck,
  ArrowLeft,
  ExternalLink,
  ChevronRight,
  User,
  Copy,
  Check,
} from 'lucide-react';
import { passService } from '../../services/passService';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { BrandLogo } from '../../components/common/BrandLogo';

export const PassesPage = () => {
  const { passId } = useParams();
  const navigate = useNavigate();

  const [passes, setPasses] = useState([]);
  const [singlePass, setSinglePass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedPassId, setCopiedPassId] = useState(null);

  const handleCopyPassId = (id) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(id);
      setCopiedPassId(id);
      setTimeout(() => setCopiedPassId(null), 2000);
    }
  };

  // Fetch single pass or full collection depending on URL param
  const loadPassData = async () => {
    setLoading(true);
    setError('');
    try {
      if (passId) {
        // Individual Event Pass Mode: fetch ONLY requested pass
        const res = await passService.getPassByPassId(passId);
        if (res && res.data) {
          setSinglePass(res.data);
        } else {
          setError('Digital pass not found or unavailable.');
        }
      } else {
        // Collection Mode: fetch all student passes
        const res = await passService.getMyPasses();
        setPasses(res.data || []);
      }
    } catch (err) {
      console.error('Error fetching digital pass:', err);
      const msg =
        err.response?.data?.message ||
        (err.response?.status === 403
          ? 'You do not have permission to access this digital pass.'
          : err.response?.status === 404
          ? 'Digital pass not found for the requested event.'
          : 'Could not retrieve digital pass.');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPassData();
  }, [passId]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTicket = (pass) => {
    if (!pass) return;
    const ticketText = `
==================================================
              GATHERLY CAMPUS PASS
            Discover. Connect. Celebrate.
==================================================
PASS ID: ${pass.passId}
REGISTRATION ID: ${pass.registrationId}
STATUS: ${(pass.status || 'confirmed').toUpperCase()}
CHECKED-IN: ${pass.checkedIn ? 'YES (Admitted at Gate)' : 'NO (Pending Entry)'}

EVENT: ${pass.eventTitle}
DATE: ${pass.eventDate}
TIME: ${pass.eventTime || 'TBA'}
VENUE: ${pass.eventVenue || 'Campus Grounds'}

ATTENDEE: ${pass.participantName}
EMAIL: ${pass.participantEmail}
STUDENT ID: ${pass.studentId || 'N/A'}
DEPARTMENT: ${pass.department || 'N/A'}
${pass.teamName ? `TEAM NAME: ${pass.teamName}` : 'TYPE: Individual Entry'}

QR TOKEN: ${pass.qrToken || 'N/A'}
==================================================
Present this pass at campus gate for admission.
==================================================
    `.trim();

    const blob = new Blob([ticketText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pass.passId}_Gatherly_Pass.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Helper to render validity badge
  const renderValidityBadge = (pass) => {
    if (pass.status === 'cancelled') {
      return (
        <span
          style={{
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--error-bg)',
            border: '1px solid var(--error)',
            color: 'var(--error)',
            fontSize: '0.7rem',
            fontWeight: '700',
          }}
        >
          Cancelled
        </span>
      );
    }

    if (pass.checkedIn) {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--success-bg)',
            border: '1px solid var(--success)',
            color: 'var(--success)',
            fontSize: '0.7rem',
            fontWeight: '700',
          }}
        >
          <CheckCircle2 size={12} />
          Admitted at Gate
        </span>
      );
    }

    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '4px 10px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--success-bg)',
          border: '1px solid var(--success)',
          color: 'var(--success)',
          fontSize: '0.7rem',
          fontWeight: '700',
        }}
      >
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'var(--success)',
            boxShadow: '0 0 6px var(--success)',
          }}
        />
        Confirmed & Valid
      </span>
    );
  };

  // Render a Single Medium-to-Large Ticket Card (50-60% desktop width, centered)
  const renderTicketCard = (pass, isSingleView = false) => {
    return (
      <div
        key={pass.passId || pass.registrationId}
        style={{
          maxWidth: '720px',
          width: '100%',
          margin: '0 auto',
          background: 'var(--bg-secondary)',
          border: '1.5px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-md)',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 220px',
          position: 'relative',
        }}
        className="single-ticket-card"
      >
        {/* TICKET MAIN BODY */}
        <div
          style={{
            padding: 'var(--space-6)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 'var(--space-4)',
          }}
        >
          {/* Header Strip: Logo + Pass Label + Status */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '8px',
              paddingBottom: 'var(--space-3)',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BrandLogo size={24} />
              <span
                style={{
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: '800',
                  color: 'var(--primary)',
                  letterSpacing: '0.04em',
                }}
              >
                GATHERLY OFFICIAL PASS
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {pass.eventCategory && (
                <span
                  style={{
                    fontSize: '0.65rem',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-elevated)',
                    color: 'var(--text-secondary)',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {pass.eventCategory}
                </span>
              )}
              {renderValidityBadge(pass)}
            </div>
          </div>

          {/* Event Title */}
          <div>
            <h2
              style={{
                fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
                fontWeight: '800',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-heading)',
                margin: '0 0 10px',
                lineHeight: 1.25,
              }}
            >
              {pass.eventTitle}
            </h2>

            {/* Event Logistics: Date, Time & Venue */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{pass.eventDate}</span>
                <span style={{ color: 'var(--text-muted)' }}>•</span>
                <Clock size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                <span>{pass.eventTime || 'Time TBA'}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} style={{ color: 'var(--accent-secondary)', flexShrink: 0 }} />
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {pass.eventVenue || 'Campus Grounds'}
                </span>
              </div>
            </div>
          </div>

          {/* Attendee & Registration Information Matrix */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '10px',
              paddingTop: 'var(--space-3)',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '0.64rem',
                  color: 'var(--text-muted)',
                  display: 'block',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.04em',
                }}
              >
                Attendee Name
              </span>
              <strong style={{ fontSize: '0.78rem', color: 'var(--text-primary)', display: 'block' }}>
                {pass.participantName}
              </strong>
              {pass.studentId && (
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  ID: {pass.studentId}
                </span>
              )}
            </div>

            <div>
              <span
                style={{
                  fontSize: '0.64rem',
                  color: 'var(--text-muted)',
                  display: 'block',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.04em',
                }}
              >
                Pass Number
              </span>
              <strong
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--primary)',
                  fontFamily: 'var(--font-mono)',
                  display: 'block',
                }}
              >
                {pass.passId}
              </strong>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Ref: {pass.registrationId}
              </span>
            </div>

            <div>
              <span
                style={{
                  fontSize: '0.64rem',
                  color: 'var(--text-muted)',
                  display: 'block',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.04em',
                }}
              >
                Entry Type
              </span>
              <strong style={{ fontSize: '0.78rem', color: 'var(--text-primary)' }}>
                {pass.teamName ? `Team: ${pass.teamName}` : 'Individual Entry'}
              </strong>
            </div>
          </div>
        </div>

        {/* TICKET QR STUB (WITH PERFORATION EFFECT) */}
        <div
          style={{
            background: 'var(--bg-elevated)',
            borderLeft: '2px dashed var(--border-strong)',
            padding: 'var(--space-5) var(--space-4)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            position: 'relative',
          }}
          className="ticket-qr-stub"
        >
          {/* Perforation semi-circles (cutouts) */}
          <div
            style={{
              position: 'absolute',
              top: '-12px',
              left: '-12px',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'var(--bg-primary)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-12px',
              left: '-12px',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'var(--bg-primary)',
            }}
          />

          {/* QR Code Container */}
          <div
            style={{
              width: '135px',
              height: '135px',
              background: '#FFFFFF',
              padding: '6px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)',
              marginBottom: '10px',
            }}
            dangerouslySetInnerHTML={{ __html: pass.qrSvg }}
          />

          <button
            type="button"
            onClick={() => handleCopyPassId(pass.passId)}
            title="Click to copy Pass ID"
            aria-label={`Copy Pass ID ${pass.passId}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '3px 8px',
              borderRadius: 'var(--radius-sm)',
              background: copiedPassId === pass.passId ? 'var(--success-bg)' : 'var(--bg-secondary)',
              border: `1px solid ${copiedPassId === pass.passId ? 'var(--success)' : 'var(--border-subtle)'}`,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            {copiedPassId === pass.passId ? (
              <>
                <Check size={11} style={{ color: 'var(--success)' }} />
                <span style={{ fontSize: '0.7rem', color: 'var(--success)', fontWeight: '700', fontFamily: 'var(--font-mono)' }}>
                  Copied!
                </span>
              </>
            ) : (
              <>
                <Copy size={11} style={{ color: 'var(--primary)' }} />
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: '800',
                    color: 'var(--primary)',
                    letterSpacing: '0.04em',
                  }}
                >
                  {pass.passId}
                </span>
              </>
            )}
          </button>
          <span
            style={{
              fontSize: '0.65rem',
              color: 'var(--text-muted)',
              marginTop: '4px',
              maxWidth: '160px',
              lineHeight: 1.25,
            }}
          >
            Present this QR code at admission gate
          </span>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
        width: '100%',
      }}
    >
      {/* Page Header Strip */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
          maxWidth: '720px',
          width: '100%',
          margin: '0 auto',
        }}
      >
        <div>
          {passId ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Link
                to="/app/registrations"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--primary)',
                  fontWeight: '700',
                }}
              >
                <ArrowLeft size={13} />
                <span>My Registrations</span>
              </Link>
              <span style={{ color: 'var(--text-muted)' }}>/</span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Digital Pass</span>
            </div>
          ) : null}

          <h1
            style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: '800',
              color: 'var(--text-primary)',
              margin: 0,
              fontFamily: 'var(--font-heading)',
              letterSpacing: '-0.02em',
            }}
          >
            {passId ? 'Digital Event Pass' : 'My Digital Passes'}
          </h1>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '3px 0 0' }}>
            {passId
              ? 'Official verified admission voucher for your registered campus event.'
              : 'Electronic entry vouchers with encrypted QR tokens.'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {passId && (
            <Link to="/app/passes" style={{ textDecoration: 'none' }}>
              <Button variant="ghost" size="sm">
                All Passes
              </Button>
            </Link>
          )}
          <Link to="/app/pass-verifier" style={{ textDecoration: 'none' }}>
            <Button variant="secondary" size="sm" icon={ShieldCheck}>
              Gate Verifier
            </Button>
          </Link>
        </div>
      </div>

      {/* ERROR STATE */}
      {error && (
        <div
          style={{
            maxWidth: '540px',
            width: '100%',
            margin: 'var(--space-8) auto',
            padding: 'var(--space-8) var(--space-6)',
            borderRadius: 'var(--radius-xl)',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <AlertCircle size={40} style={{ color: 'var(--error)', margin: '0 auto 12px' }} />
          <h2 style={{ fontSize: 'var(--text-base)', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
            Pass Not Found or Access Restricted
          </h2>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '8px 0 20px' }}>
            {error}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <Link to="/app/registrations">
              <Button variant="primary" size="sm" icon={ArrowLeft}>
                Back to Registrations
              </Button>
            </Link>
            <Link to="/events">
              <Button variant="secondary" size="sm" icon={Compass}>
                Explore Events
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* LOADING STATE */}
      {loading ? (
        <div
          style={{
            maxWidth: '720px',
            width: '100%',
            height: '240px',
            margin: '0 auto',
            borderRadius: 'var(--radius-xl)',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            animation: 'pulse 1.5s infinite',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            fontSize: 'var(--text-xs)',
          }}
        >
          Loading digital pass details...
        </div>
      ) : passId && singlePass ? (
        /* ========================================================
           INDIVIDUAL EVENT PASS VIEW (ONLY THIS SPECIFIC PASS)
           ======================================================== */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', width: '100%' }}>
          {/* Centered Medium Ticket Card */}
          {renderTicketCard(singlePass, true)}

          {/* Ticket Actions Bar (Centered under card) */}
          <div
            style={{
              maxWidth: '720px',
              width: '100%',
              margin: '0 auto',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}
          >
            <Button variant="secondary" size="sm" icon={Printer} onClick={handlePrint}>
              Print Pass
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={Download}
              onClick={() => handleDownloadTicket(singlePass)}
            >
              Download Ticket
            </Button>
            <Link
              to={`/events/${singlePass.eventSlug || singlePass.event}`}
              style={{ textDecoration: 'none' }}
            >
              <Button variant="ghost" size="sm" icon={ExternalLink}>
                View Event
              </Button>
            </Link>
            <Link to="/app/registrations" style={{ textDecoration: 'none' }}>
              <Button variant="ghost" size="sm" icon={ArrowLeft}>
                Back to Registrations
              </Button>
            </Link>
          </div>
        </div>
      ) : !passId && passes.length > 0 ? (
        /* ========================================================
           COLLECTION VIEW (When /app/passes accessed directly)
           ======================================================== */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', width: '100%' }}>
          {passes.map((p) => (
            <div
              key={p.passId || p.registrationId}
              style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}
            >
              {renderTicketCard(p, false)}
              <div
                style={{
                  maxWidth: '720px',
                  width: '100%',
                  margin: '0 auto',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '10px',
                }}
              >
                <Link to={`/app/passes/${p.passId || p.registrationId}`} style={{ textDecoration: 'none' }}>
                  <Button variant="primary" size="xs" icon={Ticket}>
                    Open Dedicated Pass View
                  </Button>
                </Link>
                <Button variant="ghost" size="xs" icon={Printer} onClick={handlePrint}>
                  Print
                </Button>
                <Button
                  variant="ghost"
                  size="xs"
                  icon={Download}
                  onClick={() => handleDownloadTicket(p)}
                >
                  Download (.txt)
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : !passId && passes.length === 0 ? (
        /* EMPTY STATE FOR COLLECTION */
        <div
          style={{
            maxWidth: '540px',
            width: '100%',
            margin: 'var(--space-8) auto',
            padding: 'var(--space-10) var(--space-6)',
            borderRadius: 'var(--radius-xl)',
            background: 'var(--bg-secondary)',
            border: '1.5px dashed var(--border-subtle)',
            textAlign: 'center',
          }}
        >
          <Ticket size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
          <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>
            No Active Passes
          </h2>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '6px 0 16px' }}>
            Register for any campus event to receive an official electronic pass.
          </p>
          <Link to="/events">
            <Button variant="primary" size="sm" icon={Compass}>
              Discover Events
            </Button>
          </Link>
        </div>
      ) : null}
    </div>
  );
};

export default PassesPage;
