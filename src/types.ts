export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  preference: 'veg' | 'nonveg' | 'both';
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
