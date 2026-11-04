import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { HelpCircle, Home, Compass } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div style={{ padding: 'var(--space-16) 0', flex: 1, display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '500px', textAlign: 'center' }}>
        <Card glass style={{ padding: 'var(--space-10) var(--space-6)' }}>
          <Badge variant="error" icon={HelpCircle} style={{ marginBottom: 'var(--space-4)' }}>
            404 Error
          </Badge>
          <h1 style={{ fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-2)' }}>Page Not Found</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-8)' }}>
            The campus destination you're looking for doesn't exist or has moved.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            <Link to="/">
              <Button variant="primary" icon={Home}>Back to Home</Button>
            </Link>
            <Link to="/events">
              <Button variant="secondary" icon={Compass}>Explore Events</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NotFoundPage;

