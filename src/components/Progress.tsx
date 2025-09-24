import React from 'react';
import { User, DailyProgress, FoodLog, ExerciseLog } from '../types';
import { formatDate, getWeekDates } from '../utils/calculations';
import { foodDatabase } from '../data/foodDatabase';
import { exerciseDatabase } from '../data/exerciseDatabase';
import { 
  TrendingUp, 
  Calendar, 
  Flame, 
  Target, 
  Award,
  BarChart3,
  Activity
} from 'lucide-react';

interface ProgressProps {
  user: User;
  weekProgress: DailyProgress[];
  foodLogs: FoodLog[];
  exerciseLogs: ExerciseLog[];
}

export const Progress: React.FC<ProgressProps> = ({ 
  user, 
  weekProgress, 
  foodLogs, 
  exerciseLogs 
}) => {
  const weekDates = getWeekDates();
  const today = formatDate(new Date());

  // Calculate statistics
  const totalCaloriesConsumed = weekProgress.reduce((sum, day) => sum + day.caloriesConsumed, 0);
  const totalCaloriesBurned = weekProgress.reduce((sum, day) => sum + day.caloriesBurned, 0);
  const avgDailyConsumption = totalCaloriesConsumed / 7;
  const avgDailyBurn = totalCaloriesBurned / 7;
  const activeDays = weekProgress.filter(day => day.caloriesBurned > 0).length;

  // Calculate streaks
  const calculateStreak = () => {
    let streak = 0;
    for (let i = weekProgress.length - 1; i >= 0; i--) {
      if (weekProgress[i].caloriesBurned > 100) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const currentStreak = calculateStreak();

  // Get most consumed foods
  const getFoodStats = () => {
    const foodCounts: { [key: string]: number } = {};
    foodLogs.forEach(log => {
      foodCounts[log.foodId] = (foodCounts[log.foodId] || 0) + log.quantity;
    });

    return Object.entries(foodCounts)
      .map(([foodId, quantity]) => ({
        food: foodDatabase.find(f => f.id === foodId)!,
        quantity
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  };

  // Get most done exercises
  const getExerciseStats = () => {
    const exerciseCounts: { [key: string]: number } = {};
    exerciseLogs.forEach(log => {
      exerciseCounts[log.exerciseId] = (exerciseCounts[log.exerciseId] || 0) + log.duration;
    });

    return Object.entries(exerciseCounts)
      .map(([exerciseId, totalMinutes]) => ({
        exercise: exerciseDatabase.find(e => e.id === exerciseId)!,
        totalMinutes
      }))
      .sort((a, b) => b.totalMinutes - a.totalMinutes)
      .slice(0, 5);
  };

  const topFoods = getFoodStats();
  const topExercises = getExerciseStats();

  const getProgressMessage = () => {
    if (currentStreak >= 7) return "🔥 Amazing! You're on fire with a week-long streak!";
    if (currentStreak >= 3) return "⭐ Great job! Keep the momentum going!";
    if (activeDays >= 5) return "💪 Excellent weekly consistency!";
    if (avgDailyBurn > 200) return "🏃 You're staying active and burning calories!";
    return "🌟 Every step counts towards your fitness goals!";
  };

  return (
    <div className="space-y-6 px-2 sm:px-4 md:px-8 lg:px-0">
      {/* Header */}
  <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-4 sm:p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold mb-2 flex items-center">
          <BarChart3 className="w-6 h-6 mr-2" />
          Progress Tracking
        </h1>
        <p className="text-purple-100">
          Monitor your fitness journey and celebrate achievements
        </p>
      </div>

      {/* Key Metrics */}
  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Current Streak</p>
              <p className="text-2xl font-bold text-orange-600">{currentStreak}</p>
              <p className="text-xs text-gray-500">active days</p>
            </div>
            <div className="bg-orange-100 p-2 rounded-lg">
              <Flame className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Weekly Active</p>
              <p className="text-2xl font-bold text-green-600">{activeDays}/7</p>
              <p className="text-xs text-gray-500">days</p>
            </div>
            <div className="bg-green-100 p-2 rounded-lg">
              <Activity className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Daily Burn</p>
              <p className="text-2xl font-bold text-red-600">{Math.round(avgDailyBurn)}</p>
              <p className="text-xs text-gray-500">calories</p>
            </div>
            <div className="bg-red-100 p-2 rounded-lg">
              <Flame className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Weekly Total</p>
              <p className="text-2xl font-bold text-blue-600">{Math.round(totalCaloriesBurned)}</p>
              <p className="text-xs text-gray-500">calories burned</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100">
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <h3 className="text-xl font-semibold flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Weekly Activity Chart
          </h3>
        </div>
  <div className="p-4 sm:p-6">
          <div className="space-y-4">
            {weekDates.map((date, index) => {
              const dayProgress = weekProgress.find(p => p.date === date) || {
                date,
                caloriesConsumed: 0,
                caloriesBurned: 0,
                waterIntake: 0,
                mood: 'okay' as const
              };

              const isToday = date === today;
              const calorieGoalProgress = (dayProgress.caloriesConsumed / user.dailyCalories) * 100;
              const burnProgress = Math.min((dayProgress.caloriesBurned / 400) * 100, 100); // 400 cal as target

              return (
                <div key={date} className={`p-4 rounded-lg border ${isToday ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="font-medium">
                        {new Date(date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                      {isToday && <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-1 rounded">Today</span>}
                    </div>
                    <div className="text-sm text-gray-600">
                      {dayProgress.caloriesBurned > 0 ? '✅ Active' : '⭕ Rest'}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Calories Consumed</span>
                        <span>{dayProgress.caloriesConsumed}/{user.dailyCalories}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            calorieGoalProgress <= 100 ? 'bg-green-500' : 'bg-orange-500'
                          }`}
                          style={{ width: `${Math.min(calorieGoalProgress, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Calories Burned</span>
                        <span>{dayProgress.caloriesBurned}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${burnProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Foods and Exercises */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Foods */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold">Most Consumed Foods</h3>
          </div>
          <div className="p-4 sm:p-6">
            {topFoods.length > 0 ? (
              <div className="space-y-3">
                {topFoods.map((item, index) => (
                  <div key={item.food.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-semibold text-green-600 mr-3">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{item.food.name}</div>
                        <div className="text-sm text-gray-600">{item.quantity.toFixed(1)} servings</div>
                      </div>
                    </div>
                    <div className="text-sm text-green-600 font-semibold">
                      {Math.round(item.food.calories * item.quantity)} cal
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>No food logs yet. Start tracking your meals!</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Exercises */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold">Most Done Exercises</h3>
          </div>
          <div className="p-4 sm:p-6">
            {topExercises.length > 0 ? (
              <div className="space-y-3">
                {topExercises.map((item, index) => (
                  <div key={item.exercise.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600 mr-3">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{item.exercise.name}</div>
                        <div className="text-sm text-gray-600">{item.totalMinutes} minutes total</div>
                      </div>
                    </div>
                    <div className="text-sm text-blue-600 font-semibold">
                      {Math.round(item.exercise.caloriesPerMinute * item.totalMinutes)} cal
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>No exercise logs yet. Start your workout routine!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Achievement Section */}
  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-4 sm:p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Your Progress
            </h3>
            <p className="text-yellow-100">
              {getProgressMessage()}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{Math.round((activeDays / 7) * 100)}%</div>
            <div className="text-yellow-100 text-sm">Weekly consistency</div>
          </div>
        </div>
      </div>
    </div>
  );
};