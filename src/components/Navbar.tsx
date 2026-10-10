import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BookOpen, CalendarDays, LogOut, Home } from 'lucide-react';
import { useBookingStore } from '../store';

export default function Navbar() {
  const { session, clearSession, bookings } = useBookingStore();
  const navigate = useNavigate();

  const confirmedCount = bookings.filter(
    b => b.userId === session?.id && b.status === 'confirmed'
  ).length;

  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="container navbar-inner">
        <NavLink to="/" className="navbar-brand">
          <div className="brand-icon">🏫</div>
          <span>VKU Study Room</span>
        </NavLink>

        <ul className="navbar-nav">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              end
              id="nav-home"
            >
              <Home size={16} /> Rooms
            </NavLink>
          </li>
          {session && (
            <li>
              <NavLink
                to="/bookings"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                id="nav-bookings"
              >
                <CalendarDays size={16} /> My Bookings
                {confirmedCount > 0 && (
                  <span style={{
                    background: 'var(--accent)',
                    color: '#fff',
                    borderRadius: '50%',
                    width: 18, height: 18,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                  }}>
                    {confirmedCount}
                  </span>
                )}
              </NavLink>
            </li>
          )}
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {session ? (
            <>
              <div className="user-badge">
                <div className="user-avatar">{session.name.charAt(0)}</div>
                <span>{session.name.split(' ').slice(-1)[0]}</span>
              </div>
              <button id="logout-btn" className="btn btn-ghost btn-sm" onClick={handleLogout}>
                <LogOut size={15} />
              </button>
            </>
          ) : (
            <NavLink to="/login" className="btn btn-primary btn-sm" id="nav-login">
              <BookOpen size={15} /> Sign In
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}
