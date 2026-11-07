import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { BrandLogo } from '../../components/common/BrandLogo';
import { useAuth } from '../../hooks/useAuth';
import { UserPlus, Sparkles } from 'lucide-react';

export const SignupPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    department: '',
    password: '',
  });
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await register(formData);
    if (res.success) {
      navigate('/app/overview');
    }
  };

  return (
    <div style={{ padding: 'var(--space-16) 0', flex: 1, display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '480px' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <BrandLogo size={52} />
            </Link>
          </div>
          <div className="editorial-eyebrow" style={{ justifyContent: 'center' }}>
            <Sparkles size={13} />
            <span>Campus Onboarding</span>
          </div>
          <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: '900', letterSpacing: '-0.02em', marginBottom: '6px' }}>
            Create Student Account
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
            Join the university event network in seconds
          </p>
        </div>

        <Card glass style={{ padding: 'var(--space-8)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <Input
              label="Full Name"
              type="text"
              placeholder="e.g. Aarav Sharma"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
            <Input
              label="Campus Email Address"
              type="email"
              placeholder="student@campus.edu"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label="10-Digit Mobile Number"
              type="tel"
              placeholder="9876543210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
            <Input
              label="Academic Department"
              type="text"
              placeholder="e.g. Computer Science & Engineering"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />

            <Button fullWidth variant="primary" size="md" type="submit" loading={loading} icon={UserPlus}>
              Register Student Account
            </Button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: 'var(--text-xs)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Already registered? </span>
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
              Sign In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;
