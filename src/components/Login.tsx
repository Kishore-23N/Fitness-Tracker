import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC<{ onLoginSuccess: () => void }> = ({ onLoginSuccess }) => {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    age: '',
    gender: 'male',
    height: '',
    weight: '',
    activityLevel: 'moderately_active',
    goal: 'maintain_weight',
    targetWeight: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await register({
          email: form.email,
          password: form.password,
          name: form.name,
          age: Number(form.age),
          gender: form.gender as 'male' | 'female',
          height: Number(form.height),
          weight: Number(form.weight),
          activityLevel: form.activityLevel as any,
          goal: form.goal as any,
          targetWeight: form.targetWeight ? Number(form.targetWeight) : undefined,
          bmi: 0, // Will be calculated in backend
          dailyCalories: 0 // Will be calculated in backend
        });
        setIsRegister(false); // After registration, show login form
        setError('Registration successful! Please log in.');
      } else {
        await login({ email: form.email, password: form.password });
        // Only call onLoginSuccess if login was successful
        setError('');
        onLoginSuccess();
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Authentication failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {isRegister ? 'Create Account' : 'Login to FitTracker'}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          {isRegister && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input type="number" name="age" value={form.age} onChange={handleChange} required min="13" max="120" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                <input type="number" name="height" value={form.height} onChange={handleChange} required min="100" max="250" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                <input type="number" name="weight" value={form.weight} onChange={handleChange} required min="30" max="300" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Activity Level</label>
                <select name="activityLevel" value={form.activityLevel} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="sedentary">Sedentary</option>
                  <option value="lightly_active">Lightly Active</option>
                  <option value="moderately_active">Moderately Active</option>
                  <option value="very_active">Very Active</option>
                  <option value="extra_active">Extra Active</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Goal</label>
                <select name="goal" value={form.goal} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="lose_weight">Lose Weight</option>
                  <option value="maintain_weight">Maintain Weight</option>
                  <option value="gain_weight">Gain Weight</option>
                  <option value="build_muscle">Build Muscle</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Weight (optional)</label>
                <input type="number" name="targetWeight" value={form.targetWeight} onChange={handleChange} min="30" max="300" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
            </>
          )}
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            {loading ? 'Processing...' : isRegister ? 'Register' : 'Login'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <button type="button" onClick={() => setIsRegister(!isRegister)} className="text-blue-600 hover:underline">
            {isRegister ? 'Already have an account? Login' : 'New user? Register here'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
