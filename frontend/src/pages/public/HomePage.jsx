import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Server, Globe } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { eventService } from '../../services/eventService';

export const HomePage = () => {
  const [backendStatus, setBackendStatus] = useState({ checking: true, data: null, error: null });

  useEffect(() => {
    const probeBackend = async () => {
      try {
        const res = await eventService.checkHealth();
        setBackendStatus({ checking: false, data: res, error: null });
      } catch (err) {
        setBackendStatus({ checking: false, data: null, error: err.message });
      }
    };
    probeBackend();
  }, []);

  return (
    <div style={{ padding: 'var(--space-12) 0' }}>
      <div className="container">
        {/* Phase 1 Foundation Hero Banner */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto var(--space-12)' }}>
          <div style={{ display: 'inline-flex', marginBottom: 'var(--space-4)' }}>
            <Badge variant="featured" size="lg" icon={Sparkles}>
              Phase 1 &bull; Full-Stack Foundation Ready
            </Badge>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
              fontWeight: 'var(--weight-extrabold)',
              lineHeight: 1.15,
              marginBottom: 'var(--space-4)',
            }}
          >
            Discover. Connect.{' '}
            <span className="text-gradient-festive">Celebrate.</span>
          </h1>

          <p
            style={{
              fontSize: 'var(--text-lg)',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: 'var(--space-8)',
            }}
          >
            Welcome to <strong>GATHERLY</strong>, the next-generation campus event management platform.
            Explore university activities, fests, hackathons, and workshops all in one unified digital space.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--space-4)' }}>
            <Link to="/events">
              <Button size="lg" variant="primary" icon={ArrowRight} iconPosition="right">
                Explore Campus Events
              </Button>
            </Link>
            <Link to="/app/overview">
              <Button size="lg" variant="secondary">
                View Student Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Phase 1 Architecture Verification Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'var(--space-6)',
            marginBottom: 'var(--space-12)',
          }}
        >
          {/* Card 1: Design System */}
          <Card glass hoverable>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--space-3)' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(var(--primary-rgb), 0.15)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sparkles size={20} />
              </div>
              <h3 style={{ fontSize: 'var(--text-lg)' }}>Core Design System</h3>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
              Independent identity with Midnight Elegance & Soft Lavender themes. Powered by CSS tokens with zero layout shift.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <Badge variant="primary">CSS Tokens</Badge>
              <Badge variant="cyan">Dual Theme</Badge>
              <Badge variant="pink">Fluid Spacing</Badge>
            </div>
          </Card>

          {/* Card 2: Full-Stack Express Backend */}
          <Card glass hoverable>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--space-3)' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(var(--accent-cyan-rgb), 0.15)',
                  color: 'var(--accent-cyan)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Server size={20} />
              </div>
              <h3 style={{ fontSize: 'var(--text-lg)' }}>Express REST API</h3>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
              Node.js + Express backend with CORS, centralized error handling, Mongoose ODM, and health monitoring.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {backendStatus.checking ? (
                <Badge variant="warning">Checking API Health...</Badge>
              ) : backendStatus.data ? (
                <Badge variant="success" icon={CheckCircle2}>
                  API Active &bull; {backendStatus.data.status}
                </Badge>
              ) : (
                <Badge variant="warning">
                  API Standby (Run: npm run dev:backend)
                </Badge>
              )}
            </div>
          </Card>

          {/* Card 3: Modern Hybrid Navigation */}
          <Card glass hoverable>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--space-3)' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(var(--highlight-pink-rgb), 0.15)',
                  color: 'var(--highlight-pink)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Globe size={20} />
              </div>
              <h3 style={{ fontSize: 'var(--text-lg)' }}>Hybrid Navigation</h3>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
              Seamless separation between the public marketing portal and the collapsible student workspace.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <Badge variant="default">Public Navbar</Badge>
              <Badge variant="default">Collapsible Sidebar</Badge>
              <Badge variant="default">Mobile Drawer</Badge>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

