import React from 'react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Compass } from 'lucide-react';

export const ExplorePage = () => {
  return (
    <div style={{ padding: 'var(--space-10) 0' }}>
      <div className="container">
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <Badge variant="cyan" icon={Compass}>Explore Events</Badge>
          <h1 style={{ marginTop: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>Campus Event Discovery</h1>
          <p>Browse, search, and filter all university activities across campus societies.</p>
        </div>

        <Card glass>
          <div style={{ textAlign: 'center', padding: 'var(--space-8) var(--space-4)' }}>
            <Compass size={48} color="var(--accent-cyan)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ marginBottom: '8px' }}>Event Discovery Engine Prepared</h3>
            <p style={{ maxWidth: '500px', margin: '0 auto 16px' }}>
              The multi-faceted search, category filtering, and sorting architecture is staged for full integration in <strong>Phase 4</strong>.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ExplorePage;

