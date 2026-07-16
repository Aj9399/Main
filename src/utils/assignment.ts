import { Customer, Dish, MealAssignment } from '../types';

interface AssignmentResult {
  assignments: Omit<MealAssignment, 'id' | 'createdAt'>[];
  unassigned: { customerId: string; reason: string }[];
  stats: {
    total: number;
    assigned: number;
    unassigned: number;
    vegCount: number;
    nonvegCount: number;
    mixedCount: number;
  };
}

export const assignMeals = (
  customers: Customer[],
  dishes: Dish[],
  date: string,
  shift: 'morning' | 'evening',
  count: number,
  mixedRatio: number
): AssignmentResult => {
  const activeCustomers = customers.filter(c => c.status === 'active');
  const shiftDishes = dishes.filter(d => d.shift === 'both' || d.shift === shift);

  const vegDishes = shiftDishes.filter(d => d.type === 'veg');
  const nonvegDishes = shiftDishes.filter(d => d.type === 'nonveg');
  const mixedDishes = shiftDishes.filter(d => d.type === 'mixed');

  // Shuffle function for randomness
  const shuffle = <T,>(arr: T[]): T[] => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const assignments: Omit<MealAssignment, 'id' | 'createdAt'>[] = [];
  const unassigned: { customerId: string; reason: string }[] = [];

  let vegCount = 0, nonvegCount = 0, mixedCount = 0;

  // Target number of mixed dishes for the day. Mixed dishes can contain
  // non-veg, so they are ONLY handed to customers who eat non-veg (nonveg or
  // both). Pure-veg customers are never counted toward or served a mixed dish.
  const mixedTarget = Math.ceil((count * mixedRatio) / 100);

  // Prepare dish pools with usage tracking
  const vegPool = shuffle(vegDishes);
  const nonvegPool = shuffle(nonvegDishes);
  const mixedPool = shuffle(mixedDishes);

  let vegIdx = 0, nonvegIdx = 0, mixedIdx = 0;
  let mixedAssigned = 0;

  const takeVeg = (): Dish | null => {
    if (vegPool.length === 0) return null;
    const d = vegPool[vegIdx % vegPool.length]; vegIdx++; vegCount++; return d;
  };
  const takeNonveg = (): Dish | null => {
    if (nonvegPool.length === 0) return null;
    const d = nonvegPool[nonvegIdx % nonvegPool.length]; nonvegIdx++; nonvegCount++; return d;
  };
  const takeMixed = (): Dish | null => {
    if (mixedPool.length === 0) return null;
    const d = mixedPool[mixedIdx % mixedPool.length]; mixedIdx++; mixedCount++; mixedAssigned++; return d;
  };

  // Assign to customers
  const shuffledCustomers = shuffle(activeCustomers);

  for (let i = 0; i < Math.min(count, shuffledCustomers.length); i++) {
    const customer = shuffledCustomers[i];
    let assignedDish: Dish | null = null;

    if (customer.preference === 'veg') {
      // STRICT RULE: a pure-veg customer only ever receives a veg dish.
      // Never a mixed dish (may contain non-veg) and never a non-veg dish.
      assignedDish = takeVeg();
      // No fallback — leaving unassigned is correct rather than risking non-veg.
    } else if (customer.preference === 'nonveg') {
      // Non-veg customers absorb the mixed-dish quota first, then non-veg,
      // then mixed as a fallback if non-veg dishes run out.
      if (mixedAssigned < mixedTarget) {
        assignedDish = takeMixed() ?? takeNonveg();
      } else {
        assignedDish = takeNonveg() ?? takeMixed();
      }
    } else {
      // 'both' — eligible for everything; also helps fill the mixed quota.
      if (mixedAssigned < mixedTarget && mixedPool.length > 0) {
        assignedDish = takeMixed();
      } else {
        const rand = Math.random();
        if (rand < 0.5) {
          assignedDish = takeVeg() ?? takeNonveg() ?? takeMixed();
        } else {
          assignedDish = takeNonveg() ?? takeVeg() ?? takeMixed();
        }
      }
    }

    if (assignedDish) {
      assignments.push({
        customerId: customer.id,
        dishId: assignedDish.id,
        date,
        shift,
      });
    } else {
      unassigned.push({
        customerId: customer.id,
        reason: customer.preference === 'veg'
          ? 'No veg dishes available for a veg customer'
          : 'No suitable dishes available',
      });
    }
  }

  // If we have fewer customers than requested count, note it
  if (activeCustomers.length < count) {
    unassigned.push({
      customerId: '',
      reason: `Only ${activeCustomers.length} active customers, requested ${count}`,
    });
  }

  return {
    assignments,
    unassigned,
    stats: {
      total: count,
      assigned: assignments.length,
      unassigned: unassigned.length,
      vegCount,
      nonvegCount,
      mixedCount,
    },
  };
};
