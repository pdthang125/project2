import React, { useState, useCallback } from 'react';
import { format, parse } from 'date-fns';
import { QRCodeSVG } from 'qrcode.react';
import { X, Ticket, CalendarX, Clock, Building2 } from 'lucide-react';
import { useBookingStore } from '../store';
import { formatBookingDateTime } from '../utils/notifications';

export default function MyBookingsPage() {
  const { bookings, cancelBooking, session, activeBookingPass, setActiveBookingPass } = useBookingStore();
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'cancelled'>('all');

  const myBookings = bookings
    .filter(b => b.userId === session?.id)
    .filter(b => filter === 'all' || b.status === filter)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleCancel = useCallback((id: string) => {
    if (window.confirm('Cancel this booking?')) {
      cancelBooking(id);
    }
  }, [cancelBooking]);

  return (
    <div style={{ padding: '32px 0 64px' }}>
      <div className="container">
        <div className="section-header" style={{ marginBottom: 28 }}>
          <h1>My Bookings</h1>
          <div className="chip-group">
            {(['all', 'confirmed', 'cancelled'] as const).map(f => (
              <button
                key={f}
                id={`booking-filter-${f}`}
                className={`chip ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {myBookings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h3>No bookings yet</h3>
            <p style={{ marginTop: 8, fontSize: '0.9rem' }}>
              {filter !== 'all' ? 'No bookings with this status.' : 'Go to Home to book your first room!'}
            </p>
          </div>
        ) : (
          <div className="booking-list">
            {myBookings.map(b => (
              <div key={b.id} className="booking-item">
                <div className="booking-item-left">
                  <div className="booking-room-icon">🏫</div>
                  <div className="booking-info">
                    <div className="booking-room-name">{b.roomName}</div>
                    <div className="booking-meta-row">
                      <span className="booking-meta-text">
                        <Building2 size={12} style={{ verticalAlign: 'middle', marginRight: 3 }} />
                        Bldg {b.building} · Floor {b.floor}
                      </span>
                      <span className="booking-meta-text">
                        <Clock size={12} style={{ verticalAlign: 'middle', marginRight: 3 }} />
                        {formatBookingDateTime(b)}
                      </span>
                    </div>
                    <div className="booking-meta-row" style={{ marginTop: 4 }}>
                      <span
                        className={`booking-status status-${b.status}`}
                        style={{ fontFamily: 'monospace', letterSpacing: '0.05em' }}
                      >
                        {b.id}
                      </span>
                      <span className={`booking-status status-${b.status}`}>
                        {b.status === 'confirmed' ? '🟢' : b.status === 'cancelled' ? '🔴' : '⚪'}
                        {' '}{b.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  {b.status === 'confirmed' && (
                    <>
                      <button
                        id={`view-pass-${b.id}`}
                        className="btn btn-outline btn-sm"
                        onClick={() => setActiveBookingPass(b)}
                      >
                        <Ticket size={14} /> Pass
                      </button>
                      <button
                        id={`cancel-booking-${b.id}`}
                        className="btn btn-danger btn-sm"
                        onClick={() => handleCancel(b.id)}
                      >
                        <CalendarX size={14} /> Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* QR Pass Modal */}
      {activeBookingPass && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setActiveBookingPass(null)}>
          <div className="modal-box">
            <div className="modal-header">
              <h2>🎫 Booking Pass</h2>
              <button className="modal-close" onClick={() => setActiveBookingPass(null)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="booking-pass">
                <div className="pass-header">
                  <span className="pass-logo">🏫 VKU Study Room</span>
                  <span className="pass-id">{activeBookingPass.id}</span>
                </div>
                <div className="pass-room-name">{activeBookingPass.roomName}</div>
                <div className="pass-details">
                  <div className="pass-detail-item">
                    <span className="pass-detail-label">Date</span>
                    <span className="pass-detail-value">
                      {format(parse(activeBookingPass.date, 'yyyy-MM-dd', new Date()), 'EEE, d MMM yyyy')}
                    </span>
                  </div>
                  <div className="pass-detail-item">
                    <span className="pass-detail-label">Time</span>
                    <span className="pass-detail-value">{activeBookingPass.slotLabel}</span>
                  </div>
                  <div className="pass-detail-item">
                    <span className="pass-detail-label">Location</span>
                    <span className="pass-detail-value">
                      Bldg {activeBookingPass.building} · Floor {activeBookingPass.floor}
                    </span>
                  </div>
                  <div className="pass-detail-item">
                    <span className="pass-detail-label">Student</span>
                    <span className="pass-detail-value">{activeBookingPass.userName}</span>
                  </div>
                </div>
                <div className="qr-container">
                  <QRCodeSVG value={activeBookingPass.qrCode} size={180} />
                  <span className="qr-label">Scan at room entrance for check-in</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
