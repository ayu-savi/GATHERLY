import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
} from 'lucide-react';
import { passService } from '../../services/passService';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const PassesPage = () => {
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPasses = async () => {
    setLoading(true);
    try {
      const res = await passService.getMyPasses();
      setPasses(res.data || []);
    } catch (err) {
      setError('Could not retrieve digital passes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPasses();
  }, []);

  const handlePrint = (pass) => {
    window.print();
  };

  const handleDownloadTicket = (pass) => {
    const ticketText = `
==================================================
              GATHERLY CAMPUS PASS
            Discover. Connect. Celebrate.
==================================================
PASS ID: ${pass.passId}
REGISTRATION ID: ${pass.registrationId}
STATUS: ${pass.status.toUpperCase()}
CHECKED-IN: ${pass.checkedIn ? 'YES (Admitted)' : 'NO (Pending Entry)'}

EVENT: ${pass.eventTitle}
DATE: ${pass.eventDate}
TIME: ${pass.eventTime}
VENUE: ${pass.eventVenue}

ATTENDEE: ${pass.participantName}
EMAIL: ${pass.participantEmail}
STUDENT ID: ${pass.studentId || 'N/A'}
DEPARTMENT: ${pass.department || 'N/A'}
${pass.teamName ? `TEAM NAME: ${pass.teamName}` : 'TYPE: Individual Entry'}

QR TOKEN: ${pass.qrToken}
==================================================
Present this pass at campus gate for admission.
==================================================
    `.trim();

    const blob = new Blob([ticketText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pass.passId}_Gatherly_Ticket.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: '800', color: 'var(--text-primary)', margin: 0, fontFamily: 'var(--font-heading)' }}>
            My Digital Passes
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
            Verified electronic entry vouchers with unique encrypted QR verification tokens.
          </p>
        </div>

        <Link to="/app/pass-verifier" style={{ textDecoration: 'none' }}>
          <Button variant="secondary" size="sm" icon={ShieldCheck}>
            Test Gate Verifier
          </Button>
        </Link>
      </div>

      {error && (
        <div style={{ padding: '12px', background: 'var(--error-bg)', color: 'var(--error)', borderRadius: 'var(--radius-md)' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ padding: 'var(--space-12)', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <p>Loading your digital passes...</p>
        </div>
      ) : passes.length === 0 ? (
        <div
          style={{
            padding: 'var(--space-12)',
            borderRadius: 'var(--radius-xl)',
            background: 'var(--bg-secondary)',
            border: '1.5px dashed var(--border-subtle)',
            textAlign: 'center',
          }}
        >
          <Ticket size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>
            No Active Passes
          </h3>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '6px 0 16px' }}>
            Register for any campus event to receive an official digital entry pass.
          </p>
          <Link to="/events">
            <Button variant="primary" size="sm" icon={Compass}>
              Discover Events
            </Button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {passes.map((pass) => (
            <div
              key={pass.passId}
              style={{
                background: 'var(--bg-secondary)',
                border: '1.5px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-md)',
                overflow: 'hidden',
                display: 'grid',
                gridTemplateColumns: '1fr 220px',
                position: 'relative',
              }}
              className="digital-ticket-card"
            >
              {/* TICKET MAIN BODY */}
              <div style={{ padding: 'var(--space-6) var(--space-8)', display: 'flex', flexDirection: 'column' }}>
                {/* Header Strip */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--primary)',
                        color: 'var(--text-inverse)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '900',
                        fontSize: '0.85rem',
                      }}
                    >
                      G
                    </div>
                    <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 'bold', color: 'var(--primary)' }}>
                      GATHERLY OFFICIAL PASS
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {pass.checkedIn ? (
                      <span
                        style={{
                          padding: '3px 10px',
                          borderRadius: 'var(--radius-full)',
                          background: 'var(--success-bg)',
                          border: '1px solid var(--success)',
                          color: 'var(--success)',
                          fontSize: '0.7rem',
                          fontWeight: 'bold',
                        }}
                      >
                        ✓ Admitted at Gate
                      </span>
                    ) : (
                      <Badge variant="success">Confirmed & Valid</Badge>
                    )}
                  </div>
                </div>

                {/* Event Title */}
                <h3
                  style={{
                    fontSize: 'var(--text-lg)',
                    fontWeight: '800',
                    color: 'var(--text-primary)',
                    margin: '0 0 10px',
                    lineHeight: 1.3,
                  }}
                >
                  {pass.eventTitle}
                </h3>

                {/* Meta details */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: 'var(--space-6)' }}>
                  <div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                      Attendee Name
                    </span>
                    <strong style={{ fontSize: 'var(--text-xs)', color: 'var(--text-primary)' }}>
                      {pass.participantName}
                    </strong>
                    {pass.studentId && (
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>
                        ID: {pass.studentId}
                      </span>
                    )}
                  </div>

                  <div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                      Date & Time
                    </span>
                    <strong style={{ fontSize: 'var(--text-xs)', color: 'var(--text-primary)' }}>
                      {pass.eventDate}
                    </strong>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>
                      {pass.eventTime}
                    </span>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                      Campus Venue
                    </span>
                    <strong style={{ fontSize: 'var(--text-xs)', color: 'var(--text-primary)' }}>
                      {pass.eventVenue}
                    </strong>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                      Registration Ref
                    </span>
                    <strong style={{ fontSize: 'var(--text-xs)', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                      {pass.registrationId}
                    </strong>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'auto', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-subtle)' }}>
                  <Button variant="secondary" size="sm" icon={Printer} onClick={() => handlePrint(pass)}>
                    Print Pass
                  </Button>
                  <Button variant="ghost" size="sm" icon={Download} onClick={() => handleDownloadTicket(pass)}>
                    Download Ticket
                  </Button>
                  <Link to={`/events/${pass.eventSlug || pass.event}`} style={{ textDecoration: 'none' }}>
                    <Button variant="ghost" size="sm">
                      View Event
                    </Button>
                  </Link>
                </div>
              </div>

              {/* TICKET QR STUB (WITH PERFORATION EFFECT) */}
              <div
                style={{
                  background: 'var(--bg-elevated)',
                  borderLeft: '2px dashed var(--border-strong)',
                  padding: 'var(--space-6)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  position: 'relative',
                }}
              >
                {/* Perforation decorative semi-circles */}
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
                    width: '130px',
                    height: '130px',
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
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Scan at Admission Gate
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PassesPage;

