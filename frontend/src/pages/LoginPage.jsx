import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Sprout } from 'lucide-react';
import { Button } from '../components/common/Button';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import '../components/common/common.css';

export const LoginPage = () => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '60px auto', padding: '0 20px' }}>
      <div className="custom-card">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Sprout size={36} color="var(--primary-500)" />
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '8px' }}>Farmer Login</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Access your KrishiSeva portal</p>
        </div>

        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>
              Email Address
            </label>
            <input
              type="email"
              className="form-select"
              style={{ width: '100%' }}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>
              Password
            </label>
            <input
              type="password"
              className="form-select"
              style={{ width: '100%' }}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" variant="primary" loading={loading} style={{ width: '100%', marginTop: '8px' }}>
            <LogIn size={18} /> Login
          </Button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.85rem', marginTop: '20px', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary-500)', fontWeight: '600' }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};
