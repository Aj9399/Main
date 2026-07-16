import { Customer, Dish, MealAssignment, DailyConfig } from '../types';

const STORAGE_KEYS = {
  customers: 'kma:customers',
  dishes: 'kma:dishes',
  assignments: 'kma:assignments',
  config: 'kma:config',
};

export const storage = {
  // Customers
  getCustomers: (): Customer[] => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.customers) || '[]');
    } catch {
      return [];
    }
  },
  saveCustomers: (customers: Customer[]) => {
    localStorage.setItem(STORAGE_KEYS.customers, JSON.stringify(customers));
  },
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => {
    const customers = storage.getCustomers();
    const newCustomer: Customer = {
      ...customer,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    customers.push(newCustomer);
    storage.saveCustomers(customers);
    return newCustomer;
  },
  updateCustomer: (id: string, updates: Partial<Customer>) => {
    const customers = storage.getCustomers();
    const idx = customers.findIndex(c => c.id === id);
    if (idx >= 0) {
      customers[idx] = { ...customers[idx], ...updates };
      storage.saveCustomers(customers);
      return customers[idx];
    }
    return null;
  },
  deleteCustomer: (id: string) => {
    const customers = storage.getCustomers().filter(c => c.id !== id);
    storage.saveCustomers(customers);
  },

  // Dishes
  getDishes: (): Dish[] => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.dishes) || '[]');
    } catch {
      return [];
    }
  },
  saveDishes: (dishes: Dish[]) => {
    localStorage.setItem(STORAGE_KEYS.dishes, JSON.stringify(dishes));
  },
  addDish: (dish: Omit<Dish, 'id'>) => {
    const dishes = storage.getDishes();
    const newDish: Dish = {
      ...dish,
      id: Date.now().toString(),
    };
    dishes.push(newDish);
    storage.saveDishes(dishes);
    return newDish;
  },
  updateDish: (id: string, updates: Partial<Dish>) => {
    const dishes = storage.getDishes();
    const idx = dishes.findIndex(d => d.id === id);
    if (idx >= 0) {
      dishes[idx] = { ...dishes[idx], ...updates };
      storage.saveDishes(dishes);
      return dishes[idx];
    }
    return null;
  },
  deleteDish: (id: string) => {
    const dishes = storage.getDishes().filter(d => d.id !== id);
    storage.saveDishes(dishes);
  },

  // Assignments
  getAssignments: (date?: string): MealAssignment[] => {
    try {
      const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.assignments) || '[]');
      if (date) {
        return all.filter((a: MealAssignment) => a.date === date);
      }
      return all;
    } catch {
      return [];
    }
  },
  saveAssignments: (assignments: MealAssignment[]) => {
    localStorage.setItem(STORAGE_KEYS.assignments, JSON.stringify(assignments));
  },
  addAssignments: (assignments: Omit<MealAssignment, 'id' | 'createdAt'>[]) => {
    const existing = storage.getAssignments();
    const newAssignments: MealAssignment[] = assignments.map(a => ({
      ...a,
      id: Math.random().toString(36).slice(2),
      createdAt: new Date().toISOString(),
    }));
    storage.saveAssignments([...existing, ...newAssignments]);
    return newAssignments;
  },
  clearAssignments: (date: string) => {
    const assignments = storage.getAssignments().filter(a => a.date !== date);
    storage.saveAssignments(assignments);
  },

  // Config
  getConfig: (): DailyConfig => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.config) || '{}');
    } catch {
      return {};
    }
  },
  saveConfig: (config: DailyConfig) => {
    localStorage.setItem(STORAGE_KEYS.config, JSON.stringify(config));
  },

  // Init with sample data
  initSampleData: () => {
    if (storage.getCustomers().length === 0) {
      const sampleCustomers: Omit<Customer, 'id' | 'createdAt'>[] = [
        { name: 'Rajesh Mehta', phone: '98-1234-5678', address: 'Sector 7, Pune', preference: 'nonveg', dietaryNotes: '', status: 'active' },
        { name: 'Priya Nair', phone: '98-2345-6789', address: 'Koramangala, Bangalore', preference: 'veg', dietaryNotes: 'No onion', status: 'active' },
        { name: 'Amit Verma', phone: '98-3456-7890', address: 'Delhi NCR', preference: 'veg', dietaryNotes: '', status: 'active' },
        { name: 'Sneha Kulkarni', phone: '98-4567-8901', address: 'Mumbai', preference: 'nonveg', dietaryNotes: 'Less spicy', status: 'active' },
        { name: 'Farhan Sheikh', phone: '98-5678-9012', address: 'Chennai', preference: 'veg', dietaryNotes: '', status: 'active' },
      ];
      sampleCustomers.forEach(c => storage.addCustomer(c));
    }

    if (storage.getDishes().length === 0) {
      const sampleDishes: Omit<Dish, 'id'>[] = [
        // Veg
        { name: 'Paneer Butter Masala', type: 'veg', calories: 610, price: 120, shift: 'both' },
        { name: 'Dal Tadka + Roti', type: 'veg', calories: 450, price: 90, shift: 'both' },
        { name: 'Veg Pulao', type: 'veg', calories: 480, price: 100, shift: 'morning' },
        { name: 'Aloo Gobi + Roti', type: 'veg', calories: 430, price: 85, shift: 'both' },
        { name: 'Palak Paneer', type: 'veg', calories: 470, price: 115, shift: 'evening' },
        // Non-veg
        { name: 'Butter Chicken + Naan', type: 'nonveg', calories: 720, price: 150, shift: 'both' },
        { name: 'Chicken Curry + Rice', type: 'nonveg', calories: 650, price: 140, shift: 'both' },
        { name: 'Mutton Curry + Roti', type: 'nonveg', calories: 680, price: 160, shift: 'evening' },
        { name: 'Fish Curry + Rice', type: 'nonveg', calories: 560, price: 145, shift: 'both' },
        { name: 'Egg Curry + Roti', type: 'nonveg', calories: 500, price: 95, shift: 'morning' },
        // Mixed
        { name: 'Rice + Curry Station', type: 'mixed', calories: 550, price: 125, shift: 'both' },
        { name: 'Roti Combo', type: 'mixed', calories: 520, price: 110, shift: 'both' },
        { name: 'Mixed Thali', type: 'mixed', calories: 600, price: 130, shift: 'both' },
      ];
      sampleDishes.forEach(d => storage.addDish(d));
    }
  },
};
