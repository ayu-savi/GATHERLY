import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Building,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Save,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/common/Button';

export const ProfilePage = () => {
  const { user, updateProfile } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || 'Aarav Sharma');
  const [department, setDepartment] = useState(user?.department || 'Computer Science & Engineering');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [savedNotice, setSavedNotice] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);

  // Keep form synchronized if user profile updates
  useEffect(() => {
    if (user) {
      if (user.fullName) setFullName(user.fullName);
      if (user.department) setDepartment(user.department);
      if (user.phone) setPhone(user.phone);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError('');
    setSavedNotice(false);

    try {
      const res = await updateProfile({ fullName, department, phone });
      if (res && res.success) {
        setSavedNotice(true);
        setTimeout(() => setSavedNotice(false), 3500);
      } else {
        setSaveError(res?.message || 'Failed to save profile changes.');
      }
    } catch (err) {
      setSaveError(err.message || 'Failed to save profile changes.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '720px' }}>
      <div>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: '800', color: 'var(--text-primary)', margin: 0, fontFamily: 'var(--font-heading)' }}>
          Student Profile & Settings
        </h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
          Manage your campus student credentials and default event registration preferences.
        </p>
      </div>

      {savedNotice && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--success-bg)',
            border: '1px solid var(--success)',
            color: 'var(--success)',
            fontSize: 'var(--text-xs)',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle2 size={16} />
          <span>Profile changes saved and synchronized with university backend!</span>
        </div>
      )}

      {saveError && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--error-bg)',
            border: '1px solid var(--error)',
            color: 'var(--error)',
            fontSize: 'var(--text-xs)',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AlertCircle size={16} />
          <span>{saveError}</span>
        </div>
      )}

      {/* Profile Card */}
      <div
        style={{
          background: 'var(--bg-secondary)',
          border: '1.5px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-8)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: 'var(--space-8)', paddingBottom: 'var(--space-6)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--primary)',
              color: 'var(--text-inverse)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.6rem',
              fontWeight: '900',
              fontFamily: 'var(--font-heading)',
              flexShrink: 0,
            }}
          >
            {fullName ? fullName.charAt(0).toUpperCase() : 'S'}
          </div>

          <div>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
              {fullName}
            </h2>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: '2px 0 6px', fontFamily: 'var(--font-mono)' }}>
              {user?.email || 'student@campus.edu'}
            </p>
            <span
              style={{
                display: 'inline-block',
                padding: '2px 8px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.68rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--primary)',
                fontWeight: 'bold',
              }}
            >
              ID: {user?.studentId || 'STU-2026-089'}
            </span>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-sm)',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Department / Faculty
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-sm)',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Contact Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-sm)',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Campus Email (Verified University Address)
            </label>
            <input
              type="email"
              disabled
              value={user?.email || 'student@campus.edu'}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
                fontSize: 'var(--text-sm)',
                cursor: 'not-allowed',
              }}
            />
          </div>

          <div style={{ marginTop: 'var(--space-2)' }}>
            <Button type="submit" variant="primary" icon={Save} loading={saving} disabled={saving}>
              {saving ? 'Saving Changes...' : 'Save Profile Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;

