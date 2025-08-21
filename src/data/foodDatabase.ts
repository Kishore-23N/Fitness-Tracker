import { FoodItem } from '../types';

export const foodDatabase: FoodItem[] = [
  // Proteins
  {
    id: 'chicken-breast',
    name: 'Chicken Breast (Grilled)',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    serving: '100g'
  },
  {
    id: 'salmon',
    name: 'Salmon (Baked)',
    calories: 208,
    protein: 22,
    carbs: 0,
    fat: 12,
    fiber: 0,
    serving: '100g'
  },
  {
    id: 'eggs',
    name: 'Eggs (Large)',
    calories: 155,
    protein: 13,
    carbs: 1.1,
    fat: 11,
    fiber: 0,
    serving: '2 eggs'
  },
  {
    id: 'greek-yogurt',
    name: 'Greek Yogurt (Plain)',
    calories: 100,
    protein: 17,
    carbs: 6,
    fat: 0.4,
    fiber: 0,
    serving: '150g'
  },

  // Carbohydrates
  {
    id: 'brown-rice',
    name: 'Brown Rice (Cooked)',
    calories: 112,
    protein: 2.6,
    carbs: 22,
    fat: 0.9,
    fiber: 1.8,
    serving: '100g'
  },
  {
    id: 'quinoa',
    name: 'Quinoa (Cooked)',
    calories: 120,
    protein: 4.4,
    carbs: 22,
    fat: 1.9,
    fiber: 2.8,
    serving: '100g'
  },
  {
    id: 'oatmeal',
    name: 'Oatmeal',
    calories: 68,
    protein: 2.4,
    carbs: 12,
    fat: 1.4,
    fiber: 1.7,
    serving: '40g dry'
  },
  {
    id: 'sweet-potato',
    name: 'Sweet Potato (Baked)',
    calories: 103,
    protein: 2.3,
    carbs: 24,
    fat: 0.1,
    fiber: 3.9,
    serving: '150g'
  },

  // Vegetables
  {
    id: 'broccoli',
    name: 'Broccoli (Steamed)',
    calories: 35,
    protein: 2.8,
    carbs: 7,
    fat: 0.4,
    fiber: 2.6,
    serving: '100g'
  },
  {
    id: 'spinach',
    name: 'Spinach (Fresh)',
    calories: 23,
    protein: 2.9,
    carbs: 3.6,
    fat: 0.4,
    fiber: 2.2,
    serving: '100g'
  },
  {
    id: 'avocado',
    name: 'Avocado',
    calories: 234,
    protein: 2.9,
    carbs: 12,
    fat: 21,
    fiber: 10,
    serving: '150g'
  },

  // Fruits
  {
    id: 'banana',
    name: 'Banana (Medium)',
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fat: 0.4,
    fiber: 3.1,
    serving: '1 medium'
  },
  {
    id: 'apple',
    name: 'Apple (Medium)',
    calories: 95,
    protein: 0.5,
    carbs: 25,
    fat: 0.3,
    fiber: 4.4,
    serving: '1 medium'
  },
  {
    id: 'blueberries',
    name: 'Blueberries',
    calories: 57,
    protein: 0.7,
    carbs: 14,
    fat: 0.3,
    fiber: 2.4,
    serving: '100g'
  }
];