import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import MyBookingsPage from './pages/MyBookingsPage';
import LoginPage from './pages/LoginPage';
import { useBookingStore } from './store';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const session = useBookingStore(s => s.session);
  return session ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <MyBookingsPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer style={{
        textAlign: 'center',
        padding: '20px',
        borderTop: '1px solid var(--border2)',
        color: 'var(--text3)',
        fontSize: '0.82rem',
      }}>
        © 2026 VKU Study Room Booking System · Vietnam-Korea University of Information and Communication Technology
      </footer>
    </div>
  );
}
