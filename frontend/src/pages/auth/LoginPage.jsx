import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { useAuth } from '../../hooks/useAuth';
import { LogIn, Sparkles, UserCheck, Shield } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('aarav.sharma@campus.edu');
  const [password, setPassword] = useState('gatherly123');
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/app/overview';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login({ email, password });
    if (res.success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div style={{ padding: 'var(--space-16) 0', flex: 1, display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <div className="editorial-eyebrow" style={{ justifyContent: 'center' }}>
            <Shield size={13} />
            <span>Student Authentication</span>
          </div>
          <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: '900', letterSpacing: '-0.02em', marginBottom: '6px' }}>
            Sign In to GATHERLY
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
            Access your campus passes, bookmarks & registrations
          </p>
        </div>

        <Card glass style={{ padding: 'var(--space-8)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <Input
              label="Campus Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button fullWidth variant="primary" size="md" type="submit" loading={loading} icon={LogIn}>
              Sign In to Dashboard
            </Button>
          </form>

          {/* Quick Demo Helper */}
          <div
            style={{
              marginTop: 'var(--space-6)',
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              fontSize: 'var(--text-xs)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <UserCheck size={14} color="var(--primary)" /> Demo Credentials Loaded
            </div>
            <p style={{ fontSize: '0.72rem', margin: 0, color: 'var(--text-muted)' }}>
              Click "Sign In" to immediately authenticate with verified demo student credentials.
            </p>
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: 'var(--text-xs)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Need an account? </span>
            <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
              Create Account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
