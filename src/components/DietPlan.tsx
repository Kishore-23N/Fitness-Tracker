import React, { useState } from 'react';
import { User } from '../types';
import { foodDatabase } from '../data/foodDatabase';
import { Apple, Clock, Info, Plus } from 'lucide-react';

interface DietPlanProps {
  user: User;
  onAddFood: (foodId: string, quantity: number, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => void;
}

export const DietPlan: React.FC<DietPlanProps> = ({ user, onAddFood }) => {
  const [selectedMeal, setSelectedMeal] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [selectedFood, setSelectedFood] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const getMealPlan = () => {
    const caloriesPerMeal = {
      breakfast: Math.round(user.dailyCalories * 0.25),
      lunch: Math.round(user.dailyCalories * 0.35),
      dinner: Math.round(user.dailyCalories * 0.30),
      snack: Math.round(user.dailyCalories * 0.10)
    };

    return {
      breakfast: {
        calories: caloriesPerMeal.breakfast,
        foods: [
          { ...foodDatabase.find(f => f.id === 'oatmeal')!, quantity: 1 },
          { ...foodDatabase.find(f => f.id === 'banana')!, quantity: 1 },
          { ...foodDatabase.find(f => f.id === 'blueberries')!, quantity: 0.5 }
        ]
      },
      lunch: {
        calories: caloriesPerMeal.lunch,
        foods: [
          { ...foodDatabase.find(f => f.id === 'chicken-breast')!, quantity: 1.2 },
          { ...foodDatabase.find(f => f.id === 'quinoa')!, quantity: 1 },
          { ...foodDatabase.find(f => f.id === 'broccoli')!, quantity: 1 },
          { ...foodDatabase.find(f => f.id === 'avocado')!, quantity: 0.3 }
        ]
      },
      dinner: {
        calories: caloriesPerMeal.dinner,
        foods: [
          { ...foodDatabase.find(f => f.id === 'salmon')!, quantity: 1.1 },
          { ...foodDatabase.find(f => f.id === 'sweet-potato')!, quantity: 1 },
          { ...foodDatabase.find(f => f.id === 'spinach')!, quantity: 1.5 }
        ]
      },
      snack: {
        calories: caloriesPerMeal.snack,
        foods: [
          { ...foodDatabase.find(f => f.id === 'greek-yogurt')!, quantity: 0.7 },
          { ...foodDatabase.find(f => f.id === 'apple')!, quantity: 0.5 }
        ]
      }
    };
  };

  const handleAddFood = () => {
    if (selectedFood) {
      onAddFood(selectedFood, quantity, selectedMeal);
      setSelectedFood(null);
      setQuantity(1);
    }
  };

  const mealPlan = getMealPlan();
  const meals = [
    { id: 'breakfast', name: 'Breakfast', icon: '🌅', time: '7:00 - 9:00 AM' },
    { id: 'lunch', name: 'Lunch', icon: '☀️', time: '12:00 - 2:00 PM' },
    { id: 'dinner', name: 'Dinner', icon: '🌙', time: '6:00 - 8:00 PM' },
    { id: 'snack', name: 'Snacks', icon: '🍎', time: 'Anytime' }
  ];

  return (
    <div className="space-y-6 px-2 sm:px-4 md:px-8 lg:px-0">
      {/* Header */}
  <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-4 sm:p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold mb-2 flex items-center">
          <Apple className="w-6 h-6 mr-2" />
          Personalized Diet Plan
        </h1>
        <p className="text-green-100">
          Daily target: {user.dailyCalories} calories | Goal: {user.goal.replace('_', ' ')}
        </p>
      </div>

      {/* Meal Selection */}
  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {meals.map((meal) => (
          <button
            key={meal.id}
            onClick={() => setSelectedMeal(meal.id as any)}
            className={`p-4 rounded-xl border-2 transition-all ${
              selectedMeal === meal.id
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-green-300'
            }`}
          >
            <div className="text-2xl mb-2">{meal.icon}</div>
            <div className="font-semibold">{meal.name}</div>
            <div className="text-xs text-gray-500 flex items-center justify-center">
              <Clock className="w-3 h-3 mr-1" />
              {meal.time}
            </div>
          </button>
        ))}
      </div>

      {/* Meal Plan Display */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100">
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <h3 className="text-xl font-semibold capitalize flex items-center">
            {selectedMeal} Plan
            <span className="ml-2 text-sm font-normal text-gray-500">
              (~{mealPlan[selectedMeal].calories} calories)
            </span>
          </h3>
        </div>

  <div className="p-4 sm:p-6">
          <div className="space-y-4">
            {mealPlan[selectedMeal].foods.map((food, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{food.name}</div>
                  <div className="text-sm text-gray-600">
                    {food.quantity} × {food.serving}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">
                    {Math.round(food.calories * food.quantity)} cal
                  </div>
                  <div className="text-xs text-gray-500">
                    P: {Math.round(food.protein * food.quantity)}g | 
                    C: {Math.round(food.carbs * food.quantity)}g | 
                    F: {Math.round(food.fat * food.quantity)}g
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total for meal */}
          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-green-800">Total {selectedMeal}</span>
              <span className="font-bold text-green-800">
                {Math.round(mealPlan[selectedMeal].foods.reduce((sum, food) => sum + (food.calories * food.quantity), 0))} calories
              </span>
            </div>
            <div className="text-sm text-green-700 mt-1">
              Protein: {Math.round(mealPlan[selectedMeal].foods.reduce((sum, food) => sum + (food.protein * food.quantity), 0))}g | 
              Carbs: {Math.round(mealPlan[selectedMeal].foods.reduce((sum, food) => sum + (food.carbs * food.quantity), 0))}g | 
              Fat: {Math.round(mealPlan[selectedMeal].foods.reduce((sum, food) => sum + (food.fat * food.quantity), 0))}g
            </div>
          </div>
        </div>
      </div>

      {/* Add Custom Food */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100">
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Add Food to {selectedMeal}
          </h3>
        </div>

        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Food
              </label>
              <select
                value={selectedFood || ''}
                onChange={(e) => setSelectedFood(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Choose a food...</option>
                {foodDatabase.map((food) => (
                  <option key={food.id} value={food.id}>
                    {food.name} ({food.calories} cal/{food.serving})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={quantity}
                onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleAddFood}
                disabled={!selectedFood}
                className="w-full py-3 bg-green-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
              >
                Add to {selectedMeal}
              </button>
            </div>
          </div>

          {selectedFood && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                <div>
                  <div className="font-medium text-blue-900">
                    {foodDatabase.find(f => f.id === selectedFood)?.name}
                  </div>
                  <div className="text-sm text-blue-700 mt-1">
                    {quantity} × {foodDatabase.find(f => f.id === selectedFood)?.serving} = {' '}
                    {Math.round((foodDatabase.find(f => f.id === selectedFood)?.calories || 0) * quantity)} calories
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nutrition Tips */}
  <div className="bg-blue-50 rounded-xl p-4 sm:p-6 border border-blue-200 shadow-md">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Nutrition Tips</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <div className="font-medium mb-1">🥗 Balanced Macros:</div>
            <div>Aim for 20-30% protein, 45-65% carbs, 20-35% fat</div>
          </div>
          <div>
            <div className="font-medium mb-1">💧 Stay Hydrated:</div>
            <div>Drink 8-10 glasses of water daily</div>
          </div>
          <div>
            <div className="font-medium mb-1">🌈 Eat Colorfully:</div>
            <div>Include variety of fruits and vegetables</div>
          </div>
          <div>
            <div className="font-medium mb-1">⏰ Meal Timing:</div>
            <div>Eat regular meals to maintain energy levels</div>
          </div>
        </div>
      </div>
    </div>
  );
};