import React, { useState, useEffect } from 'react';
import { User, DailyProgress, FoodLog, ExerciseLog } from './types';
import { formatDate } from './utils/calculations';
import { exerciseDatabase } from './data/exerciseDatabase';
import { foodDatabase } from './data/foodDatabase';
import { foodLogService } from './services/foodLogService';
import { exerciseLogService } from './services/exerciseLogService';
import { progressService } from './services/progressService';
import { useAuth } from './contexts/AuthContext';

// Components
import { UserSetup } from './components/UserSetup';
import Login from './components/Login';
import { Dashboard } from './components/Dashboard';
import { DietPlan } from './components/DietPlan';
import { ExercisePlan } from './components/ExercisePlan';
import { Progress } from './components/Progress';
import { VirtualTrainer } from './components/VirtualTrainer';

// Icons
import {
  Home,
  Apple,
  Dumbbell,
  TrendingUp,
  Bot,
  Settings,
  Menu,
  X
} from 'lucide-react';


function App() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dailyProgress, setDailyProgress] = useState<DailyProgress[]>([]);
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>([]);

  // Load user and all data from backend
  const fetchAllData = async (userId: string | undefined) => {
    if (!userId) return;
    try {
      console.log('Fetching data for user:', userId);
      const [progress, foods, exercises] = await Promise.all([
        progressService.getUserProgress(userId),
        foodLogService.getUserFoodLogs(userId),
        exerciseLogService.getUserExerciseLogs(userId)
      ]);
      console.log('Fetched progress:', progress);
      setDailyProgress(progress);
      setFoodLogs(foods);
      setExerciseLogs(exercises);
    } catch (err) {
      console.error('Error fetching data:', err);
      // handle error (show toast, etc.)
    }
  };

  useEffect(() => {
    if (user && user.id) {
      fetchAllData(user.id);
    }
  }, [user]);

  const addFoodLog = async (foodId: string, quantity: number, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    if (!user) return;
    const today = formatDate(new Date());
    await foodLogService.createFoodLog({
      userId: user.id,
      date: today,
      foodId,
      quantity,
      mealType
    });
    await fetchAllData(user.id);
  };

  const addExerciseLog = async (exerciseId: string, duration: number, intensity: 'low' | 'medium' | 'high') => {
    if (!user) return;
    const today = formatDate(new Date());
    const exercise = exerciseDatabase.find(e => e.id === exerciseId);
    if (!exercise) return;
    const intensityMultiplier = { low: 0.7, medium: 1.0, high: 1.3 };
    const caloriesBurned = Math.round(exercise.caloriesPerMinute * duration * intensityMultiplier[intensity]);
    await exerciseLogService.createExerciseLog({
      userId: user.id,
      date: today,
      exerciseId,
      duration,
      intensity,
      caloriesBurned
    });
    await fetchAllData(user.id);
  };

  // Calculate calories consumed from food logs
  const calculateCaloriesConsumed = (foodLogs: FoodLog[]): number => {
    return foodLogs.reduce((total, log) => {
      const food = foodDatabase.find(f => f.id === log.foodId);
      if (food) {
        return total + (food.calories * log.quantity);
      }
      return total;
    }, 0);
  };

  // Calculate calories burned from exercise logs
  const calculateCaloriesBurned = (exerciseLogs: ExerciseLog[]): number => {
    return exerciseLogs.reduce((total, log) => {
      return total + log.caloriesBurned;
    }, 0);
  };

  // Update daily progress with calculated calories
  const updateDailyProgress = async (userId: string, date: string, caloriesConsumed: number, caloriesBurned: number) => {
    try {
      // Try to get existing progress for today
      const existingProgress = await progressService.getProgressByDate(userId, date);

      if (existingProgress) {
        // Update existing progress
        await progressService.updateProgress(existingProgress._id, {
          caloriesConsumed,
          caloriesBurned
        });
      } else {
        // Create new progress entry
        await progressService.saveProgress({
          userId,
          date,
          caloriesConsumed,
          caloriesBurned
        });
      }
    } catch (error) {
      console.error('Error updating daily progress:', error);
    }
  };

  const resetUserData = () => {
    logout();
    setDailyProgress([]);
    setFoodLogs([]);
    setExerciseLogs([]);
  };

  // Calculate BMI correctly (weight in kg, height in cm)
  const calculateBMI = (weight: number, height: number) => {
    if (!weight || !height) return 0;
    const heightM = height / 100;
    return +(weight / (heightM * heightM)).toFixed(1);
  };

  if (!user || !user.id) {
    return <Login onLoginSuccess={() => {}} />;
  }


  const today = formatDate(new Date());
  const todayProgress = dailyProgress.find(p => p.date === today) || {
    date: today,
    caloriesConsumed: 0,
    caloriesBurned: 0,
    waterIntake: 0,
    mood: 'okay' as const
  };

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'diet', name: 'Diet Plan', icon: Apple },
    { id: 'exercise', name: 'Exercise', icon: Dumbbell },
    { id: 'progress', name: 'Progress', icon: TrendingUp },
    { id: 'trainer', name: 'Virtual Trainer', icon: Bot }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            user={user} 
            todayProgress={todayProgress}
            weekProgress={dailyProgress}
          />
        );
      case 'diet':
        return (
          <DietPlan 
            user={user} 
            onAddFood={addFoodLog}
          />
        );
      case 'exercise':
        return (
          <ExercisePlan 
            user={user} 
            onAddExercise={addExerciseLog}
          />
        );
      case 'progress':
        return (
          <Progress 
            user={user}
            weekProgress={dailyProgress}
            foodLogs={foodLogs}
            exerciseLogs={exerciseLogs}
          />
        );
      case 'trainer':
        return (
          <VirtualTrainer 
            user={user}
            todayProgress={todayProgress}
            weekProgress={dailyProgress}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-safe">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 lg:translate-x-0 lg:relative lg:z-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`} style={{ touchAction: 'manipulation' }}>
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center mr-3">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">FitTracker</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1 rounded-lg hover:bg-gray-100 focus:outline-none"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-2 sm:p-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center px-3 sm:px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  style={{ touchAction: 'manipulation' }}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </button>
              );
            })}
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <button
              onClick={resetUserData}
              className="w-full flex items-center px-3 sm:px-4 py-3 rounded-lg text-left text-gray-700 hover:bg-gray-100 transition-colors"
              style={{ touchAction: 'manipulation' }}
            >
              <Settings className="w-5 h-5 mr-3" />
              Reset Data
            </button>
          </div>
        </nav>

        {/* User Info + Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center mb-2">
            <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
              <span className="text-green-600 font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="font-medium text-gray-900">{user.name}</div>
              <div className="text-sm text-gray-500">BMI: {calculateBMI(user.weight, user.height)}</div>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full mt-2 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
            style={{ touchAction: 'manipulation' }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Mobile header */}
        <header className="lg:hidden bg-white shadow-sm border-b border-gray-200 p-2 sm:p-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none"
              aria-label="Open sidebar"
              style={{ touchAction: 'manipulation' }}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">
              {menuItems.find(item => item.id === activeTab)?.name}
            </h1>
            <div className="w-10" /> {/* Spacer */}
          </div>
        </header>

        {/* Page content */}
        <main className="p-2 sm:p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;

/scripts": {
  "postinstall": "npm rebuild bcrypt"
}