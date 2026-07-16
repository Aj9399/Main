# ⚡ Quick Start — Kitchen Meal Assignment

## 🏃 60-Second Local Test

```bash
# Already running? Go to http://localhost:5173
npm run dev
```

## 🧑‍💼 What to Do First

### 1. Add Customers (Customers page)
- Click **"+ Add Customer"**
- Fill: Name, Phone, Address, Preference (Veg/Non-veg/Both)
- Example: 
  - "Rajesh" → Non-veg preference
  - "Priya" → Veg preference
  - "Amit" → Both preference

### 2. Check Dishes (Dishes page)
- ✓ Pre-loaded with sample dishes
- View 3 categories: Veg (5), Non-veg (5), Mixed (3)
- Edit pricing/calories if needed
- Click "+ Add Dish" to add more

### 3. Generate Meals (Daily Assignment page)
- Set **Morning Meals**: 10-20
- Set **Evening Meals**: 5-15
- Set **Mixed Allocation %**: 20-40 (how many mixed dishes)
- Click **"🚀 Run Assignment"**
- View assignments in morning/evening tabs

### 4. Print Labels (Print Labels page)
- Choose **Morning** or **Evening** shift
- See sticker sheet (3-across grid)
- Click **"🖨️ Print this sheet"** or **"Open printable page ↗"**
- Print on thermal or A4 label stock

### 5. Check Dashboard (Dashboard page)
- See stats: customers, dishes, assignments
- View today's veg/non-veg split
- Check unassigned customers

---

## 🚀 Deploy (Pick One)

### **Vercel (Easiest)**
1. Go to [vercel.com](https://vercel.com)
2. Sign up (free)
3. Click "Add New" → "Import Project"
4. Connect GitHub → Select repo
5. Select branch: `claude/kitchen-meal-assignment-kvzu3o`
6. Click "Deploy" ✓

**Live in <1 minute!**

### **Netlify (Alternative)**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### **GitHub Pages**
See [DEPLOYMENT.md](./DEPLOYMENT.md) for full setup

---

## 💡 Key Features Explained

### Smart Assignment Logic
- **Veg customers** can only get veg dishes
- **Non-veg customers** can get any dish (veg, non-veg, or mixed)
- **Flexible customers** (Both) get random distribution
- **Mixed dishes** allocated by your daily % setting

### Print Labels
- Each sticker shows:
  - Customer name
  - Dish name
  - Calories
  - Veg/Non-veg icon (square for veg, triangle for non-veg)
  - Shift + date

### Data Storage
- Everything saved in **browser localStorage**
- Persists across sessions on same device
- No server needed for MVP
- (Future: Cloud sync via Firebase)

---

## 🔧 Common Tasks

### Test the app end-to-end
```
1. Add 5 customers (mix of veg/non-veg)
2. Run assignment: 15 morning meals, 10 evening, 30% mixed
3. View both shifts
4. Print labels
5. Check dashboard stats
```

### Add more sample data
Edit `src/utils/storage.ts` → add more customers in `initSampleData()`

### Customize colors
Edit `src/App.css` → change CSS variables (top of file)

### Change assignment logic
Edit `src/utils/assignment.ts` → modify `assignMeals()` function

---

## 📱 Mobile Testing

The app is **fully responsive**. Test on:
- Desktop (1400px) → Full sidebar + content
- Tablet (768px) → Stacked layout
- Mobile (375px) → Touch-friendly buttons

Try: Open DevTools (F12) → Toggle device toolbar

---

## ❓ Questions?

- **How do I add more veg/non-veg options?** → Customers page: set Preference dropdown
- **Can I edit dishes after creating them?** → Dishes page: Click "Edit" button
- **Where is my data stored?** → Browser localStorage (View in DevTools → Application → Local Storage)
- **Can multiple people use the same device?** → Yes, but they share the same data (future: user auth)
- **Does it work offline?** → Yes! All data is local, works offline

---

## 🎯 What's Next After MVP?

- [ ] Cloud database (Firebase/Supabase) for device sync
- [ ] User login + multi-kitchen support
- [ ] Email/SMS notifications
- [ ] Recurring weekly/monthly orders
- [ ] Inventory tracking
- [ ] Payment integration
- [ ] Mobile app (React Native)

---

## ✅ You're Ready!

1. **Local**: `npm run dev` → Test all features
2. **Deploy**: Connect to Vercel → Live URL
3. **Use**: Add customers, run assignment, print labels
4. **Scale**: Add more customers, dishes, optimize logic

**Happy shipping! 🍱**
