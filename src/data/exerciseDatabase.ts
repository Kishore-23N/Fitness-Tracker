import { ExerciseItem } from '../types';

export const exerciseDatabase: ExerciseItem[] = [
  // Cardio
  {
    id: 'running',
    name: 'Running',
    category: 'cardio',
    caloriesPerMinute: 12,
    difficulty: 'intermediate',
    equipment: [],
    muscleGroups: ['legs', 'core', 'cardiovascular']
  },
  {
    id: 'cycling',
    name: 'Cycling',
    category: 'cardio',
    caloriesPerMinute: 8,
    difficulty: 'beginner',
    equipment: ['bicycle'],
    muscleGroups: ['legs', 'cardiovascular']
  },
  {
    id: 'swimming',
    name: 'Swimming',
    category: 'cardio',
    caloriesPerMinute: 11,
    difficulty: 'intermediate',
    equipment: [],
    muscleGroups: ['full body', 'cardiovascular']
  },
  {
    id: 'jump-rope',
    name: 'Jump Rope',
    category: 'cardio',
    caloriesPerMinute: 13,
    difficulty: 'intermediate',
    equipment: ['jump rope'],
    muscleGroups: ['legs', 'arms', 'cardiovascular']
  },

  // Strength Training
  {
    id: 'push-ups',
    name: 'Push-ups',
    category: 'strength',
    caloriesPerMinute: 7,
    difficulty: 'beginner',
    equipment: [],
    muscleGroups: ['chest', 'arms', 'shoulders', 'core']
  },
  {
    id: 'squats',
    name: 'Squats',
    category: 'strength',
    caloriesPerMinute: 8,
    difficulty: 'beginner',
    equipment: [],
    muscleGroups: ['legs', 'glutes', 'core']
  },
  {
    id: 'deadlifts',
    name: 'Deadlifts',
    category: 'strength',
    caloriesPerMinute: 9,
    difficulty: 'advanced',
    equipment: ['barbell', 'weights'],
    muscleGroups: ['back', 'legs', 'glutes', 'core']
  },
  {
    id: 'bench-press',
    name: 'Bench Press',
    category: 'strength',
    caloriesPerMinute: 6,
    difficulty: 'intermediate',
    equipment: ['barbell', 'bench', 'weights'],
    muscleGroups: ['chest', 'arms', 'shoulders']
  },
  {
    id: 'pull-ups',
    name: 'Pull-ups',
    category: 'strength',
    caloriesPerMinute: 8,
    difficulty: 'advanced',
    equipment: ['pull-up bar'],
    muscleGroups: ['back', 'arms', 'shoulders']
  },

  // Flexibility
  {
    id: 'yoga',
    name: 'Yoga',
    category: 'flexibility',
    caloriesPerMinute: 3,
    difficulty: 'beginner',
    equipment: ['yoga mat'],
    muscleGroups: ['full body', 'flexibility']
  },
  {
    id: 'stretching',
    name: 'Stretching',
    category: 'flexibility',
    caloriesPerMinute: 2,
    difficulty: 'beginner',
    equipment: [],
    muscleGroups: ['full body', 'flexibility']
  },
  {
    id: 'pilates',
    name: 'Pilates',
    category: 'flexibility',
    caloriesPerMinute: 4,
    difficulty: 'intermediate',
    equipment: ['mat'],
    muscleGroups: ['core', 'flexibility', 'full body']
  }
];