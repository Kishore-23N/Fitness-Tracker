import api from './api';
import { User } from '../types';

export interface CreateUserData {
  name: string;
  age: number;
  gender: 'male' | 'female';
  height: number;
  weight: number;
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active';
  goal: 'lose_weight' | 'maintain_weight' | 'gain_weight' | 'build_muscle';
  targetWeight?: number;
  bmi: number;
  dailyCalories: number;
}

export interface UserResponse extends User {
  _id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends CreateUserData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Helper function to map backend response to frontend User type
const mapUserResponseToUser = (userResponse: UserResponse): User => {
  return {
    id: userResponse._id,
    email: userResponse.email,
    name: userResponse.name,
    age: userResponse.age,
    gender: userResponse.gender,
    height: userResponse.height,
    weight: userResponse.weight,
    activityLevel: userResponse.activityLevel,
    goal: userResponse.goal,
    targetWeight: userResponse.targetWeight,
    bmi: userResponse.bmi,
    dailyCalories: userResponse.dailyCalories,
    createdAt: userResponse.createdAt
  };
};

export const userService = {
  // Create new user
    createUser: async (userData: CreateUserData): Promise<UserResponse> => {
      try {
        const response = await api.post('/users', userData);
        return response.data;
      } catch (error: any) {
        throw error?.response?.data || error;
      }
    },

  // Get user by ID
    getUser: async (userId: string): Promise<UserResponse> => {
      try {
        const response = await api.get(`/users/${userId}`);
        return response.data;
      } catch (error: any) {
        throw error?.response?.data || error;
      }
    },

  // Update user
    updateUser: async (userId: string, userData: Partial<CreateUserData>): Promise<UserResponse> => {
      try {
        const response = await api.put(`/users/${userId}`, userData);
        return response.data;
      } catch (error: any) {
        throw error?.response?.data || error;
      }
    },

  // Delete user and all associated data
    deleteUser: async (userId: string): Promise<void> => {
      try {
        await api.delete(`/users/${userId}`);
      } catch (error: any) {
        throw error?.response?.data || error;
      }
    },

  // Register new user
    register: async (userData: RegisterData): Promise<AuthResponse> => {
      try {
        const response = await api.post('/users/register', userData);

        // Map the user response to the frontend User type
        const mappedUser = mapUserResponseToUser(response.data.user);
        return {
          user: mappedUser,
          token: response.data.token
        };
      } catch (error: any) {
        throw error?.response?.data || error;
      }
    },

  // Login user
    login: async (credentials: LoginData): Promise<AuthResponse> => {
      try {
        console.log('Attempting login with:', { email: credentials.email, hasPassword: !!credentials.password });
        console.log('API base URL:', api.defaults.baseURL);
        const response = await api.post('/users/login', credentials);
        console.log('Login successful:', response.data);

        // Map the user response to the frontend User type
        const mappedUser = mapUserResponseToUser(response.data.user);
        return {
          user: mappedUser,
          token: response.data.token
        };
      } catch (error: any) {
        console.error('Login error:', error);
        console.error('Error response:', error?.response?.data);
        throw error?.response?.data || error;
      }
    },
};
