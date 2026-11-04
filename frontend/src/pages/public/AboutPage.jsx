import React from 'react';
import { Sparkles, ShieldCheck, Heart, Users, Target, BookOpen } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';

export const AboutPage = () => {
  return (
    <div style={{ padding: 'var(--space-12) 0 var(--space-20)' }}>
      <div className="container-narrow">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
          <div className="editorial-eyebrow" style={{ justifyContent: 'center' }}>
            <Sparkles size={14} />
            <span>The Platform Story</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.5rem)', fontWeight: '900', letterSpacing: '-0.03em', marginBottom: 'var(--space-4)' }}>
            Empowering Campus Life Through Connected Events
          </h1>
          <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            GATHERLY is an independent semester engineering project designed to eliminate event fragmentation across university campuses.
          </p>
        </div>

        {/* Mission Card */}
        <Card glass style={{ padding: 'var(--space-8)', marginBottom: 'var(--space-8)' }}>
          <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={20} color="var(--primary)" /> Academic Mission & Problem Statement
          </h3>
          <p style={{ lineHeight: 1.7, marginBottom: 'var(--space-4)' }}>
            Campus life moves fast. Student societies host dozens of hackathons, cultural concerts, and debates every semester, yet students routinely miss registration deadlines due to scattered social media notices. GATHERLY provides a central stage with real-time discovery, verified registrations, and digital passes.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <Badge variant="primary">Full-Stack React + Express</Badge>
            <Badge variant="secondary">MongoDB Persistence</Badge>
            <Badge variant="default">WCAG AA Contrast</Badge>
          </div>
        </Card>

        {/* Core Pillars */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'var(--space-6)',
            marginBottom: 'var(--space-12)',
          }}
        >
          <Card glass style={{ padding: 'var(--space-6)' }}>
            <ShieldCheck size={24} color="var(--primary)" style={{ marginBottom: '10px' }} />
            <h4 style={{ fontSize: 'var(--text-base)', marginBottom: '6px' }}>Verified Registrations</h4>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Client and server-side validation ensuring genuine student attendance without duplications.
            </p>
          </Card>

          <Card glass style={{ padding: 'var(--space-6)' }}>
            <Users size={24} color="var(--accent-secondary)" style={{ marginBottom: '10px' }} />
            <h4 style={{ fontSize: 'var(--text-base)', marginBottom: '6px' }}>Student Society Hub</h4>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Tools for campus club presidents to broadcast schedules and monitor ticket capacities.
            </p>
          </Card>

          <Card glass style={{ padding: 'var(--space-6)' }}>
            <BookOpen size={24} color="var(--highlight)" style={{ marginBottom: '10px' }} />
            <h4 style={{ fontSize: 'var(--text-base)', marginBottom: '6px' }}>Independent Design</h4>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Custom visual identity pairing Graphite/Coral Pink with Peach/Emerald/Turquoise.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
