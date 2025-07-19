'use client';

import { useState, useEffect } from 'react';

interface LearningStep {
  id: number;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
}

interface LearningPath {
  title: string;
  description: string;
  steps: LearningStep[];
}

export default function Home() {
  const [skill, setSkill] = useState('');
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [animateTimeline, setAnimateTimeline] = useState(false);

  useEffect(() => {
    if (learningPath) {
      // Start timeline animation after data loads
      setTimeout(() => setAnimateTimeline(true), 300);
    }
  }, [learningPath]);

  const handleSubmit = async () => {
    if (!skill.trim()) {
      setError('Please enter a skill to learn');
      return;
    }

    setLoading(true);
    setError('');
    setAnimateTimeline(false);

    try {
      const response = await fetch('/api/generate-syllabus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skill: skill.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate learning path');
      }

      const data = await response.json();
      setLearningPath(data);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit();
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    const baseClasses = 'px-3 py-1 rounded-full text-sm font-medium';
    switch (difficulty) {
      case 'beginner':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'intermediate':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'advanced':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getBorderColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'border-green-400 bg-green-50';
      case 'intermediate':
        return 'border-yellow-400 bg-yellow-50';
      case 'advanced':
        return 'border-red-400 bg-red-50';
      default:
        return 'border-gray-400 bg-gray-50';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return '#10b981';
      case 'intermediate':
        return '#f59e0b';
      case 'advanced':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const renderLearningTimeline = () => {
    if (!learningPath) return null;

    const totalSteps = learningPath.steps.length + 2; // +2 for start and end

    return (
      <div className="relative">
        {/* Animated Timeline line */}
        <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-0.5 sm:w-1 bg-gray-200 rounded-full"></div>
        <div
          className={`absolute left-4 sm:left-8 top-0 w-0.5 sm:w-1 bg-gradient-to-b from-blue-400 via-purple-500 to-green-500 rounded-full transition-all duration-[3000ms] ease-out ${
            animateTimeline ? 'bottom-0' : 'bottom-full'
          }`}
        ></div>

        {/* Start node */}
        <div
          className={`flex items-center mb-6 sm:mb-8 transform transition-all duration-700 ease-out ${
            animateTimeline
              ? 'translate-x-0 opacity-100'
              : '-translate-x-12 opacity-0'
          }`}
          style={{ animationDelay: '500ms' }}
        >
          <div className="bg-blue-600 text-white rounded-full w-8 h-8 sm:w-12 md:w-16 sm:h-12 md:h-16 flex items-center justify-center font-bold text-sm sm:text-base md:text-lg shadow-lg z-10 transform transition-transform hover:scale-110 duration-300 flex-shrink-0">
            🚀
          </div>
          <div className="ml-3 sm:ml-4 md:ml-6 bg-blue-50 p-3 sm:p-4 rounded-lg border-l-2 sm:border-l-4 border-blue-500 transform transition-all hover:shadow-md hover:scale-[1.02] duration-300 flex-1 min-w-0">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-blue-800 mb-1">
              Start Learning
            </h3>
            <p className="text-sm sm:text-base text-blue-600 break-words">
              Begin your journey to master {skill}
            </p>
          </div>
        </div>

        {/* Learning steps with staggered animation */}
        {learningPath.steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex items-start mb-6 sm:mb-8 transform transition-all duration-700 ease-out ${
              animateTimeline
                ? 'translate-x-0 opacity-100'
                : '-translate-x-12 opacity-0'
            }`}
            style={{
              animationDelay: `${800 + index * 200}ms`,
              transitionDelay: `${800 + index * 200}ms`,
            }}
          >
            <div
              className="rounded-full w-8 h-8 sm:w-12 md:w-16 sm:h-12 md:h-16 flex items-center justify-center font-bold text-white shadow-lg z-10 text-sm sm:text-base md:text-lg transform transition-all hover:scale-110 duration-300 pulse-ring flex-shrink-0 mt-1"
              style={{
                backgroundColor: getDifficultyColor(step.difficulty),
                animationDelay: `${1000 + index * 200}ms`,
              }}
            >
              {index + 1}
            </div>
            <div
              className={`ml-3 sm:ml-4 md:ml-6 p-3 sm:p-4 md:p-6 rounded-lg border-l-2 sm:border-l-4 flex-1 min-w-0 transform transition-all hover:shadow-lg hover:scale-[1.01] duration-300 ${getBorderColor(
                step.difficulty
              )}`}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 sm:mb-3 gap-2 sm:gap-0">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 break-words pr-2">
                  {step.title}
                </h3>
                <div className="flex flex-wrap gap-1 sm:gap-2 flex-shrink-0">
                  <span className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transform transition-transform hover:scale-105 duration-200 whitespace-nowrap">
                    📅 {step.duration}
                  </span>
                  <span
                    className={`${getDifficultyBadge(step.difficulty)
                      .replace('px-3', 'px-2 sm:px-3')
                      .replace(
                        'text-sm',
                        'text-xs sm:text-sm'
                      )} transform transition-transform hover:scale-105 duration-200 whitespace-nowrap`}
                  >
                    📊 {step.difficulty}
                  </span>
                </div>
              </div>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed break-words">
                {step.description}
              </p>
            </div>
          </div>
        ))}

        {/* End node */}
        <div
          className={`flex items-center transform transition-all duration-700 ease-out ${
            animateTimeline
              ? 'translate-x-0 opacity-100'
              : '-translate-x-12 opacity-0'
          }`}
          style={{
            animationDelay: `${1000 + learningPath.steps.length * 200}ms`,
            transitionDelay: `${1000 + learningPath.steps.length * 200}ms`,
          }}
        >
          <div className="bg-green-600 text-white rounded-full w-8 h-8 sm:w-12 md:w-16 sm:h-12 md:h-16 flex items-center justify-center font-bold text-sm sm:text-base md:text-lg shadow-lg z-10 transform transition-transform hover:scale-110 duration-300 animate-pulse flex-shrink-0">
            🏆
          </div>
          <div className="ml-3 sm:ml-4 md:ml-6 bg-green-50 p-3 sm:p-4 rounded-lg border-l-2 sm:border-l-4 border-green-500 transform transition-all hover:shadow-md hover:scale-[1.02] duration-300 flex-1 min-w-0">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-green-800 mb-1">
              Master Level Achieved!
            </h3>
            <p className="text-sm sm:text-base text-green-600 break-words">
              Congratulations! You've completed your learning journey
            </p>
          </div>
        </div>

        {/* CSS for pulse ring animation */}
        <style jsx>{`
          .pulse-ring {
            position: relative;
          }
          .pulse-ring::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            border-radius: 50%;
            border: 1px solid currentColor;
            opacity: 0;
            animation: pulse-ring 2s infinite;
          }
          @media (min-width: 640px) {
            .pulse-ring::before {
              top: -4px;
              left: -4px;
              right: -4px;
              bottom: -4px;
              border: 2px solid currentColor;
            }
          }
          @keyframes pulse-ring {
            0% {
              transform: scale(1);
              opacity: 0.5;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.3;
            }
            100% {
              transform: scale(1.2);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-6xl">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 animate-fade-in-up px-2">
            🎯 Learning Path Generator
          </h1>
          <p
            className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up px-3 sm:px-0"
            style={{ animationDelay: '200ms' }}
          >
            Enter any skill you want to master and get a personalized
            step-by-step learning roadmap with visual timeline
          </p>
        </div>

        <div
          className="bg-white text-black rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-8 max-w-2xl mx-auto animate-fade-in-up"
          style={{ animationDelay: '400ms' }}
        >
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <input
              type="text"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="e.g., web development, cooking, guitar playing..."
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base sm:text-lg transition-all duration-200 focus:scale-[1.02]"
            />
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 sm:px-8 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-base sm:text-lg transition-all duration-200 transform hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="hidden sm:inline">Generating...</span>
                  <span className="sm:hidden">...</span>
                </span>
              ) : (
                <span>
                  <span className="hidden sm:inline">Create Path</span>
                  <span className="sm:hidden">Create</span>
                </span>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center animate-shake text-sm sm:text-base">
              {error}
            </div>
          )}
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border border-blue-400 opacity-20"></div>
            </div>
            <p className="text-gray-600 text-lg animate-pulse">
              Creating your learning path...
            </p>
          </div>
        )}

        {learningPath && (
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 animate-fade-in-up">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 animate-fade-in-up px-2">
                {learningPath.title}
              </h2>
              <p
                className="text-base sm:text-lg text-gray-600 animate-fade-in-up px-3 sm:px-0"
                style={{ animationDelay: '200ms' }}
              >
                {learningPath.description}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center animate-fade-in-up px-2">
                Your Learning Journey
              </h3>
              {renderLearningTimeline()}
            </div>

            <div
              className="animate-fade-in-up"
              style={{ animationDelay: '1000ms' }}
            >
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 px-2 sm:px-0">
                Quick Overview
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 px-2 sm:px-0">
                {learningPath.steps.map((step, index) => (
                  <div
                    key={step.id}
                    className="bg-white border-2 border-gray-200 rounded-lg p-3 sm:p-4 hover:border-blue-300 transition-all duration-300 transform hover:scale-105 hover:shadow-lg animate-fade-in-up"
                    style={{ animationDelay: `${1200 + index * 100}ms` }}
                  >
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <div
                        className="rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center font-bold text-white text-xs sm:text-sm transform transition-transform hover:scale-110 duration-200 flex-shrink-0"
                        style={{
                          backgroundColor: getDifficultyColor(step.difficulty),
                        }}
                      >
                        {index + 1}
                      </div>
                      <h4 className="font-bold text-gray-900 flex-1 text-sm sm:text-base leading-tight">
                        {step.title}
                      </h4>
                    </div>
                    <div className="flex flex-wrap gap-1 sm:gap-2 mb-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium transform transition-transform hover:scale-105 duration-200 whitespace-nowrap">
                        {step.duration}
                      </span>
                      <span
                        className={getDifficultyBadge(step.difficulty)
                          .replace('px-3 py-1', 'px-2 py-1')
                          .replace('text-sm', 'text-xs')}
                      >
                        {step.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed break-words">
                      {step.description.length > 120
                        ? `${step.description.substring(0, 120)}...`
                        : step.description.length > 80
                        ? `${step.description.substring(0, 80)}...`
                        : step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Global animations CSS */}
        <style jsx global>{`
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes fade-in {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          @keyframes shake {
            0%,
            100% {
              transform: translateX(0);
            }
            25% {
              transform: translateX(-5px);
            }
            75% {
              transform: translateX(5px);
            }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.6s ease-out forwards;
            opacity: 0;
          }
          .animate-fade-in {
            animation: fade-in 0.6s ease-out forwards;
          }
          .animate-shake {
            animation: shake 0.5s ease-in-out;
          }
        `}</style>
      </div>
    </div>
  );
}
