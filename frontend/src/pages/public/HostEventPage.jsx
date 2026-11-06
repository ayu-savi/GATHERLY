import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, PlusCircle, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { HostEventModal } from '../../components/events/HostEventModal';

export const HostEventPage = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(true);

  return (
    <div style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-16)' }}>
      <div className="container" style={{ maxWidth: '860px' }}>
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: 'var(--text-xs)',
              fontWeight: '700',
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-3)',
            }}
          >
            <ArrowLeft size={14} />
            <span>Back to Campus Home</span>
          </Link>

          <div className="editorial-eyebrow">
            <ShieldCheck size={14} />
            <span>Collegiate Leadership & Organizing</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2rem, 4vw, 2.8rem)',
              fontWeight: '900',
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              lineHeight: 1.15,
              margin: '0 0 10px',
            }}
          >
            Submit an Event Proposal
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-base)', lineHeight: 1.6 }}>
            Organizing a campus hackathon, cultural show, or technical conference? Submit your society's comprehensive proposal below for university committee review and hall reservation approval.
          </p>
        </div>

        <div
          style={{
            background: 'var(--bg-secondary)',
            border: '1.5px solid var(--border-subtle)',
            borderRadius: 'var(--radius-2xl)',
            padding: 'var(--space-8)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-4)',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: 'var(--radius-xl)',
              background: 'var(--bg-elevated)',
              border: '1.5px solid var(--primary)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PlusCircle size={28} />
          </div>

          <div>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 6px' }}>
              Multi-Step Event Proposal Submission
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', maxWidth: '520px', margin: '0 auto' }}>
              Covering basic information, date & venue arrangements, committee leads, registration rules, internal budgets, prizes, and agenda schedules.
            </p>
          </div>

          <Button
            variant="primary"
            size="lg"
            icon={Sparkles}
            onClick={() => setModalOpen(true)}
          >
            Launch Proposal Form
          </Button>
        </div>

        <HostEventModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            navigate(-1);
          }}
          onSuccess={(prop) => {
            // keep open on success screen
          }}
        />
      </div>
    </div>
  );
};

export default HostEventPage;

