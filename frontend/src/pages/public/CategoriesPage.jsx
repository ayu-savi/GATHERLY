import React from 'react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Layers } from 'lucide-react';

export const CategoriesPage = () => {
  const categories = [
    'Technical', 'Cultural', 'Sports', 'Gaming',
    'Workshops', 'Management', 'Entrepreneurship', 'Arts & Entertainment'
  ];

  return (
    <div style={{ padding: 'var(--space-10) 0' }}>
      <div className="container">
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <Badge variant="primary" icon={Layers}>Campus Domains</Badge>
          <h1 style={{ marginTop: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>Event Categories</h1>
          <p>Explore activities grouped across 8 campus domains.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
          {categories.map((cat) => (
            <Card key={cat} hoverable glass>
              <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: '4px' }}>{cat}</h3>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Scheduled campus events</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;

