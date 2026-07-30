export interface Customer {
  id: string;
  code: string;        // subscriber code, e.g. A2Y-0142 (printed + barcoded)
  name: string;
  phone: string;
  address: string;
  preference: 'veg' | 'nonveg' | 'both';
  plan: string;        // e.g. Weekly / Monthly
  dietaryNotes: string;
  status: 'active' | 'paused';
  createdAt: string;
}

export interface Dish {
  id: string;
  name: string;
  type: 'veg' | 'nonveg' | 'mixed';
  calories: number;
  price: number;
  shift: 'morning' | 'evening' | 'both';
}

export interface MealAssignment {
  id: string;
  customerId: string;
  dishId: string;
  date: string;
  shift: 'morning' | 'evening';
  createdAt: string;
}

export interface DailyConfig {
  date: string;
  morningCount: number;
  eveningCount: number;
  mixedRatio: number;
  lastGenerated?: string;
}

export interface Brand {
  name: string;
  city: string;
  fssai: string;
  logoDataUrl?: string;
}
