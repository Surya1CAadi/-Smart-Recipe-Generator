import React, { useState } from 'react'

export default function RecipeCard({ recipe, onRate }) {
  const [userRating, setUserRating] = useState(recipe.userRating || 0)
  const [expanded, setExpanded] = useState(false)

  const avgRating = recipe.ratings?.length > 0 
    ? (recipe.ratings.reduce((a, b) => a + b, 0) / recipe.ratings.length).toFixed(1)
    : 0

  const matchScore = recipe.matchScore ? Math.round(recipe.matchScore * 100) : null

  const handleRate = (rating) => {
    setUserRating(rating)
    onRate(recipe._id, rating)
  }

  const StarRating = ({ rating, interactive = false, size = 'sm' }) => {
    return (
      <div className={`flex items-center space-x-1 ${size === 'lg' ? 'text-lg' : 'text-sm'}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && handleRate(star)}
            disabled={!interactive}
            className={`${
              star <= rating 
                ? 'text-yellow-400' 
                : 'text-gray-300'
            } ${interactive ? 'hover:text-yellow-500 cursor-pointer' : 'cursor-default'}`}
          >
            ★
          </button>
        ))}
      </div>
    )
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-900 flex-1 pr-4">
            {recipe.title}
          </h3>
          {matchScore && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {matchScore}% match
            </span>
          )}
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
            {recipe.difficulty}
          </span>
          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
            {recipe.cuisine}
          </span>
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
            ⏱️ {recipe.cookTimeMin} min
          </span>
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
            👥 {recipe.servings} serving{recipe.servings !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Dietary tags */}
        {recipe.dietary?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {recipe.dietary.map((diet) => (
              <span
                key={diet}
                className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs border border-green-200"
              >
                🌱 {diet}
              </span>
            ))}
          </div>
        )}

        {/* Ratings */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <StarRating rating={parseFloat(avgRating)} />
            <span className="text-sm text-gray-600">
              {avgRating > 0 ? `${avgRating} (${recipe.ratings?.length || 0})` : 'No ratings yet'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Rate:</span>
            <StarRating rating={userRating} interactive={true} />
          </div>
        </div>

        {/* Nutrition */}
        {recipe.nutrition && (
          <div className="grid grid-cols-2 gap-2 mb-4 p-3 bg-gray-50 rounded">
            <div className="text-xs">
              <span className="font-medium">Calories:</span> {recipe.nutrition.calories}
            </div>
            <div className="text-xs">
              <span className="font-medium">Protein:</span> {recipe.nutrition.protein_g}g
            </div>
            <div className="text-xs">
              <span className="font-medium">Carbs:</span> {recipe.nutrition.carbs_g}g
            </div>
            <div className="text-xs">
              <span className="font-medium">Fat:</span> {recipe.nutrition.fat_g}g
            </div>
          </div>
        )}

        {/* Expand/Collapse */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          {expanded ? '▼ Hide details' : '▶ Show ingredients & steps'}
        </button>

        {/* Expandable content */}
        {expanded && (
          <div className="mt-4 space-y-4 border-t pt-4">
            {/* Ingredients */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Ingredients:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                {recipe.ingredients?.map((ingredient, index) => (
                  <li key={index} className="flex justify-between">
                    <span>• {ingredient.name}</span>
                    <span className="text-gray-500">{ingredient.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Steps */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Instructions:</h4>
              <ol className="text-sm text-gray-700 space-y-2">
                {recipe.steps?.map((step, index) => (
                  <li key={index} className="flex">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium mr-3 mt-0.5 flex-shrink-0">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}