import React from 'react'

export default function FilterPanel({ filters, onFiltersChange }) {
  const difficulties = ['easy', 'medium', 'hard']
  const cuisines = ['Italian', 'Indian', 'Asian', 'Mexican', 'Mediterranean', 'American', 'Thai', 'German']
  const dietaryOptions = ['vegetarian', 'vegan', 'gluten-free', 'dairy-free']

  const updateFilter = (key, value) => {
    onFiltersChange(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const toggleDietary = (option) => {
    onFiltersChange(prev => ({
      ...prev,
      dietary: prev.dietary.includes(option)
        ? prev.dietary.filter(d => d !== option)
        : [...prev.dietary, option]
    }))
  }

  const clearFilters = () => {
    onFiltersChange({
      difficulty: '',
      cuisine: '',
      maxCookTime: '',
      servings: '',
      strictMatch: filters.strictMatch || false, // Preserve strictMatch setting
      dietary: []
    })
  }

  return (
    <div className="bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30 rounded-xl shadow-lg border-2 border-transparent p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-50"></div>
      <div className="relative z-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center">
          <span className="text-2xl mr-2 animate-spin" style={{animationDuration: '3s'}}>🔍</span> Filters
        </h2>
        <button
          onClick={clearFilters}
          className="text-sm text-purple-600 hover:text-purple-800 underline font-medium transition-colors"
        >
          Clear all
        </button>
      </div>

      <div className="space-y-4">
        {/* Difficulty */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty
          </label>
          <select
            value={filters.difficulty}
            onChange={(e) => updateFilter('difficulty', e.target.value)}
            className="w-full px-3 py-2 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-gradient-to-r from-white to-purple-50 transition-all"
          >
            <option value="">Any difficulty</option>
            {difficulties.map(diff => (
              <option key={diff} value={diff}>
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Cuisine */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cuisine
          </label>
          <select
            value={filters.cuisine}
            onChange={(e) => updateFilter('cuisine', e.target.value)}
            className="w-full px-3 py-2 border-2 border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-gradient-to-r from-white to-indigo-50 transition-all"
          >
            <option value="">Any cuisine</option>
            {cuisines.map(cuisine => (
              <option key={cuisine} value={cuisine}>
                {cuisine}
              </option>
            ))}
          </select>
        </div>

        {/* Max Cook Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max cooking time
          </label>
          <select
            value={filters.maxCookTime}
            onChange={(e) => updateFilter('maxCookTime', e.target.value)}
            className="w-full px-3 py-2 border-2 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none bg-gradient-to-r from-white to-pink-50 transition-all"
          >
            <option value="">Any time</option>
            <option value="15">Under 15 min</option>
            <option value="30">Under 30 min</option>
            <option value="45">Under 45 min</option>
            <option value="60">Under 1 hour</option>
          </select>
        </div>

        {/* Serving Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Serving size
          </label>
          <select
            value={filters.servings || ''}
            onChange={(e) => updateFilter('servings', e.target.value)}
            className="w-full px-3 py-2 border-2 border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-gradient-to-r from-white to-teal-50 transition-all"
          >
            <option value="">Any serving size</option>
            <option value="1">1 serving</option>
            <option value="2">2 servings</option>
            <option value="3">3 servings</option>
            <option value="4">4+ servings</option>
          </select>
        </div>

        {/* Dietary Restrictions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dietary preferences
          </label>
          <div className="space-y-2">
            {dietaryOptions.map(option => (
              <label key={option} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.dietary.includes(option)}
                  onChange={() => toggleDietary(option)}
                  className="h-4 w-4 text-purple-600 border-purple-300 rounded focus:ring-purple-500 focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-700 capitalize">
                  {option}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Strict Matching */}
        <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.strictMatch || false}
              onChange={(e) => updateFilter('strictMatch', e.target.checked)}
              className="h-4 w-4 text-orange-600 border-orange-300 rounded focus:ring-orange-500 focus:ring-2"
            />
            <span className="ml-2 text-sm text-orange-800 font-medium">
              🎯 Strict matching (recipes must contain ALL ingredients)
            </span>
          </label>
          <p className="text-xs text-orange-600 mt-1 ml-6">
            When enabled, only recipes containing all your ingredients will be shown
          </p>
        </div>
      </div>

      {/* Active filters summary */}
      {(filters.difficulty || filters.cuisine || filters.maxCookTime || filters.servings || filters.dietary.length > 0) && (
        <div className="mt-4 p-4 bg-gradient-to-r from-violet-100 to-purple-100 rounded-lg border border-violet-200 shadow-sm">
          <div className="text-sm text-violet-800 font-semibold mb-2 flex items-center gap-2">
            <span className="animate-pulse">✨</span> Active filters:
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.difficulty && (
              <span className="inline-block px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full text-xs font-medium shadow-md">
                {filters.difficulty}
              </span>
            )}
            {filters.cuisine && (
              <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full text-xs font-medium shadow-md">
                {filters.cuisine}
              </span>
            )}
            {filters.maxCookTime && (
              <span className="inline-block px-3 py-1 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-full text-xs font-medium shadow-md">
                ≤{filters.maxCookTime}min
              </span>
            )}
            {filters.servings && (
              <span className="inline-block px-3 py-1 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full text-xs font-medium shadow-md">
                {filters.servings === '4' ? '4+ servings' : `${filters.servings} serving${filters.servings !== '1' ? 's' : ''}`}
              </span>
            )}
            {filters.dietary.map(diet => (
              <span key={diet} className="inline-block px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full text-xs font-medium shadow-md">
                {diet}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
    </div>
  )
}