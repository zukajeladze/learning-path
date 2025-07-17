'use client';

import { useState } from 'react';

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

  const handleSubmit = async () => {
    if (!skill.trim()) {
      setError('Please enter a skill to learn');
      return;
    }

    setLoading(true);
    setError('');

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

    return (
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 via-purple-500 to-green-500"></div>

        {/* Start node */}
        <div className="flex items-center mb-8">
          <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-lg shadow-lg z-10">
            🚀
          </div>
          <div className="ml-6 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <h3 className="text-xl font-bold text-blue-800">Start Learning</h3>
            <p className="text-blue-600">
              Begin your journey to master {skill}
            </p>
          </div>
        </div>

        {/* Learning steps */}
        {learningPath.steps.map((step, index) => (
          <div key={step.id} className="flex items-center mb-8">
            <div
              className="rounded-full w-16 h-16 flex items-center justify-center font-bold text-white shadow-lg z-10 text-lg"
              style={{ backgroundColor: getDifficultyColor(step.difficulty) }}
            >
              {index + 1}
            </div>
            <div
              className={`ml-6 p-6 rounded-lg border-l-4 flex-1 ${getBorderColor(
                step.difficulty
              )}`}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-gray-800">
                  {step.title}
                </h3>
                <div className="flex gap-2">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    📅 {step.duration}
                  </span>
                  <span className={getDifficultyBadge(step.difficulty)}>
                    📊 {step.difficulty}
                  </span>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}

        {/* End node */}
        <div className="flex items-center">
          <div className="bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-lg shadow-lg z-10">
            🏆
          </div>
          <div className="ml-6 bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
            <h3 className="text-xl font-bold text-green-800">
              Master Level Achieved!
            </h3>
            <p className="text-green-600">
              Congratulations! You've completed your learning journey
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🎯 Learning Path Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Enter any skill you want to master and get a personalized
            step-by-step learning roadmap with visual timeline
          </p>
        </div>

        <div className="bg-white text-black rounded-2xl shadow-lg p-8 mb-8 max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="e.g., web development, cooking, guitar playing..."
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-lg"
            />
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg transition-colors"
            >
              {loading ? 'Generating...' : 'Create Path'}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
              {error}
            </div>
          )}
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 text-lg">
              Creating your learning path...
            </p>
          </div>
        )}

        {learningPath && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                {learningPath.title}
              </h2>
              <p className="text-lg text-gray-600">
                {learningPath.description}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-8 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Your Learning Journey
              </h3>
              {renderLearningTimeline()}
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Quick Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {learningPath.steps.map((step, index) => (
                  <div
                    key={step.id}
                    className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="rounded-full w-8 h-8 flex items-center justify-center font-bold text-white text-sm"
                        style={{
                          backgroundColor: getDifficultyColor(step.difficulty),
                        }}
                      >
                        {index + 1}
                      </div>
                      <h4 className="font-bold text-gray-900 flex-1">
                        {step.title}
                      </h4>
                    </div>
                    <div className="flex gap-2 mb-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
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
                    <p className="text-gray-600 text-sm">
                      {step.description.substring(0, 100)}...
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
