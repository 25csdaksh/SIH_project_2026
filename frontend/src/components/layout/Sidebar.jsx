import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  Sparkles,
  CloudSun,
  TrendingUp,
  Landmark,
  MessageSquareText,
  Bug
} from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import './layout.css';

export const Sidebar = ({ isOpen, onClose }) => {
  const { t } = useLanguage();

  const navItems = [
    { path: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { path: '/soil', label: t('nav.soilInfo'), icon: MapPin },
    { path: '/smart-krishi', label: t('nav.smartKrishi'), icon: Sparkles },
    { path: '/weather', label: t('nav.weather'), icon: CloudSun },
    { path: '/mandi', label: t('nav.mandi'), icon: TrendingUp },
    { path: '/government-schemes', label: t('nav.schemes'), icon: Landmark },
    { path: '/chatbot', label: t('nav.chatbot'), icon: MessageSquareText },
    { path: '/pest-detection', label: t('nav.pestDetection'), icon: Bug }
  ];

  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose}></div>}
      <aside className={`sidebar-container ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-menu">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <Icon size={20} className="nav-icon" />
                <span className="nav-label">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </aside>
    </>
  );
};
