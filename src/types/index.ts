export interface User {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  height: number; // cm
  weight: number; // kg
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active';
  goal: 'lose_weight' | 'maintain_weight' | 'gain_weight' | 'build_muscle';
  targetWeight?: number;
  bmi: number;
  dailyCalories: number;
  createdAt: string;
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  serving: string;
}

export interface ExerciseItem {
  id: string;
  name: string;
  category: 'cardio' | 'strength' | 'flexibility' | 'sports';
  caloriesPerMinute: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string[];
  muscleGroups: string[];
}

export interface FoodLog {
  id: string;
  date: string;
  foodId: string;
  quantity: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface ExerciseLog {
  id: string;
  date: string;
  exerciseId: string;
  duration: number;
  intensity: 'low' | 'medium' | 'high';
  caloriesBurned: number;
}

export interface DailyProgress {
  date: string;
  weight?: number;
  caloriesConsumed: number;
  caloriesBurned: number;
  waterIntake: number;
  mood: 'great' | 'good' | 'okay' | 'tired' | 'stressed';
}