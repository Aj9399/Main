import { Customer, Dish, MealAssignment, DailyConfig, Brand } from '../types';

const STORAGE_KEYS = {
  customers: 'a2y:customers',
  dishes: 'a2y:dishes',
  assignments: 'a2y:assignments',
  config: 'a2y:config',
  brand: 'a2y:brand',
  seq: 'a2y:seq',
  menus: 'a2y:menus',
};

// The 3-category dish picks for a given date + shift.
export interface DayMenu { veg: string; nonveg: string; both: string }

// Collision-proof unique id (Date.now alone repeats within a millisecond).
let idCounter = 0;
function uid(prefix = ''): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return prefix + crypto.randomUUID();
  idCounter += 1;
  return prefix + Date.now().toString(36) + '-' + idCounter.toString(36) + '-' + Math.random().toString(36).slice(2, 8);
}

// Sequential subscriber code A2Y-0001, A2Y-0002 …
function nextCode(): string {
  const n = Number(localStorage.getItem(STORAGE_KEYS.seq) || '0') + 1;
  localStorage.setItem(STORAGE_KEYS.seq, String(n));
  return 'A2Y-' + String(n).padStart(4, '0');
}

const DEFAULT_BRAND: Brand = {
  name: 'A2Y Calories',
  city: 'Bhopal',
  fssai: '21422003001234',
};

export const storage = {
  // ---------- Brand ----------
  getBrand: (): Brand => {
    try { return { ...DEFAULT_BRAND, ...JSON.parse(localStorage.getItem(STORAGE_KEYS.brand) || '{}') }; }
    catch { return DEFAULT_BRAND; }
  },
  saveBrand: (brand: Brand) => localStorage.setItem(STORAGE_KEYS.brand, JSON.stringify(brand)),

  // ---------- Customers ----------
  getCustomers: (): Customer[] => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.customers) || '[]'); } catch { return []; }
  },
  saveCustomers: (customers: Customer[]) => localStorage.setItem(STORAGE_KEYS.customers, JSON.stringify(customers)),
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'code'> & { code?: string }) => {
    const customers = storage.getCustomers();
    const newCustomer: Customer = {
      ...customer,
      code: customer.code || nextCode(),
      id: uid('c_'),
      createdAt: new Date().toISOString(),
    };
    customers.push(newCustomer);
    storage.saveCustomers(customers);
    return newCustomer;
  },
  updateCustomer: (id: string, updates: Partial<Customer>) => {
    const customers = storage.getCustomers();
    const idx = customers.findIndex(c => c.id === id);
    if (idx >= 0) { customers[idx] = { ...customers[idx], ...updates }; storage.saveCustomers(customers); return customers[idx]; }
    return null;
  },
  deleteCustomer: (id: string) => storage.saveCustomers(storage.getCustomers().filter(c => c.id !== id)),

  // Bulk import (from Excel/CSV). Dedupes by phone; defaults unclear pref to veg (safe).
  importCustomers: (rows: Array<Partial<Customer>>) => {
    const existing = storage.getCustomers();
    const byPhone = new Map(existing.filter(c => c.phone).map(c => [c.phone.replace(/\D/g, ''), c]));
    let added = 0, updated = 0;
    for (const r of rows) {
      if (!r.name) continue;
      const phoneKey = (r.phone || '').replace(/\D/g, '');
      const base: Customer = {
        id: uid('c_'), code: nextCode(), name: r.name, phone: r.phone || '',
        address: r.address || '', preference: (r.preference as Customer['preference']) || 'veg',
        plan: r.plan || 'Monthly', dietaryNotes: r.dietaryNotes || '', status: 'active',
        createdAt: new Date().toISOString(),
      };
      if (phoneKey && byPhone.has(phoneKey)) {
        const found = byPhone.get(phoneKey)!;
        Object.assign(found, { name: base.name, address: base.address || found.address, preference: base.preference, plan: base.plan || found.plan });
        updated++;
      } else {
        existing.push(base);
        if (phoneKey) byPhone.set(phoneKey, base);
        added++;
      }
    }
    storage.saveCustomers(existing);
    return { added, updated };
  },

  // ---------- Dishes ----------
  getDishes: (): Dish[] => { try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.dishes) || '[]'); } catch { return []; } },
  saveDishes: (dishes: Dish[]) => localStorage.setItem(STORAGE_KEYS.dishes, JSON.stringify(dishes)),
  addDish: (dish: Omit<Dish, 'id'>) => {
    const dishes = storage.getDishes();
    const newDish: Dish = { ...dish, id: uid('d_') };
    dishes.push(newDish); storage.saveDishes(dishes); return newDish;
  },
  updateDish: (id: string, updates: Partial<Dish>) => {
    const dishes = storage.getDishes();
    const idx = dishes.findIndex(d => d.id === id);
    if (idx >= 0) { dishes[idx] = { ...dishes[idx], ...updates }; storage.saveDishes(dishes); return dishes[idx]; }
    return null;
  },
  deleteDish: (id: string) => storage.saveDishes(storage.getDishes().filter(d => d.id !== id)),

  // ---------- Assignments ----------
  getAssignments: (date?: string): MealAssignment[] => {
    try {
      const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.assignments) || '[]');
      return date ? all.filter((a: MealAssignment) => a.date === date) : all;
    } catch { return []; }
  },
  saveAssignments: (assignments: MealAssignment[]) => localStorage.setItem(STORAGE_KEYS.assignments, JSON.stringify(assignments)),
  addAssignments: (assignments: Omit<MealAssignment, 'id' | 'createdAt'>[]) => {
    const existing = storage.getAssignments();
    const newAssignments: MealAssignment[] = assignments.map(a => ({ ...a, id: uid('a_'), createdAt: new Date().toISOString() }));
    storage.saveAssignments([...existing, ...newAssignments]);
    return newAssignments;
  },
  clearAssignments: (date: string) => storage.saveAssignments(storage.getAssignments().filter(a => a.date !== date)),
  clearShift: (date: string, shift: 'morning' | 'evening') =>
    storage.saveAssignments(storage.getAssignments().filter(a => !(a.date === date && a.shift === shift))),
  updateAssignmentDish: (id: string, dishId: string) => {
    const all = storage.getAssignments();
    const i = all.findIndex(a => a.id === id);
    if (i >= 0) { all[i].dishId = dishId; storage.saveAssignments(all); }
  },

  // ---------- Daily menu (the 3-category picks per date+shift) ----------
  getMenus: (): Record<string, DayMenu> => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.menus) || '{}'); } catch { return {}; }
  },
  saveMenu: (date: string, shift: 'morning' | 'evening', menu: DayMenu) => {
    const all = storage.getMenus();
    all[`${date}:${shift}`] = menu;
    localStorage.setItem(STORAGE_KEYS.menus, JSON.stringify(all));
  },
  getMenu: (date: string, shift: 'morning' | 'evening'): DayMenu | null => {
    return storage.getMenus()[`${date}:${shift}`] || null;
  },
  // Most recent saved menu for a shift (dates sort chronologically as YYYY-MM-DD),
  // used to carry forward yesterday's menu when today has none yet.
  getLatestMenu: (shift: 'morning' | 'evening'): DayMenu | null => {
    const all = storage.getMenus();
    const keys = Object.keys(all).filter(k => k.endsWith(':' + shift)).sort();
    return keys.length ? all[keys[keys.length - 1]] : null;
  },

  // ---------- Config ----------
  getConfig: (): DailyConfig => { try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.config) || '{}'); } catch { return {} as DailyConfig; } },
  saveConfig: (config: DailyConfig) => localStorage.setItem(STORAGE_KEYS.config, JSON.stringify(config)),

  // ---------- Seed ----------
  initSampleData: () => {
    if (storage.getCustomers().length === 0) {
      const sample: Array<Omit<Customer, 'id' | 'createdAt' | 'code'>> = [
        { name: 'Aarav Sharma', phone: '98-1234-5678', address: 'Arera Colony, Bhopal', preference: 'nonveg', plan: 'Monthly', dietaryNotes: '', status: 'active' },
        { name: 'Priya Nair', phone: '98-2345-6789', address: 'Kolar Road, Bhopal', preference: 'veg', plan: 'Monthly', dietaryNotes: 'No onion', status: 'active' },
        { name: 'Rohit Verma', phone: '98-3456-7890', address: 'MP Nagar, Bhopal', preference: 'veg', plan: 'Weekly', dietaryNotes: '', status: 'active' },
        { name: 'Fatima Khan', phone: '98-4567-8901', address: 'Shahpura, Bhopal', preference: 'nonveg', plan: 'Monthly', dietaryNotes: 'Less spicy', status: 'active' },
        { name: 'Sneha Dubey', phone: '98-5678-9012', address: 'Bittan Market, Bhopal', preference: 'veg', plan: 'Weekly', dietaryNotes: '', status: 'active' },
        { name: 'Imran Sheikh', phone: '98-6789-0123', address: 'New Market, Bhopal', preference: 'both', plan: 'Monthly', dietaryNotes: '', status: 'active' },
        { name: 'Neha Jain', phone: '98-7890-1234', address: 'Ashoka Garden, Bhopal', preference: 'veg', plan: 'Monthly', dietaryNotes: 'Jain — no root veg', status: 'active' },
        { name: 'Vikram Rana', phone: '98-8901-2345', address: 'Shahpura, Bhopal', preference: 'nonveg', plan: 'Weekly', dietaryNotes: '', status: 'active' },
      ];
      sample.forEach(c => storage.addCustomer(c));
    }
    if (storage.getDishes().length === 0) {
      const dishes: Omit<Dish, 'id'>[] = [
        { name: 'Rajma Chawal', type: 'veg', calories: 520, price: 100, shift: 'both' },
        { name: 'Paneer Butter Masala + Roti', type: 'veg', calories: 610, price: 120, shift: 'both' },
        { name: 'Dal Tadka + Jeera Rice', type: 'veg', calories: 480, price: 90, shift: 'both' },
        { name: 'Aloo Gobi + 3 Roti', type: 'veg', calories: 430, price: 85, shift: 'morning' },
        { name: 'Chole + Bhature', type: 'veg', calories: 700, price: 110, shift: 'morning' },
        { name: 'Palak Paneer + Roti', type: 'veg', calories: 470, price: 115, shift: 'evening' },
        { name: 'Chicken Curry + Rice', type: 'nonveg', calories: 650, price: 150, shift: 'both' },
        { name: 'Egg Curry + Roti', type: 'nonveg', calories: 500, price: 95, shift: 'morning' },
        { name: 'Mutton Curry + Roti', type: 'nonveg', calories: 680, price: 170, shift: 'evening' },
        { name: 'Fish Curry + Rice', type: 'nonveg', calories: 560, price: 155, shift: 'both' },
        { name: 'Thali (Veg or Chicken)', type: 'mixed', calories: 600, price: 130, shift: 'both' },
        { name: 'Rice + Curry Station', type: 'mixed', calories: 550, price: 125, shift: 'both' },
      ];
      dishes.forEach(d => storage.addDish(d));
    }
  },
};
