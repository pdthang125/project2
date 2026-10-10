export type Equipment = 'Projector' | 'Whiteboard' | 'High-spec PC' | 'AC';
export type Building = 'A' | 'B' | 'C' | 'V';
export type RoomStatus = 'available' | 'occupied' | 'maintenance';

export interface Room {
  id: string;
  name: string;
  building: Building;
  floor: number;
  capacity: number;
  equipment: Equipment[];
  image: string;
  description: string;
}

export interface TimeSlot {
  id: string;
  label: string;
  start: string; // "HH:mm"
  end: string;   // "HH:mm"
}

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  building: Building;
  floor: number;
  date: string;        // "YYYY-MM-DD"
  slotId: string;
  slotLabel: string;
  slotStart: string;
  slotEnd: string;
  userId: string;
  userName: string;
  createdAt: string;
  qrCode: string;
  status: 'confirmed' | 'cancelled' | 'completed';
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  studentId: string;
}

export interface FilterState {
  search: string;
  building: Building | 'ALL';
  capacity: number | null;
  equipment: Equipment[];
}

export const TIME_SLOTS: TimeSlot[] = [
  { id: 'slot1', label: '07:30 – 09:30', start: '07:30', end: '09:30' },
  { id: 'slot2', label: '09:30 – 11:30', start: '09:30', end: '11:30' },
  { id: 'slot3', label: '13:00 – 15:00', start: '13:00', end: '15:00' },
  { id: 'slot4', label: '15:00 – 17:00', start: '15:00', end: '17:00' },
];

export const ROOMS: Room[] = [
  {
    id: 'room-a101',
    name: 'Lab A101',
    building: 'A',
    floor: 1,
    capacity: 20,
    equipment: ['High-spec PC', 'Projector', 'AC'],
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80',
    description: 'Modern computer lab with high-spec workstations and 4K projector.',
  },
  {
    id: 'room-a201',
    name: 'Study Room A201',
    building: 'A',
    floor: 2,
    capacity: 8,
    equipment: ['Whiteboard', 'AC'],
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
    description: 'Quiet study room perfect for small groups with ample whiteboard space.',
  },
  {
    id: 'room-b101',
    name: 'Lab B101',
    building: 'B',
    floor: 1,
    capacity: 16,
    equipment: ['High-spec PC', 'Projector', 'Whiteboard', 'AC'],
    image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80',
    description: 'Fully-equipped computer lab with collaborative tools.',
  },
  {
    id: 'room-b202',
    name: 'Meeting Room B202',
    building: 'B',
    floor: 2,
    capacity: 6,
    equipment: ['Projector', 'Whiteboard', 'AC'],
    image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&q=80',
    description: 'Premium meeting room for presentations and group discussions.',
  },
  {
    id: 'room-c101',
    name: 'Innovation Lab C101',
    building: 'C',
    floor: 1,
    capacity: 12,
    equipment: ['High-spec PC', 'Projector', 'AC'],
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=80',
    description: 'Creative space for innovation and collaborative projects.',
  },
  {
    id: 'room-c301',
    name: 'Study Pod C301',
    building: 'C',
    floor: 3,
    capacity: 4,
    equipment: ['Whiteboard', 'AC'],
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80',
    description: 'Cozy pod perfect for focused individual or pair study sessions.',
  },
  {
    id: 'room-v101',
    name: 'VKU Hub V101',
    building: 'V',
    floor: 1,
    capacity: 20,
    equipment: ['High-spec PC', 'Projector', 'Whiteboard', 'AC'],
    image: 'https://images.unsplash.com/photo-1462826303086-329426d1aef5?w=600&q=80',
    description: 'Flagship hub with all amenities for large group sessions.',
  },
  {
    id: 'room-v201',
    name: 'Tech Room V201',
    building: 'V',
    floor: 2,
    capacity: 10,
    equipment: ['High-spec PC', 'AC'],
    image: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=600&q=80',
    description: 'Dedicated tech room for programming and development work.',
  },
  {
    id: 'room-a302',
    name: 'Seminar Room A302',
    building: 'A',
    floor: 3,
    capacity: 15,
    equipment: ['Projector', 'Whiteboard', 'AC'],
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80',
    description: 'Spacious seminar room ideal for presentations and lectures.',
  },
  {
    id: 'room-b301',
    name: 'Creative Lab B301',
    building: 'B',
    floor: 3,
    capacity: 8,
    equipment: ['High-spec PC', 'Whiteboard'],
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&q=80',
    description: 'Collaborative creative space for design and multimedia projects.',
  },
];
