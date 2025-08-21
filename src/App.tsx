import React, { useState, useEffect } from 'react';
import { User, DailyProgress, FoodLog, ExerciseLog } from './types';
import { formatDate, getWeekDates } from './utils/calculations';
import { foodDatabase } from './data/foodDatabase';
import { exerciseDatabase } from './data/exerciseDatabase';

// Components
import { UserSetup } from './components/UserSetup';
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
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Progress data
  const [dailyProgress, setDailyProgress] = useState<DailyProgress[]>([]);
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>([]);

  // Load data on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('fittracker_user');
    const savedProgress = localStorage.getItem('fittracker_progress');
    const savedFoodLogs = localStorage.getItem('fittracker_food_logs');
    const savedExerciseLogs = localStorage.getItem('fittracker_exercise_logs');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    if (savedProgress) {
      setDailyProgress(JSON.parse(savedProgress));
    } else {
      // Initialize with empty week data
      const weekDates = getWeekDates();
      const initialProgress = weekDates.map(date => ({
        date,
        caloriesConsumed: 0,
        caloriesBurned: 0,
        waterIntake: 0,
        mood: 'okay' as const
      }));
      setDailyProgress(initialProgress);
    }

    if (savedFoodLogs) {
      setFoodLogs(JSON.parse(savedFoodLogs));
    }

    if (savedExerciseLogs) {
      setExerciseLogs(JSON.parse(savedExerciseLogs));
    }
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('fittracker_user', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('fittracker_progress', JSON.stringify(dailyProgress));
  }, [dailyProgress]);

  useEffect(() => {
    localStorage.setItem('fittracker_food_logs', JSON.stringify(foodLogs));
  }, [foodLogs]);

  useEffect(() => {
    localStorage.setItem('fittracker_exercise_logs', JSON.stringify(exerciseLogs));
  }, [exerciseLogs]);

  const handleUserSetup = (newUser: User) => {
    setUser(newUser);
    setActiveTab('dashboard');
  };

  const addFoodLog = (foodId: string, quantity: number, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    const today = formatDate(new Date());
    const food = foodDatabase.find(f => f.id === foodId);
    
    if (!food) return;

    const newLog: FoodLog = {
      id: Date.now().toString(),
      date: today,
      foodId,
      quantity,
      mealType
    };

    setFoodLogs(prev => [...prev, newLog]);

    // Update daily progress
    const caloriesAdded = food.calories * quantity;
    setDailyProgress(prev => prev.map(day => 
      day.date === today 
        ? { ...day, caloriesConsumed: day.caloriesConsumed + caloriesAdded }
        : day
    ));
  };

  const addExerciseLog = (exerciseId: string, duration: number, intensity: 'low' | 'medium' | 'high') => {
    const today = formatDate(new Date());
    const exercise = exerciseDatabase.find(e => e.id === exerciseId);
    
    if (!exercise) return;

    const intensityMultiplier = { low: 0.7, medium: 1.0, high: 1.3 };
    const caloriesBurned = Math.round(exercise.caloriesPerMinute * duration * intensityMultiplier[intensity]);

    const newLog: ExerciseLog = {
      id: Date.now().toString(),
      date: today,
      exerciseId,
      duration,
      intensity,
      caloriesBurned
    };

    setExerciseLogs(prev => [...prev, newLog]);

    // Update daily progress
    setDailyProgress(prev => prev.map(day => 
      day.date === today 
        ? { ...day, caloriesBurned: day.caloriesBurned + caloriesBurned }
        : day
    ));
  };

  const resetUserData = () => {
    localStorage.removeItem('fittracker_user');
    localStorage.removeItem('fittracker_progress');
    localStorage.removeItem('fittracker_food_logs');
    localStorage.removeItem('fittracker_exercise_logs');
    setUser(null);
    setDailyProgress([]);
    setFoodLogs([]);
    setExerciseLogs([]);
  };

  if (!user) {
    return <UserSetup onComplete={handleUserSetup} />;
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
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 lg:translate-x-0 lg:relative lg:z-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center mr-3">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">FitTracker</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4">
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
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
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
              className="w-full flex items-center px-4 py-3 rounded-lg text-left text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Settings className="w-5 h-5 mr-3" />
              Reset Data
            </button>
          </div>
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center">
            <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
              <span className="text-green-600 font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="font-medium text-gray-900">{user.name}</div>
              <div className="text-sm text-gray-500">BMI: {user.bmi}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Mobile header */}
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">
              {menuItems.find(item => item.id === activeTab)?.name}
            </h1>
            <div className="w-10" /> {/* Spacer */}
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;