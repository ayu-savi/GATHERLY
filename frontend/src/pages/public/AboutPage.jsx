import React from 'react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Info, Sparkles } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div style={{ padding: 'var(--space-10) 0' }}>
      <div className="container-narrow">
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <Badge variant="pink" icon={Info}>About GATHERLY</Badge>
          <h1 style={{ marginTop: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>Discover. Connect. Celebrate.</h1>
          <p>The academic semester submission project engineered for campus connection.</p>
        </div>

        <Card glass style={{ marginBottom: 'var(--space-6)' }}>
          <h3 style={{ marginBottom: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="var(--primary)" /> Academic Mission
          </h3>
          <p style={{ lineHeight: 1.7, marginBottom: 'var(--space-4)' }}>
            GATHERLY bridges the gap between campus event organizers and enthusiastic students. By combining real-time discovery, verified registrations, and personalized student dashboards, GATHERLY provides a modern digital campus life experience.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default AboutPage;

