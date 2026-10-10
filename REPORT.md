# MINI-PROJECT SHORT TECHNICAL REPORT

**Course:** Cross-Platform Mobile App Development (VKU)
**Mini-Project Title:** Mini-Project 2 â€” Real-time Study Room Booking App
**Team / Student Name:** Phan Đình Thắng — 23IT.B207
**Submission Date:** 11/10/2026

---

## 1. GENERAL INFORMATION & DELIVERABLE LINKS

* **Team Members:**
  1. Phan Đình Thắng — Student ID: 23IT.B207 — Role: Adapted project — Contribution: Adaptations to be documented; original repository credited below

* **GitHub Repository:** https://github.com/pdthang125/project2
* **Original Source Repository:** https://github.com/pdthang125/project2

* **ðŸ“¦ APK:** *Not applicable â€” the submission package specifies "Cloudflare Pages, Vercel, Expo Snack / APK" as valid options. This project is submitted as a full-featured responsive web app deployed on Cloudflare Workers, which satisfies Deliverable 1 (Live Demo URL).*

---

## 2. FEATURE IMPLEMENTATION CHECKLIST

| # | Required Feature | Status | Implementation Details & Acceptance Level |
|:---:|---|:---:|---|
| 1 | Room Discovery Feed â€” photos, building/floor, capacity badges, real-time status | âœ… Complete | 10 rooms across 4 buildings (A, B, C, V). Each card shows Unsplash photo, building/floor info, capacity badge, `Available Now` / `Occupied` status computed from active bookings. Implemented as `React.memo` memoized `RoomCard` component for performance. |
| 2 | Multi-Parameter Filter â€” building, capacity, equipment chips | âœ… Complete | Instant filter by building (A/B/C/V/ALL), minimum capacity (2â€“20 seats), and equipment (Projector, Whiteboard, High-spec PC, AC). Uses `useMemo` for O(n) filtered results. Filter state managed in Zustand store. |
| 3 | Instant Search | âœ… Complete | Controlled input filters rooms by name and building in real time. `results-count` updates dynamically. |
| 4 | 7-Day Date Selector | âœ… Complete | Horizontal scrollable strip showing 7 days from today (`date-fns` + `addDays`). Active date highlighted with gradient. |
| 5 | 4 Ã— 2-hour discrete time slots | âœ… Complete | Fixed slots: 07:30â€“09:30, 09:30â€“11:30, 13:00â€“15:00, 15:00â€“17:00 per `TIME_SLOTS` constant in `types.ts`. |
| 6 | Visual conflict prevention â€” already-booked slots disabled | âœ… Complete | `isSlotBooked()` checks Zustand `bookings[]` for matching `roomId + date + slotId` with `status !== 'cancelled'`. Booked slots rendered with `disabled` attribute and "ðŸ”’ Booked" label. |
| 7 | Unique booking pass with interactive QR check-in modal | âœ… Complete | `generateBookingId()` produces `BK` + base-36 timestamp + random suffix. `qrcode.react`'s `QRCodeSVG` encodes booking JSON. 3-step modal: Date â†’ Slot â†’ Pass. |
| 8 | Zustand global store â€” session, reservations, cancellation | âœ… Complete | `useBookingStore` manages: `session`, `bookings[]`, `filters`, `activeBookingPass`. `addBooking`, `cancelBooking`, `setSession`, `clearSession` actions. |
| 9 | LocalStorage persistence | âœ… Complete | Zustand `persist` middleware with `localStorage` adapter persists `session` and `bookings[]` across page reloads. Key: `vku-booking-store`. |
| 10 | Local Notifications â€” 15-minute pre-booking reminder | âœ… Complete | `scheduleNotification()` in `utils/notifications.ts` uses the Web Notifications API. Requests permission, calculates `delay = slotStart - 15min - now`, fires `new Notification(...)` via `setTimeout`. |

---

## 3. TECHNICAL ARCHITECTURE & PROJECT STRUCTURE

### 3.1 Directory Structure

```
src/
â”œâ”€â”€ components/          # Reusable UI components
â”‚   â”œâ”€â”€ Navbar.tsx       # Sticky nav, session display, booking count badge
â”‚   â”œâ”€â”€ RoomCard.tsx     # React.memo memoized room card
â”‚   â”œâ”€â”€ BookingModal.tsx # 3-step booking flow (Date â†’ Slot â†’ QR Pass)
â”‚   â””â”€â”€ ToastContainer.tsx
â”œâ”€â”€ pages/               # Route-level page components
â”‚   â”œâ”€â”€ HomePage.tsx     # Room discovery, search, filters, grid
â”‚   â”œâ”€â”€ MyBookingsPage.tsx # Booking history, cancel, QR viewer
â”‚   â””â”€â”€ LoginPage.tsx    # Demo users + manual login
â”œâ”€â”€ utils/
â”‚   â””â”€â”€ notifications.ts # Browser Notification API wrapper
â”œâ”€â”€ App.tsx              # React Router + ProtectedRoute
â”œâ”€â”€ store.ts             # Zustand store (global state + persist)
â”œâ”€â”€ types.ts             # TypeScript interfaces + static room data
â””â”€â”€ index.css            # CSS design system
```

### 3.2 State Management Flow (Zustand)

```
useBookingStore (Zustand + localStorage persist)
â”‚
â”œâ”€â”€ session: UserSession | null
â”‚   â””â”€â”€ setSession() / clearSession()
â”‚
â”œâ”€â”€ bookings: Booking[]
â”‚   â”œâ”€â”€ addBooking()  â†’ triggers scheduleNotification()
â”‚   â””â”€â”€ cancelBooking() â†’ sets status = 'cancelled' (soft delete)
â”‚
â”œâ”€â”€ filters: FilterState
â”‚   â””â”€â”€ setSearch() / setBuilding() / setCapacity() / toggleEquipment()
â”‚
â””â”€â”€ activeBookingPass: Booking | null
    â””â”€â”€ setActiveBookingPass() â†’ opens QR modal
```

### 3.3 Booking Conflict Engine

```typescript
isSlotBooked(bookings, roomId, date, slotId):
  â†’ bookings.some(b =>
       b.roomId === roomId &&
       b.date   === date   &&
       b.slotId === slotId &&
       b.status !== 'cancelled'
    )
```

### 3.4 Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| UI | React 19 + TypeScript | Component model, type safety |
| State | Zustand + persist middleware | Minimal boilerplate, localStorage built-in |
| Routing | React Router v7 | Client-side SPA routing |
| Build | Vite 8 | Fast HMR, optimized production bundle |
| Dates | date-fns | Lightweight, tree-shakeable |
| QR | qrcode.react | Simple SVG QR generation |
| Styling | Vanilla CSS | Full control, no runtime overhead |
| Deploy | Cloudflare Workers | Global edge, SPA routing via `not_found_handling` |

---

## 4. EMPIRICAL EVIDENCE & SCREENSHOTS

### Screen 1 â€” Login Page (`/login`)
- 3 demo quick-login users with one-click access
- Manual login form (Name, Email, Student ID)
- Dark glassmorphism card, gradient brand icon

### Screen 2 â€” Home Page (`/`)
- Hero section: live stats (Total Rooms, Available Now, My Bookings, Buildings)
- Notification enable banner (Browser Notifications API)
- Search bar + expandable filter panel (Building / Capacity / Equipment chips)
- 10-room responsive CSS Grid (`auto-fill minmax(290px, 1fr)`)
- Cards: Unsplash room photo, Available/Occupied badge (pulsing dot animation), metadata, equipment tags

### Screen 3 â€” Booking Modal (3 Steps)
- **Step 1:** Room photo, 7-day date selector strip, 4 time-slot buttons (disabled+red when booked)
- **Step 2:** Booking preview pass card, notification info, Confirm button
- **Step 3:** Full Booking Pass â€” booking ID, all details, 180Ã—180 px QR code SVG

### Screen 4 â€” My Bookings Page (`/bookings`)
- Status filter chips (All / Confirmed / Cancelled)
- Booking list: room icon, name, date+slot, booking ID, status badge
- "Pass" â†’ QR modal; "Cancel" â†’ soft-cancel with confirmation dialog

---

## 5. TECHNICAL CHALLENGES & RESOLUTIONS

### Challenge 1 â€” Cloudflare Workers `_redirects` infinite loop (Error 100324)

**Problem:** During deployment, Wrangler rejected the `public/_redirects` file (`/* /index.html 200`) with error `code: 100324 â€” Infinite loop detected`. The new Cloudflare Workers static asset handler conflicts with the `_redirects` SPA rule.

**Resolution:** Removed `_redirects` entirely. The `wrangler.jsonc` config's `"assets": { "not_found_handling": "single-page-application" }` already handles all unknown routes by returning `index.html` with status 200 â€” making `_redirects` redundant and causing the conflict.

```jsonc
{
  "name": "vku-study-room",
  "assets": { "not_found_handling": "single-page-application" }
}
```

### Challenge 2 â€” Vite scaffold `main.ts` MIME type error in browser

**Problem:** Dev server showed `Failed to load module script: Expected JavaScript-or-Wasm but got "text/html"` at `/main.ts`. The original Vite scaffold generated a non-React template with `src/main.ts`. After creating `src/main.tsx`, the browser's module cache still referenced the old `main.ts` URL.

**Resolution:** The file was already replaced correctly. The issue was **stale browser module cache**. Performing a hard-refresh (`Ctrl+Shift+R`) and clearing the Vite build cache (`Remove-Item -Recurse -Force node_modules\.vite`) before restarting dev server fully resolved the issue.

---

*Report generated: 26/09/2026 | VKU â€” Cross-Platform Mobile App Development*
