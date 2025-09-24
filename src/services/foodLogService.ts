import api from './api';
import { FoodLog } from '../types';

export interface CreateFoodLogData {
  userId: string;
  date: string;
  foodId: string;
  quantity: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface FoodLogResponse extends FoodLog {
  _id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export const foodLogService = {
  // Get food logs for a user
  getUserFoodLogs: async (userId: string): Promise<FoodLogResponse[]> => {
    const response = await api.get(`/food-logs/user/${userId}`);
    return response.data;
  },

  // Create new food log
  createFoodLog: async (foodLogData: CreateFoodLogData): Promise<FoodLogResponse> => {
    const response = await api.post('/food-logs', foodLogData);
    return response.data;
  },

  // Delete food log
  deleteFoodLog: async (foodLogId: string): Promise<void> => {
    await api.delete(`/food-logs/${foodLogId}`);
  },
};
