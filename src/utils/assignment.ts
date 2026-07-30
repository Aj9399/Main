import { Customer, MealAssignment } from '../types';

// The kitchen picks ONE dish per category for the shift; every active customer
// automatically gets the dish for their own category. Veg-safety is guaranteed
// because a veg customer only ever receives the dish chosen for the veg
// category (which the UI restricts to veg dishes).
export type CategoryDish = { veg: string; nonveg: string; both: string };

export function assignByCategory(
  customers: Customer[],
  catDish: CategoryDish,
  date: string,
  shift: 'morning' | 'evening'
): { assignments: Omit<MealAssignment, 'id' | 'createdAt'>[]; skipped: number } {
  const active = customers.filter(c => c.status === 'active');
  const assignments: Omit<MealAssignment, 'id' | 'createdAt'>[] = [];
  let skipped = 0;
  for (const c of active) {
    const dishId = catDish[c.preference];
    if (dishId) assignments.push({ customerId: c.id, dishId, date, shift });
    else skipped++; // category has no dish chosen yet
  }
  return { assignments, skipped };
}

// Which dishes a given customer may be assigned (used for per-row overrides).
// Veg customers are strictly veg-only; non-veg can take non-veg or mixed;
// "both" customers can take anything.
export function allowedTypesFor(pref: Customer['preference']): Array<'veg' | 'nonveg' | 'mixed'> {
  if (pref === 'veg') return ['veg'];
  if (pref === 'nonveg') return ['nonveg', 'mixed'];
  return ['veg', 'nonveg', 'mixed'];
}
