import React, { useState, useCallback, useMemo } from 'react';
import { Search, SlidersHorizontal, RotateCcw, Bell } from 'lucide-react';
import { ROOMS } from '../types';
import type { Building, Equipment } from '../types';
import { useBookingStore, useFilters, isSlotBooked } from '../store';
import RoomCard from '../components/RoomCard';
import BookingModal from '../components/BookingModal';
import ToastContainer from '../components/ToastContainer';

const BUILDINGS: Array<Building | 'ALL'> = ['ALL', 'A', 'B', 'C', 'V'];
const CAPACITIES = [2, 4, 6, 8, 10, 12, 16, 20];
const ALL_EQUIPMENT: Equipment[] = ['Projector', 'Whiteboard', 'High-spec PC', 'AC'];

interface Toast { id: string; message: string; type: 'success' | 'warning' | 'info'; }

export default function HomePage() {
  const { bookings, filters, setSearch, setBuilding, setCapacity, toggleEquipment, resetFilters, session } = useBookingStore();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  }, []);

  // Determine which rooms are "occupied" based on current bookings for today
  const occupiedRoomIds = useMemo(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const now = new Date();
    const hm = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    return new Set(
      bookings
        .filter(b =>
          b.date === todayStr &&
          b.status !== 'cancelled' &&
          b.slotStart <= hm && hm < b.slotEnd
        )
        .map(b => b.roomId)
    );
  }, [bookings]);

  const filteredRooms = useMemo(() => {
    return ROOMS.filter(r => {
      const q = filters.search.toLowerCase();
      if (q && !r.name.toLowerCase().includes(q) && !r.building.toLowerCase().includes(q)) return false;
      if (filters.building !== 'ALL' && r.building !== filters.building) return false;
      if (filters.capacity !== null && r.capacity < filters.capacity) return false;
      if (filters.equipment.length > 0 && !filters.equipment.every(e => r.equipment.includes(e))) return false;
      return true;
    });
  }, [filters]);

  const selectedRoom = useMemo(() => ROOMS.find(r => r.id === selectedRoomId) ?? null, [selectedRoomId]);

  const handleRoomClick = useCallback((id: string) => {
    if (!session) { addToast('Please log in to book a room', 'warning'); return; }
    setSelectedRoomId(id);
  }, [session, addToast]);

  const handleCloseModal = useCallback(() => {
    setSelectedRoomId(null);
    addToast('Booking confirmed! 🎉 Check My Bookings.', 'success');
  }, [addToast]);

  const handleNotifPermission = useCallback(() => {
    if (!('Notification' in window)) { addToast('Browser notifications not supported', 'warning'); return; }
    Notification.requestPermission().then(p => {
      if (p === 'granted') addToast('Notifications enabled! ✅', 'success');
      else addToast('Notifications blocked. Enable in browser settings.', 'warning');
    });
  }, [addToast]);

  const totalAvailable = ROOMS.length - occupiedRoomIds.size;

  return (
    <div>
      {/* Hero */}
      <section className="hero-section">
        <div className="container">
          <h1 className="hero-gradient-text">VKU Study Room Booking</h1>
          <p className="hero-subtitle">
            Reserve campus labs &amp; study rooms instantly. No door checks, no booking collisions.
          </p>
          <div className="stats-row">
            <div className="stat-item">
              <div className="stat-number">{ROOMS.length}</div>
              <div className="stat-label">Total Rooms</div>
            </div>
            <div className="stat-item">
              <div className="stat-number" style={{ color: undefined }}>{totalAvailable}</div>
              <div className="stat-label">Available Now</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{bookings.filter(b => b.status === 'confirmed').length}</div>
              <div className="stat-label">My Bookings</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">4</div>
              <div className="stat-label">Buildings</div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Notification banner */}
        <div className="notif-banner">
          <Bell size={15} style={{ color: 'var(--primary-light)', flexShrink: 0 }} />
          <span>Enable browser notifications to receive 15-minute check-in reminders.</span>
          <button className="btn btn-sm btn-outline" id="enable-notif-btn" onClick={handleNotifPermission} style={{ marginLeft: 'auto', flexShrink: 0 }}>
            Enable
          </button>
        </div>

        {/* Search + Filter */}
        <div className="filter-section">
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: showFilters ? 20 : 0 }}>
            <div className="search-bar" style={{ flex: 1 }}>
              <Search size={16} className="search-icon" />
              <input
                id="room-search"
                className="search-input"
                placeholder="Search rooms, buildings…"
                value={filters.search}
                onChange={e => setSearch(e.target.value)}
                autoComplete="off"
              />
            </div>
            <button
              id="toggle-filters-btn"
              className={`btn btn-ghost ${showFilters ? 'btn-outline' : ''}`}
              onClick={() => setShowFilters(f => !f)}
              style={{ flexShrink: 0 }}
            >
              <SlidersHorizontal size={16} /> Filters
            </button>
            {(filters.building !== 'ALL' || filters.capacity !== null || filters.equipment.length > 0) && (
              <button className="btn btn-ghost btn-sm" onClick={resetFilters}>
                <RotateCcw size={14} /> Reset
              </button>
            )}
          </div>

          {showFilters && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <p className="filter-title">Building</p>
                <div className="chip-group">
                  {BUILDINGS.map(b => (
                    <button
                      key={b}
                      id={`filter-building-${b}`}
                      className={`chip ${filters.building === b ? 'active' : ''}`}
                      onClick={() => setBuilding(b)}
                    >
                      {b === 'ALL' ? 'All Buildings' : `Building ${b}`}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="filter-title">Min. Capacity</p>
                <div className="chip-group">
                  <button
                    className={`chip ${filters.capacity === null ? 'active' : ''}`}
                    onClick={() => setCapacity(null)}
                  >Any</button>
                  {CAPACITIES.map(c => (
                    <button
                      key={c}
                      id={`filter-cap-${c}`}
                      className={`chip ${filters.capacity === c ? 'active' : ''}`}
                      onClick={() => setCapacity(c)}
                    >
                      {c}+ seats
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="filter-title">Equipment</p>
                <div className="chip-group">
                  {ALL_EQUIPMENT.map(eq => (
                    <button
                      key={eq}
                      id={`filter-eq-${eq.replace(/\s+/g, '-')}`}
                      className={`chip ${filters.equipment.includes(eq) ? 'active' : ''}`}
                      onClick={() => toggleEquipment(eq)}
                    >
                      {eq}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Room grid */}
        <div className="section-header">
          <h2>Study Rooms</h2>
          <span className="results-count">{filteredRooms.length} room{filteredRooms.length !== 1 ? 's' : ''} found</span>
        </div>

        {filteredRooms.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No rooms match your filters</h3>
            <p style={{ marginTop: 8, fontSize: '0.9rem' }}>Try adjusting your search or filters</p>
            <button className="btn btn-outline" style={{ marginTop: 16 }} onClick={resetFilters}>
              <RotateCcw size={14} /> Reset Filters
            </button>
          </div>
        ) : (
          <div className="rooms-grid" style={{ paddingBottom: 48 }}>
            {filteredRooms.map(room => (
              <RoomCard
                key={room.id}
                room={room}
                isOccupied={occupiedRoomIds.has(room.id)}
                onClick={handleRoomClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedRoom && (
        <BookingModal
          room={selectedRoom}
          onClose={() => {
            setSelectedRoomId(null);
            // Don't show confirmation toast if they closed without booking
          }}
        />
      )}

      <ToastContainer toasts={toasts} />
    </div>
  );
}
