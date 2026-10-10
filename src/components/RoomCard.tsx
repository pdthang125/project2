import React, { memo, useCallback } from 'react';
import { Users, Building2, Monitor, Tv2, AirVent, PencilLine } from 'lucide-react';
import type { Room } from '../types';

const EQUIPMENT_ICONS: Record<string, React.ReactNode> = {
  'Projector': <Tv2 size={11} />,
  'Whiteboard': <PencilLine size={11} />,
  'High-spec PC': <Monitor size={11} />,
  'AC': <AirVent size={11} />,
};

interface Props {
  room: Room;
  isOccupied: boolean;
  onClick: (roomId: string) => void;
}

const RoomCard = memo(function RoomCard({ room, isOccupied, onClick }: Props) {
  const handleClick = useCallback(() => onClick(room.id), [room.id, onClick]);

  return (
    <div className="card room-card" onClick={handleClick} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && handleClick()}
      aria-label={`Book ${room.name}`}
    >
      <img
        src={room.image}
        alt={room.name}
        className="room-card-image"
        loading="lazy"
      />
      <div className="room-card-body">
        <div className="room-card-header">
          <h3 className="room-card-title">{room.name}</h3>
          <span className={`status-badge ${isOccupied ? 'status-occupied' : 'status-available'}`}>
            <span className="status-dot" />
            {isOccupied ? 'Occupied' : 'Available'}
          </span>
        </div>

        <div className="room-meta">
          <span className="room-meta-item">
            <Building2 size={13} />
            Building {room.building} · Floor {room.floor}
          </span>
          <span className="capacity-badge">
            <Users size={12} />
            {room.capacity} seats
          </span>
        </div>

        <div className="equipment-tags">
          {room.equipment.map(eq => (
            <span key={eq} className="tag tag-primary">
              {EQUIPMENT_ICONS[eq]}
              {eq}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
});

export default RoomCard;
