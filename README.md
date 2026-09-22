# 💸 Vaniti — Social Cash Spraying & Live Host Broadcast Platform

> An ultra-modern, high-fidelity social cash spraying experience and live venue broadcast system for celebrations, parties, concerts, and milestone events. Built with React, Vite, Leaflet, and Web Audio API.

---

## ✨ Features & Architecture

### 1. Proximity Radar Discovery & Role Gateway
- **Proximity Radar Scanner**: Sonar radar scanning the immediate perimeter for live events without requiring manual account entry or static QR codes.
- **Two Tailored Role Journeys**:
  - **Spray Money (Guest)**: Live around you feed, host verification, denomination picker, and interactive gesture spray stage.
  - **Host an Event (Celebrant / Stage)**: Event wizard with geofence radius slider (25m - 300m), settlement wallet destination, privacy controls, and venue broadcast.
- **Dual-Screen Test Mode**: Side-by-side view to test the guest mobile sprayer on the left and venue projector broadcast on the right in real time.

### 2. Interactive Mobile Sprayer Stage
- **Authentic Banknote Physics**: Full-fidelity physics engine supporting Central Bank of Nigeria ₦100, ₦200, ₦500, ₦1,000, ₦20,000 Bundles, and $100 USD notes with authentic aspect ratios, aerodynamic fluttering, and air drag.
- **Rapid-Fire Spray Gun**: Continuous hold-to-spray mechanism with high-velocity note particle ejection.
- **Live VIP Rank HUD**: Real-time ranking chip, milestone gap tracker (*"₦1,400 to overtake Rank #3"*), and glowing progress bar.
- **Slide-Over VIP Stage Leaderboard Drawer**: Interactive bottom sheet showing the Top 3 podium showcase, live rank feed, and motivation tags.
- **Celebration Receipt**: Post-spray breakdown with transaction hash, itemized denominations, performance metrics, and PDF export.

### 3. Venue Projector & Stage Broadcast Mode
- **Architectural 3D Glass Plinth Podium**: 3-tier frosted glass pedestals with internal volumetric glow, floating crowns, radiant halo avatars, and gold champion banners.
- **Real-Time Live Floor Feed**: Ticker stream of incoming sprays with denomination chips and smooth entrance animations.
- **Host Control Console**: Pause sprays (speech mode), private mode (hide totals), broadcast custom announcement toasts, and settle payouts.
- **Post-Event Analytics**: Total collected, unique donors, average spray, and denomination velocity charts.

### 4. Dynamic Light & Dark Mode
- Tokenized color system in `src/index.css`.
- Dynamic Leaflet tile swapping between CartoDB Dark (`dark_all`) and CartoDB Voyager Light (`rastertiles/voyager`) without map reinitialization.
- Synchronized across the map HUD, Vaniti modal header, and ControlPanel settings with `localStorage` persistence.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/devinkelvin/Vaniti.git

# Navigate into the project folder
cd Vaniti

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production
```bash
npm run build
```

---

## 🛠️ Technology Stack
- **Framework**: React 19 + Vite
- **Mapping**: Leaflet + CartoDB tiles
- **Icons**: Lucide React
- **Audio Engine**: Web Audio API (Synthesized pings, cash flicks, and fanfare sounds)
- **Styling**: Vanilla CSS with glassmorphic tokens and hardware-accelerated animations

---

## 📄 License
MIT © Kelvin Ekuhoho
