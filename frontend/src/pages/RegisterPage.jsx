import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Sprout } from 'lucide-react';
import { Button } from '../components/common/Button';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { useAuth } from '../hooks/useAuth';
import '../components/common/common.css';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('gu');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await register({ name, email, password, preferredLanguage });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '440px', margin: '50px auto', padding: '0 20px' }}>
      <div className="custom-card">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Sprout size={36} color="var(--primary-500)" />
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '8px' }}>Register Farmer Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Join KrishiSeva Platform</p>
        </div>

        {error && <ErrorMessage message={error} />}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>
              Full Name
            </label>
            <input
              type="text"
              className="form-select"
              style={{ width: '100%' }}
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>
              Preferred Language
            </label>
            <select
              className="form-select"
              style={{ width: '100%' }}
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value)}
            >
              <option value="gu">ગુજરાતી (Gujarati)</option>
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
            </select>
          </div>

          <Button type="submit" variant="primary" loading={loading} style={{ width: '100%', marginTop: '8px' }}>
            <UserPlus size={18} /> Register
          </Button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.85rem', marginTop: '20px', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary-500)', fontWeight: '600' }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};
