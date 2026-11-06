import React from 'react';
import {
  Trophy,
  Award,
  Medal,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Users,
  Building,
  Gift,
  ExternalLink,
  Info,
  X,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export const StudentResultModal = ({ isOpen, onClose, event }) => {
  if (!event) return null;

  const result = event.resultDetails || {};
  const hasResults = Boolean(event.hasResults);
  const resultsPublished = Boolean(event.resultsPublished);
  const retention = event.retentionInfo || {};

  const getRankBadge = (rank) => {
    if (!rank) return null;
    const lower = rank.toLowerCase();
    if (lower.includes('1st') || lower.includes('winner') || lower.includes('champion')) {
      return {
        icon: Trophy,
        label: rank,
        bg: 'rgba(245, 158, 11, 0.15)',
        color: '#D97706',
        border: 'rgba(245, 158, 11, 0.35)',
      };
    }
    if (lower.includes('2nd') || lower.includes('runner')) {
      return {
        icon: Medal,
        label: rank,
        bg: 'rgba(107, 114, 128, 0.15)',
        color: '#4B5563',
        border: 'rgba(107, 114, 128, 0.35)',
      };
    }
    if (lower.includes('3rd')) {
      return {
        icon: Award,
        label: rank,
        bg: 'rgba(180, 83, 9, 0.15)',
        color: '#B45309',
        border: 'rgba(180, 83, 9, 0.35)',
      };
    }
    return {
      icon: Award,
      label: rank,
      bg: 'var(--bg-elevated)',
      color: 'var(--primary)',
      border: 'var(--border-subtle)',
    };
  };

  const rankBadgeInfo = getRankBadge(result.rank);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Official Event Competition Results"
      maxWidth="620px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        {/* 1. Event Header Banner */}
        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-4)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <Badge variant="peach" size="sm">{event.eventCategory || 'Technical'}</Badge>
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              Pass #{event.passId || event.registrationId}
            </span>
          </div>

          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: '800', color: 'var(--text-primary)', margin: 0, lineHeight: 1.3 }}>
            {event.eventTitle}
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.75rem', color: 'var(--text-secondary)', flexWrap: 'wrap', marginTop: '2px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Calendar size={13} color="var(--primary)" />
              <span>{event.eventDate}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <MapPin size={13} color="var(--accent-secondary)" />
              <span>{event.eventVenue}</span>
            </div>
          </div>
        </div>

        {/* 2. Published Results Content */}
        {resultsPublished ? (
          <>
            {/* Standing & Position Card */}
            <div
              style={{
                background: result.isWinner
                  ? 'linear-gradient(135deg, rgba(15, 118, 110, 0.08) 0%, rgba(20, 184, 166, 0.12) 100%)'
                  : 'var(--bg-secondary)',
                border: result.isWinner ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-5)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-4)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: 'var(--radius-md)',
                      background: result.isWinner ? 'var(--primary)' : 'var(--bg-elevated)',
                      color: result.isWinner ? 'var(--text-inverse)' : 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: result.isWinner ? '0 4px 12px rgba(15, 118, 110, 0.25)' : 'none',
                    }}
                  >
                    <Trophy size={22} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                      Verified Standing
                    </span>
                    <div style={{ fontSize: 'var(--text-base)', fontWeight: '800', color: 'var(--text-primary)' }}>
                      {result.status || 'Participant'}
                    </div>
                  </div>
                </div>

                {rankBadgeInfo && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-full)',
                      background: rankBadgeInfo.bg,
                      color: rankBadgeInfo.color,
                      border: `1px solid ${rankBadgeInfo.border}`,
                      fontSize: '0.78rem',
                      fontWeight: '800',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    <rankBadgeInfo.icon size={14} />
                    {rankBadgeInfo.label}
                  </span>
                )}
              </div>

              {/* Award / Prize Description */}
              {result.prizeWon && (
                <div
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-4)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <Gift size={16} color="var(--primary)" />
                    <span style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Prize Awarded
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                    {result.prizeWon}
                  </div>
                </div>
              )}

              {/* Participant & Team Attribution */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '12px',
                  paddingTop: '4px',
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                }}
              >
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.68rem' }}>Registered Participant</span>
                  <strong style={{ color: 'var(--text-primary)' }}>{event.participantName}</strong> ({event.studentId})
                </div>
                {event.teamName && (
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.68rem' }}>Team Representation</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{event.teamName}</strong>
                  </div>
                )}
              </div>

              {/* Committee Evaluator Feedback */}
              {result.feedback && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic', borderLeft: '3px solid var(--primary)', paddingLeft: '10px' }}>
                  "{result.feedback}"
                </div>
              )}
            </div>

            {/* 3. Prize Collection Details (When Applicable) */}
            {result.prizeCollectionStatus && result.prizeCollectionStatus !== 'Not Applicable' && (
              <div
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-4)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Building size={15} color="var(--primary)" />
                    <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                      Prize Collection Status
                    </span>
                  </div>

                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      color: 'var(--success)',
                      background: 'var(--success-bg)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    <CheckCircle2 size={12} />
                    {result.prizeCollectionStatus}
                  </span>
                </div>

                {result.prizeCollectionInstructions && (
                  <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', margin: '4px 0 0', lineHeight: 1.5 }}>
                    {result.prizeCollectionInstructions}
                  </p>
                )}
              </div>
            )}

            {/* 4. Certificate Status */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--space-3) var(--space-4)',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileText size={18} color="var(--accent-secondary)" />
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {result.isWinner ? 'Official Certificate of Merit' : 'Official Certificate of Participation'}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    Verified digitally with institution credentials
                  </div>
                </div>
              </div>

              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  color: 'var(--primary)',
                  background: 'var(--bg-elevated)',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--primary)',
                }}
              >
                Issued & Verified
              </span>
            </div>

            {/* 5. 7-Day Dashboard Retention Notice */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                padding: '10px 12px',
                background: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
                lineHeight: 1.45,
              }}
            >
              <Info size={14} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Results Announcement Retention Policy:</strong> Official results were published on{' '}
                {new Date(event.resultsAnnouncementDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.
                {retention.daysRemainingInRetention !== null && (
                  <span> This event remains on your active dashboard for <strong>{retention.daysRemainingInRetention} more days</strong> (1-week retention period).</span>
                )}
                {' '}Permanent registration records and certificate archives remain forever in <strong>My Registrations</strong>.
              </div>
            </div>
          </>
        ) : (
          /* Results Awaited View */
          <div
            style={{
              padding: 'var(--space-8) var(--space-4)',
              textAlign: 'center',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-xl)',
              border: '1.5px dashed var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <Clock size={36} color="var(--accent-secondary)" />
            <div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 4px' }}>
                Official Results Awaited
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', maxWidth: '420px', margin: 0, lineHeight: 1.5 }}>
                The organizing jury committee is currently compiling scores and verifying final standings.
                This completed event will remain prominently accessible on your dashboard until official results are published and for 7 days afterward.
              </p>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: 'var(--space-2)' }}>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default StudentResultModal;