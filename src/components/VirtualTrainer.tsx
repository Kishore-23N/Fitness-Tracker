import React, { useState, useEffect } from 'react';
import { User, DailyProgress } from '../types';
import { formatDate } from '../utils/calculations';
import { Bot, MessageCircle, Lightbulb, Target, Heart, Zap } from 'lucide-react';

interface VirtualTrainerProps {
  user: User;
  todayProgress: DailyProgress;
  weekProgress: DailyProgress[];
}

export const VirtualTrainer: React.FC<VirtualTrainerProps> = ({ 
  user, 
  todayProgress, 
  weekProgress 
}) => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  // Generate personalized messages based on user's progress
  const generateMessages = () => {
    const activeDays = weekProgress.filter(day => day.caloriesBurned > 0).length;
    const avgBurn = weekProgress.reduce((sum, day) => sum + day.caloriesBurned, 0) / 7;
    const calorieProgress = (todayProgress.caloriesConsumed / user.dailyCalories) * 100;
    
    const messages = [];

    // Welcome message
    messages.push({
      type: 'welcome',
      icon: '👋',
      title: `Hello ${user.name}!`,
      content: `I'm your virtual fitness trainer, here to support you on your ${user.goal.replace('_', ' ')} journey. Let's achieve greatness together!`,
      tips: []
    });

    // Progress-based messages
    if (activeDays >= 5) {
      messages.push({
        type: 'celebration',
        icon: '🎉',
        title: 'Outstanding Consistency!',
        content: `You've been active ${activeDays} days this week! Your dedication is truly inspiring. Keep up this amazing momentum!`,
        tips: [
          'Your consistency is building strong habits',
          'Consider adding variety to prevent boredom',
          'Remember to include rest days for recovery'
        ]
      });
    } else if (activeDays >= 3) {
      messages.push({
        type: 'encouragement',
        icon: '💪',
        title: 'Great Progress!',
        content: `${activeDays} active days is a solid foundation. Let's aim to add one more active day this week!`,
        tips: [
          'Try shorter 15-minute sessions on busy days',
          'Walking counts as exercise too',
          'Consistency beats intensity every time'
        ]
      });
    } else {
      messages.push({
        type: 'motivation',
        icon: '🌟',
        title: 'Let\'s Get Moving!',
        content: 'Every fitness journey starts with a single step. Today is a perfect day to add some movement to your routine!',
        tips: [
          'Start with just 10 minutes of activity',
          'Choose exercises you actually enjoy',
          'Set small, achievable daily goals'
        ]
      });
    }

    // Nutrition guidance
    if (calorieProgress < 80) {
      messages.push({
        type: 'nutrition',
        icon: '🍎',
        title: 'Fuel Your Body!',
        content: `You're at ${Math.round(calorieProgress)}% of your daily calorie goal. Your body needs proper fuel to perform at its best.`,
        tips: [
          'Include protein with every meal',
          'Don\'t skip meals, especially breakfast',
          'Focus on nutrient-dense whole foods'
        ]
      });
    } else if (calorieProgress > 120) {
      messages.push({
        type: 'balance',
        icon: '⚖️',
        title: 'Finding Balance',
        content: 'You\'ve exceeded your calorie goal today. Remember, balance is key to sustainable results.',
        tips: [
          'Listen to your body\'s hunger cues',
          'Consider increasing your activity level',
          'Focus on portion control tomorrow'
        ]
      });
    }

    // Goal-specific advice
    if (user.goal === 'lose_weight') {
      messages.push({
        type: 'goal',
        icon: '🎯',
        title: 'Weight Loss Strategy',
        content: 'Creating a sustainable calorie deficit through diet and exercise is your path to success.',
        tips: [
          'Aim for 1-2 pounds of weight loss per week',
          'Combine cardio with strength training',
          'Track your food intake honestly'
        ]
      });
    } else if (user.goal === 'build_muscle') {
      messages.push({
        type: 'goal',
        icon: '💪',
        title: 'Muscle Building Focus',
        content: 'Progressive overload and adequate protein are essential for building lean muscle mass.',
        tips: [
          'Aim for 1.6-2.2g protein per kg body weight',
          'Increase weights gradually each week',
          'Get 7-9 hours of quality sleep for recovery'
        ]
      });
    }

    // Weekly motivation
    const today = new Date().getDay();
    if (today === 1) { // Monday
      messages.push({
        type: 'weekly',
        icon: '🚀',
        title: 'New Week, New Opportunities!',
        content: 'Monday is the perfect day to set intentions for the week ahead. What will you accomplish?',
        tips: [
          'Plan your workouts for the week',
          'Prep healthy meals in advance',
          'Set 1-2 specific goals for this week'
        ]
      });
    } else if (today === 5) { // Friday
      messages.push({
        type: 'weekly',
        icon: '🏆',
        title: 'Strong Finish!',
        content: 'You\'ve made it to Friday! Finish the week strong and carry that momentum into the weekend.',
        tips: [
          'Reflect on this week\'s wins',
          'Plan active weekend activities',
          'Don\'t let weekends derail your progress'
        ]
      });
    }

    return messages;
  };

  const messages = generateMessages();

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTyping(true);
      setTimeout(() => {
        setCurrentMessage((prev) => (prev + 1) % messages.length);
        setIsTyping(false);
      }, 1000);
    }, 8000);

    return () => clearInterval(interval);
  }, [messages.length]);

  const getQuickTips = () => {
    const tips = [
      { icon: '💧', text: 'Drink water before every meal', category: 'Hydration' },
      { icon: '🚶', text: 'Take the stairs instead of elevator', category: 'Activity' },
      { icon: '😴', text: 'Aim for 7-9 hours of sleep nightly', category: 'Recovery' },
      { icon: '📱', text: 'Limit screen time before bed', category: 'Sleep' },
      { icon: '🥗', text: 'Fill half your plate with vegetables', category: 'Nutrition' },
      { icon: '⏰', text: 'Eat at consistent times daily', category: 'Routine' },
      { icon: '🧘', text: 'Practice 5 minutes of meditation', category: 'Mindfulness' },
      { icon: '👥', text: 'Find a workout buddy for motivation', category: 'Social' }
    ];

    return tips.sort(() => Math.random() - 0.5).slice(0, 4);
  };

  const quickTips = getQuickTips();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2 flex items-center">
          <Bot className="w-6 h-6 mr-2" />
          Virtual Trainer
        </h1>
        <p className="text-purple-100">
          Your personal AI fitness coach, available 24/7
        </p>
      </div>

      {/* Main Message */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6">
          <div className="flex items-start space-x-4">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold">
              <Bot className="w-6 h-6" />
            </div>
            
            <div className="flex-1">
              {isTyping ? (
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-gray-500 text-sm">Trainer is typing...</span>
                </div>
              ) : (
                <div>
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">{messages[currentMessage]?.icon}</span>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {messages[currentMessage]?.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-700 mb-4">
                    {messages[currentMessage]?.content}
                  </p>

                  {messages[currentMessage]?.tips && messages[currentMessage].tips.length > 0 && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                        <Lightbulb className="w-4 h-4 mr-2" />
                        Pro Tips:
                      </h4>
                      <ul className="space-y-1 text-sm text-blue-800">
                        {messages[currentMessage].tips.map((tip, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-blue-600 mr-2">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Message Navigation */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {messages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentMessage(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentMessage ? 'bg-purple-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-gray-500">
              {currentMessage + 1} of {messages.length}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-500" />
            Quick Daily Tips
          </h3>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-4">
            {quickTips.map((tip, index) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="text-2xl mr-3">{tip.icon}</span>
                <div>
                  <div className="font-medium text-gray-900">{tip.text}</div>
                  <div className="text-xs text-gray-500">{tip.category}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Motivational Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">
                {weekProgress.filter(day => day.caloriesBurned > 0).length}
              </div>
              <div className="text-green-100">Active Days This Week</div>
            </div>
            <Target className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">
                {Math.round(weekProgress.reduce((sum, day) => sum + day.caloriesBurned, 0))}
              </div>
              <div className="text-blue-100">Calories Burned</div>
            </div>
            <Heart className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">
                {Math.round((todayProgress.caloriesConsumed / user.dailyCalories) * 100)}%
              </div>
              <div className="text-orange-100">Today's Goal Progress</div>
            </div>
            <MessageCircle className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>
    </div>
  );
};