import React, { useState } from 'react';
import { User } from '../types';
import { exerciseDatabase } from '../data/exerciseDatabase';
import { Dumbbell, Clock, Target, Zap, Plus, Info } from 'lucide-react';

interface ExercisePlanProps {
  user: User;
  onAddExercise: (exerciseId: string, duration: number, intensity: 'low' | 'medium' | 'high') => void;
}

export const ExercisePlan: React.FC<ExercisePlanProps> = ({ user, onAddExercise }) => {
  const [selectedCategory, setSelectedCategory] = useState<'cardio' | 'strength' | 'flexibility' | 'sports'>('cardio');
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [duration, setDuration] = useState(30);
  const [intensity, setIntensity] = useState<'low' | 'medium' | 'high'>('medium');

  const getWeeklyPlan = () => {
    const plans = {
      lose_weight: {
        cardio: 4,
        strength: 2,
        flexibility: 1,
        totalMinutes: 300
      },
      maintain_weight: {
        cardio: 3,
        strength: 2,
        flexibility: 2,
        totalMinutes: 250
      },
      gain_weight: {
        cardio: 2,
        strength: 4,
        flexibility: 1,
        totalMinutes: 280
      },
      build_muscle: {
        cardio: 2,
        strength: 5,
        flexibility: 1,
        totalMinutes: 320
      }
    };

    return plans[user.goal];
  };

  const getDailyRoutine = () => {
    const routines = {
      cardio: [
        { ...exerciseDatabase.find(e => e.id === 'running')!, duration: 30 },
        { ...exerciseDatabase.find(e => e.id === 'cycling')!, duration: 45 },
        { ...exerciseDatabase.find(e => e.id === 'jump-rope')!, duration: 15 }
      ],
      strength: [
        { ...exerciseDatabase.find(e => e.id === 'push-ups')!, duration: 15 },
        { ...exerciseDatabase.find(e => e.id === 'squats')!, duration: 15 },
        { ...exerciseDatabase.find(e => e.id === 'deadlifts')!, duration: 20 },
        { ...exerciseDatabase.find(e => e.id === 'bench-press')!, duration: 20 }
      ],
      flexibility: [
        { ...exerciseDatabase.find(e => e.id === 'yoga')!, duration: 30 },
        { ...exerciseDatabase.find(e => e.id === 'stretching')!, duration: 15 },
        { ...exerciseDatabase.find(e => e.id === 'pilates')!, duration: 30 }
      ],
      sports: [
        { ...exerciseDatabase.find(e => e.id === 'swimming')!, duration: 45 }
      ]
    };

    return routines[selectedCategory];
  };

  const handleAddExercise = () => {
    if (selectedExercise) {
      onAddExercise(selectedExercise, duration, intensity);
      setSelectedExercise(null);
      setDuration(30);
      setIntensity('medium');
    }
  };

  const weeklyPlan = getWeeklyPlan();
  const dailyRoutine = getDailyRoutine();

  const categories = [
    { id: 'cardio', name: 'Cardio', icon: '🏃', color: 'red' },
    { id: 'strength', name: 'Strength', icon: '💪', color: 'blue' },
    { id: 'flexibility', name: 'Flexibility', icon: '🧘', color: 'green' },
    { id: 'sports', name: 'Sports', icon: '⚽', color: 'purple' }
  ];

  const intensityMultiplier = { low: 0.7, medium: 1.0, high: 1.3 };

  return (
    <div className="space-y-6 px-2 sm:px-4 md:px-8 lg:px-0">
      {/* Header */}
  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 sm:p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold mb-2 flex items-center">
          <Dumbbell className="w-6 h-6 mr-2" />
          Personalized Exercise Plan
        </h1>
        <p className="text-blue-100">
          Weekly target: {weeklyPlan.totalMinutes} minutes | Goal: {user.goal.replace('_', ' ')}
        </p>
      </div>

      {/* Weekly Overview */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100">
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <h3 className="text-xl font-semibold">Weekly Plan Overview</h3>
        </div>
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <div key={category.id} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-2">{category.icon}</div>
                <div className="font-semibold">{category.name}</div>
                <div className="text-sm text-gray-600">
                  {weeklyPlan[category.id as keyof typeof weeklyPlan]} days/week
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Selection */}
  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id as any)}
            className={`p-4 rounded-xl border-2 transition-all ${
              selectedCategory === category.id
                ? `border-${category.color}-500 bg-${category.color}-50`
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="text-2xl mb-2">{category.icon}</div>
            <div className="font-semibold">{category.name}</div>
            <div className="text-xs text-gray-500">
              {exerciseDatabase.filter(e => e.category === category.id).length} exercises
            </div>
          </button>
        ))}
      </div>

      {/* Exercise Routine Display */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100">
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <h3 className="text-xl font-semibold capitalize flex items-center">
            {selectedCategory} Routine
            <span className="ml-2 text-sm font-normal text-gray-500">
              (Recommended for your goal)
            </span>
          </h3>
        </div>

  <div className="p-4 sm:p-6">
          <div className="space-y-4">
            {dailyRoutine.map((exercise, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{exercise.name}</div>
                  <div className="text-sm text-gray-600">
                    <Clock className="w-4 h-4 inline mr-1" />
                    {exercise.duration} minutes
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Difficulty: {exercise.difficulty} | 
                    Equipment: {exercise.equipment.length > 0 ? exercise.equipment.join(', ') : 'None'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-blue-600">
                    ~{Math.round(exercise.caloriesPerMinute * exercise.duration)} cal
                  </div>
                  <div className="text-xs text-gray-500">
                    {exercise.muscleGroups.join(', ')}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total for routine */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-blue-800">Total Session</span>
              <span className="font-bold text-blue-800">
                ~{Math.round(dailyRoutine.reduce((sum, exercise) => sum + (exercise.caloriesPerMinute * exercise.duration), 0))} calories
              </span>
            </div>
            <div className="text-sm text-blue-700 mt-1">
              Duration: {dailyRoutine.reduce((sum, exercise) => sum + exercise.duration, 0)} minutes
            </div>
          </div>
        </div>
      </div>

      {/* Add Custom Exercise */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100">
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Log Exercise Session
          </h3>
        </div>

        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Exercise
              </label>
              <select
                value={selectedExercise || ''}
                onChange={(e) => setSelectedExercise(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose an exercise...</option>
                {exerciseDatabase
                  .filter(exercise => exercise.category === selectedCategory)
                  .map((exercise) => (
                    <option key={exercise.id} value={exercise.id}>
                      {exercise.name} ({exercise.caloriesPerMinute} cal/min)
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="180"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 30)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Intensity
              </label>
              <select
                value={intensity}
                onChange={(e) => setIntensity(e.target.value as any)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Low (70%)</option>
                <option value="medium">Medium (100%)</option>
                <option value="high">High (130%)</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleAddExercise}
                disabled={!selectedExercise}
                className="w-full py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
              >
                Log Exercise
              </button>
            </div>
          </div>

          {selectedExercise && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                <div>
                  <div className="font-medium text-green-900">
                    {exerciseDatabase.find(e => e.id === selectedExercise)?.name}
                  </div>
                  <div className="text-sm text-green-700 mt-1">
                    {duration} minutes at {intensity} intensity = {' '}
                    {Math.round(
                      (exerciseDatabase.find(e => e.id === selectedExercise)?.caloriesPerMinute || 0) * 
                      duration * 
                      intensityMultiplier[intensity]
                    )} calories burned
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Exercise Tips */}
  <div className="bg-orange-50 rounded-xl p-4 sm:p-6 border border-orange-200 shadow-md">
        <h3 className="text-lg font-semibold text-orange-900 mb-3 flex items-center">
          <Target className="w-5 h-5 mr-2" />
          Exercise Tips
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-orange-800">
          <div>
            <div className="font-medium mb-1">🏃 Cardio Benefits:</div>
            <div>Improves heart health and burns calories efficiently</div>
          </div>
          <div>
            <div className="font-medium mb-1">💪 Strength Training:</div>
            <div>Builds muscle mass and boosts metabolism</div>
          </div>
          <div>
            <div className="font-medium mb-1">🧘 Flexibility Work:</div>
            <div>Prevents injury and improves recovery</div>
          </div>
          <div>
            <div className="font-medium mb-1">⚡ Progressive Overload:</div>
            <div>Gradually increase intensity for better results</div>
          </div>
        </div>
      </div>
    </div>
  );
};