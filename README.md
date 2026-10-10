🏫 VKU Study Room Booking — Mini-Project 2
Real-time campus study room reservation web app built with React + TypeScript + Zustand, deployed on Cloudflare Workers.

🎯 Project Overview
VKU students need a fast, reliable way to check real-time room availability and reserve campus computer labs and study rooms — without physical door checks or booking collisions.

This app solves that with:
- Instant room discovery with multi-parameter filters
- Conflict-preventing time-slot booking system
- QR code booking passes for check-in
- Browser push notifications 15 minutes before booking starts
- Persistent state via Zustand + localStorage

✅ Feature Checklist
- High-performance room feed (10 rooms, 4 buildings A/B/C/V)
- Room photos, building/floor info, capacity badges
- Real-time Available / Occupied status
- Instant search by name & building
- Filter chips: Building (A/B/C/V), Capacity (2–20), Equipment
- Equipment tags: Projector, Whiteboard, High-spec PC, AC
- 7-day date selector strip
- 4 discrete time slots/day (07:30–09:30, 09:30–11:30, 13:00–15:00, 15:00–17:00)
- Visual conflict prevention — booked slots disabled in real time
- Unique booking pass with interactive QR code modal
- Zustand global store (session, reservations, filters)
- localStorage persistence via Zustand persist middleware
- Browser Notification API — 15-min pre-booking reminder
- Cancel booking
- My Bookings page with filter by status
- Responsive design (mobile + desktop)
- Premium dark UI with glassmorphism

🛠 Tech Stack
- UI Framework: React 19 + TypeScript
- Build Tool: Vite 8
- State Management: Zustand (with persist middleware → localStorage)
- Routing: React Router v7
- Date Handling: date-fns
- QR Code: qrcode.react
- Icons: lucide-react
- Styling: Vanilla CSS (custom design system)
- Deployment: Cloudflare Workers

📁 Project Structure
project2/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Navbar.tsx           # Sticky nav with session & booking count badge
│   │   ├── RoomCard.tsx         # React.memo memoized room card
│   │   ├── BookingModal.tsx     # 3-step: Date picker → Slot selector → QR Pass
│   │   └── ToastContainer.tsx   # In-app toast notifications
│   ├── pages/
│   │   ├── HomePage.tsx         # Room discovery + search + filters
│   │   ├── MyBookingsPage.tsx   # Booking history + cancel + QR pass viewer
│   │   └── LoginPage.tsx        # Session login (demo + manual)
│   ├── utils/
│   │   └── notifications.ts     # Browser Notification API (15-min reminder)
│   ├── App.tsx                  # Router + protected routes
│   ├── store.ts                 # Zustand global state store
│   ├── types.ts                 # TypeScript types + rooms & slots data
│   └── index.css                # Global CSS design system
├── wrangler.jsonc               # Cloudflare Workers config
├── vite.config.ts
├── tsconfig.json
└── README.md

🚀 Quick Start
Prerequisites:
- Node.js >= 18
- npm >= 9

Install & Run:
# Clone repo
git clone https://github.com/pdthang125/Project2.git
cd Project2

# Install dependencies
npm install

# Start development server
npm run dev

Production Build:
npm run build

Deploy to Cloudflare Workers:
npx wrangler deploy

👨‍💻 Author
Phan Đình Thắng
Vietnam-Korea University of Information and Communication Technology (VKU)