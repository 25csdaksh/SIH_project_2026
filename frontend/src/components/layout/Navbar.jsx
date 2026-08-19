import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Sun, Moon, Menu, User, LogOut } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import { LanguageSelector } from '../common/LanguageSelector';
import './layout.css';

export const Navbar = ({ onToggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="mobile-menu-btn" onClick={onToggleSidebar}>
          <Menu size={22} />
        </button>
        <Link to="/" className="navbar-brand">
          <Sprout size={28} className="brand-logo-icon" />
          <div className="brand-text">
            <span className="brand-title">{t('brand')}</span>
            <span className="brand-tagline">{t('tagline')}</span>
          </div>
        </Link>
      </div>

      <div className="navbar-right">
        <LanguageSelector />

        <button className="icon-btn theme-toggle-btn" onClick={toggleTheme} title="Toggle Theme">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {isAuthenticated ? (
          <div className="user-profile-menu">
            <span className="user-name">
              <User size={16} /> {user?.name || 'Farmer'}
            </span>
            <button className="logout-btn" onClick={logout} title={t('nav.logout')}>
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <div className="auth-nav-buttons">
            <Link to="/login" className="nav-link-btn btn-secondary">
              {t('nav.login')}
            </Link>
            <Link to="/register" className="nav-link-btn btn-primary">
              {t('nav.register')}
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
