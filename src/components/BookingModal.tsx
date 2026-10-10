import React, { useState, useCallback, useMemo } from 'react';
import { format, addDays, startOfToday } from 'date-fns';
import { QRCodeSVG } from 'qrcode.react';
import { X, Building2, Users, Calendar, Clock, CheckCircle, Bell } from 'lucide-react';
import type { Room, TimeSlot } from '../types';
import { TIME_SLOTS } from '../types';
import { useBookingStore, isSlotBooked, generateBookingId } from '../store';
import { scheduleNotification } from '../utils/notifications';

interface Props {
  room: Room;
  onClose: () => void;
}

function getDates(n = 7) {
  const today = startOfToday();
  return Array.from({ length: n }, (_, i) => addDays(today, i));
}

export default function BookingModal({ room, onClose }: Props) {
  const { bookings, session, addBooking, setActiveBookingPass } = useBookingStore();

  const dates = useMemo(() => getDates(7), []);
  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [step, setStep] = useState<'select' | 'confirm' | 'pass'>('select');
  const [newBooking, setNewBooking] = useState<ReturnType<typeof buildBooking> | null>(null);

  const dateStr = format(selectedDate, 'yyyy-MM-dd');

  function buildBooking(slot: TimeSlot) {
    const id = generateBookingId();
    return {
      id,
      roomId: room.id,
      roomName: room.name,
      building: room.building,
      floor: room.floor,
      date: dateStr,
      slotId: slot.id,
      slotLabel: slot.label,
      slotStart: slot.start,
      slotEnd: slot.end,
      userId: session!.id,
      userName: session!.name,
      createdAt: new Date().toISOString(),
      qrCode: JSON.stringify({ id, room: room.name, date: dateStr, slot: slot.label }),
      status: 'confirmed' as const,
    };
  }

  const handleConfirm = useCallback(() => {
    if (!selectedSlot || !session) return;
    const booking = buildBooking(selectedSlot);
    addBooking(booking);
    setNewBooking(booking);

    // Schedule notification 15 min before
    scheduleNotification(booking);
    setStep('pass');
  }, [selectedSlot, session, dateStr, room, addBooking]);

  const handleViewPass = useCallback(() => {
    if (newBooking) {
      setActiveBookingPass(newBooking);
    }
    onClose();
  }, [newBooking, setActiveBookingPass, onClose]);

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <h2>{step === 'pass' ? '🎉 Booking Confirmed' : `Book ${room.name}`}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>

        <div className="modal-body">
          {/* Step indicator */}
          <div className="step-indicator">
            {['select', 'confirm', 'pass'].map((s, i) => (
              <React.Fragment key={s}>
                <div className={`step-dot ${step === s || (i < ['select','confirm','pass'].indexOf(step)) ? 'active' : ''}`} />
                {i < 2 && <div className="step-line" />}
              </React.Fragment>
            ))}
          </div>

          {step === 'select' && (
            <>
              <img src={room.image} alt={room.name} className="room-detail-image" />

              <div className="room-meta" style={{ marginBottom: 16 }}>
                <span className="room-meta-item"><Building2 size={14} /> Building {room.building} · Floor {room.floor}</span>
                <span className="capacity-badge"><Users size={12} /> {room.capacity} seats</span>
              </div>

              {/* Date picker */}
              <p style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text2)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <Calendar size={13} style={{ verticalAlign: 'middle', marginRight: 5 }} /> Select Date
              </p>
              <div className="date-selector" style={{ marginBottom: 20 }}>
                {dates.map(d => (
                  <button
                    key={d.toISOString()}
                    className={`date-btn ${format(d, 'yyyy-MM-dd') === dateStr ? 'active' : ''}`}
                    onClick={() => { setSelectedDate(d); setSelectedSlot(null); }}
                  >
                    <span className="date-day-name">{format(d, 'EEE')}</span>
                    <span className="date-day-num">{format(d, 'd')}</span>
                    <span className="date-month">{format(d, 'MMM')}</span>
                  </button>
                ))}
              </div>

              {/* Time slot picker */}
              <p style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text2)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <Clock size={13} style={{ verticalAlign: 'middle', marginRight: 5 }} /> Select Time Slot
              </p>
              <div className="slots-grid">
                {TIME_SLOTS.map(slot => {
                  const booked = isSlotBooked(bookings, room.id, dateStr, slot.id);
                  const active = selectedSlot?.id === slot.id;
                  return (
                    <button
                      key={slot.id}
                      className={`slot-btn ${active ? 'active' : ''}`}
                      disabled={booked}
                      onClick={() => setSelectedSlot(slot)}
                      id={`slot-${slot.id}`}
                    >
                      <span className="slot-time">{slot.label}</span>
                      {booked
                        ? <span className="slot-booked-label">🔒 Booked</span>
                        : <span className="slot-label">{active ? '✓ Selected' : 'Available'}</span>
                      }
                    </button>
                  );
                })}
              </div>

              <button
                className="btn btn-primary"
                style={{ width: '100%', marginTop: 20 }}
                disabled={!selectedSlot}
                onClick={() => setStep('confirm')}
                id="proceed-to-confirm-btn"
              >
                Proceed to Confirm →
              </button>
            </>
          )}

          {step === 'confirm' && selectedSlot && (
            <div>
              <div className="booking-pass" style={{ marginBottom: 20 }}>
                <div className="pass-header">
                  <span className="pass-logo">🏫 VKU Booking</span>
                  <span className="pass-id">PREVIEW</span>
                </div>
                <div className="pass-room-name">{room.name}</div>
                <div className="pass-details">
                  <div className="pass-detail-item">
                    <span className="pass-detail-label">Date</span>
                    <span className="pass-detail-value">{format(selectedDate, 'EEE, d MMM yyyy')}</span>
                  </div>
                  <div className="pass-detail-item">
                    <span className="pass-detail-label">Time</span>
                    <span className="pass-detail-value">{selectedSlot.label}</span>
                  </div>
                  <div className="pass-detail-item">
                    <span className="pass-detail-label">Building</span>
                    <span className="pass-detail-value">Building {room.building} · Floor {room.floor}</span>
                  </div>
                  <div className="pass-detail-item">
                    <span className="pass-detail-label">Student</span>
                    <span className="pass-detail-value">{session?.name}</span>
                  </div>
                </div>
              </div>

              <div className="notif-banner">
                <Bell size={16} style={{ color: 'var(--primary-light)', flexShrink: 0 }} />
                <span>You'll receive a browser notification 15 minutes before your booking starts.</span>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setStep('select')}>
                  ← Back
                </button>
                <button
                  id="confirm-booking-btn"
                  className="btn btn-primary"
                  style={{ flex: 2 }}
                  onClick={handleConfirm}
                >
                  <CheckCircle size={16} /> Confirm Booking
                </button>
              </div>
            </div>
          )}

          {step === 'pass' && newBooking && (
            <div>
              <div className="booking-pass">
                <div className="pass-header">
                  <span className="pass-logo">🏫 VKU Booking Pass</span>
                  <span className="pass-id">{newBooking.id}</span>
                </div>
                <div className="pass-room-name">{newBooking.roomName}</div>
                <div className="pass-details">
                  <div className="pass-detail-item">
                    <span className="pass-detail-label">Date</span>
                    <span className="pass-detail-value">{format(new Date(newBooking.date + 'T00:00:00'), 'EEE, d MMM yyyy')}</span>
                  </div>
                  <div className="pass-detail-item">
                    <span className="pass-detail-label">Time</span>
                    <span className="pass-detail-value">{newBooking.slotLabel}</span>
                  </div>
                  <div className="pass-detail-item">
                    <span className="pass-detail-label">Location</span>
                    <span className="pass-detail-value">Bldg {newBooking.building} · Floor {newBooking.floor}</span>
                  </div>
                  <div className="pass-detail-item">
                    <span className="pass-detail-label">Student</span>
                    <span className="pass-detail-value">{newBooking.userName}</span>
                  </div>
                </div>
                <div className="qr-container">
                  <QRCodeSVG value={newBooking.qrCode} size={160} />
                  <span className="qr-label">Scan at room entrance for check-in</span>
                </div>
              </div>
              <button
                id="done-booking-btn"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: 16 }}
                onClick={handleViewPass}
              >
                Done — View My Bookings
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
