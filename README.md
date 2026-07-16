# 🍱 Kitchen Meal Assignment System

A lightweight, free-tier cloud kitchen operations app for managing daily meal assignments with smart veg/non-veg customer matching and printable kitchen labels.

## Features

- **👥 Customer Management** — Track customers with dietary preferences, phone, address, and notes
- **🍽️ Dish Catalog** — Manage veg, non-veg, and mixed dishes with calories and pricing
- **📋 Smart Assignment Engine** — Auto-assigns meals to customers respecting dietary preferences
- **🎯 Flexible Meal Ratios** — Set mixed dish allocation percentage daily
- **🖨️ Print Labels** — Generate 3-across thermal printer stickers with veg/non-veg marks and calories
- **📊 Dashboard** — Real-time overview of assignments and customer distribution
- **📱 Mobile-Friendly** — Responsive design works on phones, tablets, laptops

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build**: Vite (lightning-fast dev & build)
- **Storage**: Browser localStorage (MVP — no backend needed)
- **Styling**: Plain CSS with custom design system
- **Deploy**: Vercel (free tier)

## Quick Start

### Local Development

```bash
npm install
npm run dev
```

Visit `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

### Deploy to Vercel

```bash
# Connect repo to Vercel, or use Vercel CLI
vercel
```

## Project Structure

```
src/
├── pages/           # React page components
│   ├── Dashboard.tsx
│   ├── Customers.tsx
│   ├── Dishes.tsx
│   ├── Assignment.tsx
│   └── Labels.tsx
├── utils/
│   ├── storage.ts      # localStorage CRUD operations
│   ├── assignment.ts   # Smart meal assignment logic
├── types.ts            # TypeScript interfaces
├── App.tsx             # Main app component
├── App.css             # Global styles
└── main.tsx            # React entry point
```

## How It Works

### 1. Set Up Customers & Dishes
- Add customers with dietary preferences (veg/non-veg/both)
- Add dishes in 3 categories: veg-only, non-veg-only, mixed

### 2. Run Daily Assignment
- Specify how many morning/evening meals to prepare
- Set the mixed-dish allocation % (e.g., 30% mixed dishes)
- System auto-assigns meals respecting customer preferences:
  - **Veg customers** → Veg-only dishes (no non-veg)
  - **Non-veg customers** → Any dish
  - **Mixed dishes** → Allocated by your daily ratio

### 3. Generate & Print Labels
- View assigned meals by shift
- Print 3-across sticker labels
- Each label shows: customer name, dish, calories, veg/non-veg mark

### 4. Dashboard
- See real-time stats: active customers, dishes, assignments
- Monitor today’s distribution by preference
- Track unassigned customers

## Data Persistence

All data is stored in **browser localStorage** — no server needed for MVP. Data persists across browser sessions but is local to each device.

**Future**: Add cloud sync (Firebase, Supabase) for multi-device support.

## Deployment

### Deploy to Vercel (Recommended)

1. Push to GitHub
2. Connect repo at [vercel.com](https://vercel.com)
3. Vercel auto-deploys on push

### Deploy to Other Hosts

The `dist/` folder (after `npm run build`) is a static site — deploy to:
- Netlify
- GitHub Pages
- Firebase Hosting
- Any static host

## Features for v2 (Future)

- [ ] Cloud database (Firebase/Supabase) for multi-device sync
- [ ] User authentication & multi-kitchen support
- [ ] Email/SMS order summaries
- [ ] Subscription & payment tracking
- [ ] Weekly/monthly recurring orders
- [ ] Integration with POS systems
- [ ] Inventory management

## License

MIT — Feel free to fork, modify, and use for your kitchen!

---

Built for cloud kitchens. No backend. No complexity. Just ship meals. 🚀
