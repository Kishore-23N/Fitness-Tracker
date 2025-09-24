import React from 'react';
import { User, DailyProgress } from '../types';
import { formatDate, getBMICategory } from '../utils/calculations';
import { 
  Activity, 
  Target, 
  TrendingUp, 
  Calendar, 
  Flame,
  Heart,
  Droplets,
  Award
} from 'lucide-react';

interface DashboardProps {
  user: User;
  todayProgress: DailyProgress;
  weekProgress: DailyProgress[];
}

export const Dashboard: React.FC<DashboardProps> = ({ user, todayProgress, weekProgress }) => {
  const today = formatDate(new Date());
  const calorieProgress = (todayProgress.caloriesConsumed / user.dailyCalories) * 100;
  const netCalories = todayProgress.caloriesConsumed - todayProgress.caloriesBurned;

  const weeklyCaloriesBurned = weekProgress.reduce((sum, day) => sum + day.caloriesBurned, 0);
  const averageDailyBurn = weeklyCaloriesBurned / 7;

  return (
    <div className="space-y-6 px-2 sm:px-4 md:px-8 lg:px-0">
      {/* Welcome Header */}
  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 sm:p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {user.name}!</h1>
            <p className="text-blue-100">
              Keep up the great work on your fitness journey
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{user.weight}kg</div>
            <div className="text-blue-100">Current Weight</div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">BMI</p>
              <p className="text-2xl font-bold text-gray-900">{user.bmi}</p>
              <p className="text-xs text-gray-500">{getBMICategory(user.bmi)}</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Daily Goal</p>
              <p className="text-2xl font-bold text-gray-900">{user.dailyCalories}</p>
              <p className="text-xs text-gray-500">calories</p>
            </div>
            <div className="bg-green-100 p-2 rounded-lg">
              <Target className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Weekly Burn</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round(weeklyCaloriesBurned)}</p>
              <p className="text-xs text-gray-500">calories</p>
            </div>
            <div className="bg-orange-100 p-2 rounded-lg">
              <Flame className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Water Today</p>
              <p className="text-2xl font-bold text-gray-900">{todayProgress.waterIntake}</p>
              <p className="text-xs text-gray-500">glasses</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <Droplets className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Today's Progress */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calorie Tracking */}
  <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Flame className="w-5 h-5 mr-2 text-orange-600" />
            Today's Calories
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Consumed</span>
              <span className="font-semibold text-green-600">+{todayProgress.caloriesConsumed}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Burned</span>
              <span className="font-semibold text-red-600">-{todayProgress.caloriesBurned}</span>
            </div>
            
            <div className="border-t pt-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Net Calories</span>
                <span className={`font-bold ${netCalories > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {netCalories > 0 ? '+' : ''}{netCalories}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Progress to Goal</span>
                <span>{Math.round(calorieProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    calorieProgress <= 100 ? 'bg-green-500' : 'bg-orange-500'
                  }`}
                  style={{ width: `${Math.min(calorieProgress, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Overview */}
  <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
            Weekly Overview
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg. Daily Burn</span>
              <span className="font-semibold">{Math.round(averageDailyBurn)} cal</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active Days</span>
              <span className="font-semibold">
                {weekProgress.filter(day => day.caloriesBurned > 0).length}/7
              </span>
            </div>

            <div className="mt-4">
              <div className="text-sm text-gray-600 mb-2">Daily Activity</div>
              <div className="flex space-x-1">
                {weekProgress.map((day, index) => (
                  <div
                    key={day.date}
                    className={`flex-1 h-8 rounded ${
                      day.caloriesBurned > 200
                        ? 'bg-green-500'
                        : day.caloriesBurned > 100
                        ? 'bg-yellow-500'
                        : day.caloriesBurned > 0
                        ? 'bg-orange-500'
                        : 'bg-gray-200'
                    }`}
                    title={`${day.date}: ${day.caloriesBurned} calories burned`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>7 days ago</span>
                <span>Today</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Motivation Section */}
  <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 sm:p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Keep Going!
            </h3>
            <p className="text-green-100">
              {weekProgress.filter(day => day.caloriesBurned > 0).length >= 5
                ? "Amazing! You've been active 5+ days this week!"
                : averageDailyBurn > 200
                ? "Great job maintaining an active lifestyle!"
                : "Every step counts towards your fitness goals!"}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              {weekProgress.filter(day => day.caloriesBurned > 200).length}
            </div>
            <div className="text-green-100 text-sm">High activity days</div>
          </div>
        </div>
      </div>
    </div>
  );
};