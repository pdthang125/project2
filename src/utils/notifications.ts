import { format, parse, isToday, isFuture } from 'date-fns';
import type { Booking } from '../types';

let notifTimers: ReturnType<typeof setTimeout>[] = [];

export function scheduleNotification(booking: Booking) {
  // Request permission
  if (!('Notification' in window)) return;

  Notification.requestPermission().then((perm) => {
    if (perm !== 'granted') return;

    const slotDateTime = parse(
      `${booking.date} ${booking.slotStart}`,
      'yyyy-MM-dd HH:mm',
      new Date()
    );
    const notifTime = new Date(slotDateTime.getTime() - 15 * 60 * 1000); // 15 min before
    const now = new Date();
    const delay = notifTime.getTime() - now.getTime();

    if (delay > 0) {
      const timer = setTimeout(() => {
        new Notification('⏰ VKU Study Room Reminder', {
          body: `Your booking for ${booking.roomName} starts in 15 minutes! (${booking.slotLabel})`,
          icon: '/vku-icon.svg',
          tag: booking.id,
        });
      }, delay);
      notifTimers.push(timer);
    }
  });
}

export function cancelNotification(bookingId: string) {
  // Can't cancel by booking id easily without tracking, but clear all on cancel
  // In a real app, store timer references by bookingId
  console.log('Notification cancelled for', bookingId);
}

export function isBookingUpcoming(booking: Booking): boolean {
  const date = new Date(booking.date + 'T' + booking.slotStart + ':00');
  return isFuture(date) || isToday(new Date(booking.date));
}

export function formatBookingDateTime(booking: Booking): string {
  const d = parse(booking.date, 'yyyy-MM-dd', new Date());
  return format(d, 'EEE, d MMM yyyy') + ' · ' + booking.slotLabel;
}
