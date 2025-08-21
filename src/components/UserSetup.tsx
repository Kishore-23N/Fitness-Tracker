import React, { useState } from 'react';
import { User } from '../types';
import { calculateBMI, calculateDailyCalories, getBMICategory } from '../utils/calculations';
import { User as UserIcon, Activity, Target, Users } from 'lucide-react';

interface UserSetupProps {
  onComplete: (user: User) => void;
}

export const UserSetup: React.FC<UserSetupProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'male' as 'male' | 'female',
    height: '',
    weight: '',
    activityLevel: 'moderately_active' as User['activityLevel'],
    goal: 'maintain_weight' as User['goal'],
    targetWeight: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    const height = parseFloat(formData.height);
    const weight = parseFloat(formData.weight);
    const bmi = calculateBMI(weight, height);
    
    const user: User = {
      id: Date.now().toString(),
      name: formData.name,
      age: parseInt(formData.age),
      gender: formData.gender,
      height,
      weight,
      activityLevel: formData.activityLevel,
      goal: formData.goal,
      targetWeight: formData.targetWeight ? parseFloat(formData.targetWeight) : undefined,
      bmi,
      dailyCalories: 0,
      createdAt: new Date().toISOString()
    };

    user.dailyCalories = calculateDailyCalories(user);
    onComplete(user);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.age && formData.gender;
      case 2:
        return formData.height && formData.weight;
      case 3:
        return formData.activityLevel;
      case 4:
        return formData.goal;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">FitTracker Setup</h1>
          <p className="text-gray-600">Let's personalize your fitness journey</p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <UserIcon className="w-5 h-5 mr-2" />
              Basic Information
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your age"
                min="16"
                max="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <div className="grid grid-cols-2 gap-3">
                {['male', 'female'].map((gender) => (
                  <button
                    key={gender}
                    type="button"
                    onClick={() => handleInputChange('gender', gender)}
                    className={`p-3 rounded-lg border transition-all ${
                      formData.gender === gender
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Physical Stats */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Physical Stats</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
              <input
                type="number"
                value={formData.height}
                onChange={(e) => handleInputChange('height', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your height in cm"
                min="100"
                max="250"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your weight in kg"
                min="30"
                max="300"
                step="0.1"
              />
            </div>

            {formData.height && formData.weight && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  Your BMI: <span className="font-semibold">
                    {calculateBMI(parseFloat(formData.weight), parseFloat(formData.height))}
                  </span>
                  <span className="ml-2">
                    ({getBMICategory(calculateBMI(parseFloat(formData.weight), parseFloat(formData.height)))})
                  </span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Activity Level */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Activity Level
            </h2>
            
            <div className="space-y-3">
              {[
                { value: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise' },
                { value: 'lightly_active', label: 'Lightly Active', desc: 'Light exercise 1-3 days/week' },
                { value: 'moderately_active', label: 'Moderately Active', desc: 'Moderate exercise 3-5 days/week' },
                { value: 'very_active', label: 'Very Active', desc: 'Hard exercise 6-7 days/week' },
                { value: 'extra_active', label: 'Extra Active', desc: 'Very hard exercise & physical job' }
              ].map((activity) => (
                <button
                  key={activity.value}
                  type="button"
                  onClick={() => handleInputChange('activityLevel', activity.value)}
                  className={`w-full p-4 rounded-lg border text-left transition-all ${
                    formData.activityLevel === activity.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                >
                  <div className="font-medium">{activity.label}</div>
                  <div className="text-sm text-gray-600">{activity.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Goals */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Fitness Goal
            </h2>
            
            <div className="space-y-3">
              {[
                { value: 'lose_weight', label: 'Lose Weight', desc: 'Create a calorie deficit' },
                { value: 'maintain_weight', label: 'Maintain Weight', desc: 'Stay at current weight' },
                { value: 'gain_weight', label: 'Gain Weight', desc: 'Healthy weight gain' },
                { value: 'build_muscle', label: 'Build Muscle', desc: 'Increase muscle mass' }
              ].map((goal) => (
                <button
                  key={goal.value}
                  type="button"
                  onClick={() => handleInputChange('goal', goal.value)}
                  className={`w-full p-4 rounded-lg border text-left transition-all ${
                    formData.goal === goal.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-300'
                  }`}
                >
                  <div className="font-medium">{goal.label}</div>
                  <div className="text-sm text-gray-600">{goal.desc}</div>
                </button>
              ))}
            </div>

            {(formData.goal === 'lose_weight' || formData.goal === 'gain_weight') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Weight (kg) - Optional
                </label>
                <input
                  type="number"
                  value={formData.targetWeight}
                  onChange={(e) => handleInputChange('targetWeight', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your target weight"
                  min="30"
                  max="300"
                  step="0.1"
                />
              </div>
            )}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
          
          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!isStepValid()}
              className="px-6 py-3 bg-green-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
            >
              Complete Setup
            </button>
          )}
        </div>
      </div>
    </div>
  );
};