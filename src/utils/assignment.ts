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

  // Calculate target counts for mixed dishes
  const mixedTarget = Math.ceil((count * mixedRatio) / 100);
  const regularTarget = count - mixedTarget;

  // Prepare dish pools with usage tracking
  const vegPool = shuffle(vegDishes);
  const nonvegPool = shuffle(nonvegDishes);
  const mixedPool = shuffle(mixedDishes);

  let vegIdx = 0, nonvegIdx = 0, mixedIdx = 0;

  // Assign to customers
  const shuffledCustomers = shuffle(activeCustomers);

  for (let i = 0; i < Math.min(count, shuffledCustomers.length); i++) {
    const customer = shuffledCustomers[i];
    let assignedDish: Dish | null = null;

    // Decide if this should be a mixed dish
    const isMixedSlot = i < mixedTarget;

    if (isMixedSlot && mixedPool.length > 0) {
      assignedDish = mixedPool[mixedIdx % mixedPool.length];
      mixedIdx++;
      mixedCount++;
    } else if (customer.preference === 'veg') {
      if (vegPool.length > 0) {
        assignedDish = vegPool[vegIdx % vegPool.length];
        vegIdx++;
        vegCount++;
      } else if (mixedPool.length > 0) {
        assignedDish = mixedPool[mixedIdx % mixedPool.length];
        mixedIdx++;
        mixedCount++;
      }
    } else if (customer.preference === 'nonveg') {
      if (nonvegPool.length > 0) {
        assignedDish = nonvegPool[nonvegIdx % nonvegPool.length];
        nonvegIdx++;
        nonvegCount++;
      } else if (mixedPool.length > 0) {
        assignedDish = mixedPool[mixedIdx % mixedPool.length];
        mixedIdx++;
        mixedCount++;
      }
    } else {
      // 'both' preference
      const rand = Math.random();
      if (rand < 0.4) {
        assignedDish = vegPool[vegIdx % vegPool.length];
        vegIdx++;
        vegCount++;
      } else if (rand < 0.7) {
        assignedDish = nonvegPool[nonvegIdx % nonvegPool.length];
        nonvegIdx++;
        nonvegCount++;
      } else {
        assignedDish = mixedPool[mixedIdx % mixedPool.length];
        mixedIdx++;
        mixedCount++;
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
        reason: 'No suitable dishes available',
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
