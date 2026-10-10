import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Booking, FilterState, UserSession, Building, Equipment } from './types';

interface BookingStore {
  // User session
  session: UserSession | null;
  setSession: (user: UserSession) => void;
  clearSession: () => void;

  // Bookings
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  cancelBooking: (bookingId: string) => void;

  // Filters
  filters: FilterState;
  setSearch: (search: string) => void;
  setBuilding: (building: Building | 'ALL') => void;
  setCapacity: (capacity: number | null) => void;
  toggleEquipment: (equipment: Equipment) => void;
  resetFilters: () => void;

  // UI state
  selectedRoomId: string | null;
  setSelectedRoomId: (id: string | null) => void;
  activeBookingPass: Booking | null;
  setActiveBookingPass: (booking: Booking | null) => void;
}

const defaultFilters: FilterState = {
  search: '',
  building: 'ALL',
  capacity: null,
  equipment: [],
};

export const useBookingStore = create<BookingStore>()(
  persist(
    (set) => ({
      session: null,
      setSession: (user) => set({ session: user }),
      clearSession: () => set({ session: null }),

      bookings: [],
      addBooking: (booking) =>
        set((state) => ({ bookings: [...state.bookings, booking] })),
      cancelBooking: (bookingId) =>
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId ? { ...b, status: 'cancelled' as const } : b
          ),
        })),

      filters: defaultFilters,
      setSearch: (search) =>
        set((state) => ({ filters: { ...state.filters, search } })),
      setBuilding: (building) =>
        set((state) => ({ filters: { ...state.filters, building } })),
      setCapacity: (capacity) =>
        set((state) => ({ filters: { ...state.filters, capacity } })),
      toggleEquipment: (equipment) =>
        set((state) => {
          const has = state.filters.equipment.includes(equipment);
          return {
            filters: {
              ...state.filters,
              equipment: has
                ? state.filters.equipment.filter((e) => e !== equipment)
                : [...state.filters.equipment, equipment],
            },
          };
        }),
      resetFilters: () => set({ filters: defaultFilters }),

      selectedRoomId: null,
      setSelectedRoomId: (id) => set({ selectedRoomId: id }),
      activeBookingPass: null,
      setActiveBookingPass: (booking) => set({ activeBookingPass: booking }),
    }),
    {
      name: 'vku-booking-store',
      partialize: (state) => ({
        session: state.session,
        bookings: state.bookings,
      }),
    }
  )
);

// Selector helpers
export const useSession = () => useBookingStore((s) => s.session);
export const useBookings = () => useBookingStore((s) => s.bookings);
export const useFilters = () => useBookingStore((s) => s.filters);

export function isSlotBooked(
  bookings: Booking[],
  roomId: string,
  date: string,
  slotId: string
): boolean {
  return bookings.some(
    (b) =>
      b.roomId === roomId &&
      b.date === date &&
      b.slotId === slotId &&
      b.status !== 'cancelled'
  );
}

export function generateBookingId(): string {
  return 'BK' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();
}
