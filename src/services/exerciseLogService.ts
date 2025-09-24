import api from './api';
import { ExerciseLog } from '../types';

export interface CreateExerciseLogData {
  userId: string;
  date: string;
  exerciseId: string;
  duration: number;
  intensity: 'low' | 'medium' | 'high';
  caloriesBurned: number;
}

export interface ExerciseLogResponse extends ExerciseLog {
  _id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export const exerciseLogService = {
  // Get exercise logs for a user
  getUserExerciseLogs: async (userId: string): Promise<ExerciseLogResponse[]> => {
    const response = await api.get(`/exercise-logs/user/${userId}`);
    return response.data;
  },

  // Create new exercise log
  createExerciseLog: async (exerciseLogData: CreateExerciseLogData): Promise<ExerciseLogResponse> => {
    const response = await api.post('/exercise-logs', exerciseLogData);
    return response.data;
  },

  // Delete exercise log
  deleteExerciseLog: async (exerciseLogId: string): Promise<void> => {
    await api.delete(`/exercise-logs/${exerciseLogId}`);
  },
};
