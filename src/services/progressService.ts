import api from './api';
import { DailyProgress } from '../types';

export interface ProgressResponse extends DailyProgress {
  _id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProgressData {
  userId: string;
  date: string;
  weight?: number;
  caloriesConsumed?: number;
  caloriesBurned?: number;
  waterIntake?: number;
  mood?: 'great' | 'good' | 'okay' | 'tired' | 'stressed';
}

export const progressService = {
  // Get daily progress for a user
  getUserProgress: async (userId: string): Promise<ProgressResponse[]> => {
    const response = await api.get(`/progress/user/${userId}`);
    return response.data;
  },

  // Get progress for specific date
  getProgressByDate: async (userId: string, date: string): Promise<ProgressResponse | null> => {
    try {
      const response = await api.get(`/progress/user/${userId}/date/${date}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Create or update daily progress
  saveProgress: async (progressData: CreateProgressData): Promise<ProgressResponse> => {
    const response = await api.post('/progress', progressData);
    return response.data;
  },

  // Update specific progress entry
  updateProgress: async (progressId: string, updateData: Partial<CreateProgressData>): Promise<ProgressResponse> => {
    const response = await api.put(`/progress/${progressId}`, updateData);
    return response.data;
  },
};
