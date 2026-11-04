import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { useAuth } from '../../hooks/useAuth';
import { LogIn, Sparkles, UserCheck } from 'lucide-react';

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
    <div style={{ padding: 'var(--space-12) 0', flex: 1, display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <Badge variant="primary" icon={Sparkles} style={{ marginBottom: 'var(--space-3)' }}>
            Student Portal
          </Badge>
          <h2>Welcome Back</h2>
          <p>Sign in to your GATHERLY student dashboard</p>
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

            <Button fullWidth variant="primary" type="submit" loading={loading} icon={LogIn}>
              Sign In to Dashboard
            </Button>
          </form>

          {/* Quick Demo Helper */}
          <div
            style={{
              marginTop: 'var(--space-6)',
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              fontSize: 'var(--text-xs)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <UserCheck size={14} color="var(--accent-cyan)" /> Demo Credentials Ready
            </div>
            <p style={{ fontSize: '0.75rem', margin: 0, color: 'var(--text-muted)' }}>
              Clicking "Sign In" will authenticate you with pre-filled demo student credentials.
            </p>
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: 'var(--text-sm)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Don't have an account? </span>
            <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
              Sign Up
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;

