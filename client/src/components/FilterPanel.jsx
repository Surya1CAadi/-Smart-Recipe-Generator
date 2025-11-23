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
      dietary: []
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">🔍 Filters</h2>
        <button
          onClick={clearFilters}
          className="text-sm text-gray-600 hover:text-gray-800 underline"
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
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="">Any time</option>
            <option value="15">Under 15 min</option>
            <option value="30">Under 30 min</option>
            <option value="45">Under 45 min</option>
            <option value="60">Under 1 hour</option>
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
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 capitalize">
                  {option}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Active filters summary */}
      {(filters.difficulty || filters.cuisine || filters.maxCookTime || filters.dietary.length > 0) && (
        <div className="mt-4 p-3 bg-blue-50 rounded">
          <div className="text-xs text-blue-800 font-medium mb-1">Active filters:</div>
          <div className="flex flex-wrap gap-1">
            {filters.difficulty && (
              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                {filters.difficulty}
              </span>
            )}
            {filters.cuisine && (
              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                {filters.cuisine}
              </span>
            )}
            {filters.maxCookTime && (
              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                ≤{filters.maxCookTime}min
              </span>
            )}
            {filters.dietary.map(diet => (
              <span key={diet} className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                {diet}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}