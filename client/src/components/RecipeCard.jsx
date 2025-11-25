import React, { useState, useEffect } from 'react'

export default function RecipeCard({ recipe, onRate, onToggleFavorite, isFavorite, user }) {
  const [userRating, setUserRating] = useState(recipe.userRating || 0)
  const [expanded, setExpanded] = useState(false)
  const [servingMultiplier, setServingMultiplier] = useState(1)
  const [showSubstitutions, setShowSubstitutions] = useState(false)
  const [imgError, setImgError] = useState(false)

  // Reset all states when recipe changes
  useEffect(() => {
    setExpanded(false)
    setServingMultiplier(1)
    setShowSubstitutions(false)
    setUserRating(recipe.userRating || 0)
  }, [recipe._id, recipe.userRating])

  const [localFavorite, setLocalFavorite] = useState(isFavorite)

  useEffect(() => {
    setLocalFavorite(isFavorite)
  }, [isFavorite])

  // Always show average rating and count from all ratings
  const avgRating = recipe.ratings && recipe.ratings.length > 0
    ? (recipe.ratings.reduce((a, b) => a + b, 0) / recipe.ratings.length).toFixed(1)
    : 0;

  const matchScore = recipe.matchScore ? Math.round(recipe.matchScore * 100) : null

  const adjustedServings = recipe.servings * servingMultiplier
  
  const adjustQuantity = (quantity, multiplier) => {
    if (!quantity) return quantity
    
    // Extract number and unit
    const match = quantity.match(/^(\d+(?:\.\d+)?)\s*(.*)$/)
    if (match) {
      const number = parseFloat(match[1])
      const unit = match[2]
      const adjusted = (number * multiplier).toFixed(number % 1 === 0 ? 0 : 1)
      return `${adjusted}${unit ? ' ' + unit : ''}`
    }
    return quantity
  }
  
  // Ingredient substitutions
  const getSubstitutions = (ingredientName) => {
    const substitutions = {
      'chicken': ['turkey', 'tofu', 'paneer'],
      'beef': ['chicken', 'pork', 'mushrooms'],
      'butter': ['olive oil', 'coconut oil', 'margarine'],
      'milk': ['almond milk', 'soy milk', 'coconut milk'],
      'pasta': ['rice', 'quinoa', 'zucchini noodles'],
      'rice': ['quinoa', 'cauliflower rice', 'pasta'],
      'cream': ['coconut cream', 'cashew cream', 'milk'],
      'cheese': ['nutritional yeast', 'cashew cheese', 'tofu'],
      'egg': ['flax egg', 'chia egg', 'applesauce'],
      'flour': ['almond flour', 'coconut flour', 'oat flour'],
      'sugar': ['honey', 'maple syrup', 'stevia'],
      'tomato': ['bell pepper', 'zucchini', 'eggplant'],
      'onion': ['shallots', 'leeks', 'garlic'],
      'garlic': ['onion powder', 'shallots', 'ginger']
    }
    
    const key = Object.keys(substitutions).find(key => 
      ingredientName.toLowerCase().includes(key)
    )
    
    return key ? substitutions[key] : null
  }

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
            onClick={(e) => {
              if (interactive) {
                e.preventDefault()
                e.stopPropagation()
                handleRate(star)
              }
            }}
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
      case 'easy': return 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-md'
      case 'medium': return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-md'
      case 'hard': return 'bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-md'
      default: return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-md'
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-transparent bg-gradient-to-br from-white to-gray-50 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 overflow-hidden relative group" data-recipe-id={recipe._id}>
      {/* Favorite button (top-right) */}
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          if (!user) return;
          if (onToggleFavorite && !localFavorite) {
            onToggleFavorite(recipe._id)
            setLocalFavorite(true)
          } else if (onToggleFavorite && localFavorite) {
            onToggleFavorite(recipe._id)
            setLocalFavorite(false)
          }
        }}
        disabled={!user}
        className={`absolute right-3 top-3 z-20 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-transform transform hover:scale-105 ${localFavorite ? 'bg-pink-500 text-white' : 'bg-white/90 text-pink-500'} ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label={localFavorite ? 'Remove favorite' : 'Add to favorites'}
      >
        {localFavorite ? '❤️' : '🤍'}
      </button>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative p-3 sm:p-4 xl:p-6 h-[520px] sm:h-[580px] xl:h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex-1">
            {recipe.title}
          </h3>
          <div className="flex items-center gap-2">
            {recipe.favorites > 0 && (
              <span className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full">
                {recipe.favorites} ❤️
              </span>
            )}
            {matchScore && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full self-start">
                {matchScore}% match
              </span>
            )}
          </div>
        </div>

        {/* Content Area - switches between summary and details */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!expanded ? (
            /* Summary View */
            <div className="flex flex-col h-full">
              {/* Recipe Image */}
              {recipe.image && !imgError ? (
                <div className="mb-4 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-28 sm:h-32 xl:h-36 object-cover hover:scale-105 transition-transform duration-200"
                    style={{ objectPosition: 'center' }}
                    onError={() => setImgError(true)}
                  />
                </div>
              ) : (
                <div className="mb-4 rounded-lg overflow-hidden">
                  <div className="w-full h-28 sm:h-32 xl:h-36 bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="text-center text-white relative z-10">
                      <div className="text-xl sm:text-2xl mb-2">🍽️</div>
                      <div className="text-xs sm:text-sm font-medium px-2">{recipe.title}</div>
                    </div>
                  </div>
                </div>
              )}

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
                  👥 {adjustedServings} serving{adjustedServings !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Serving Size Adjuster */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 p-3 bg-gray-50 rounded gap-2">
                <span className="text-sm font-medium text-gray-700">Adjust serving size:</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setServingMultiplier(Math.max(0.5, servingMultiplier - 0.5))
                    }}
                    className="w-8 h-8 bg-white border rounded-full flex items-center justify-center hover:bg-gray-100 text-sm"
                    disabled={servingMultiplier <= 0.5}
                  >
                    -
                  </button>
                  <span className="px-3 py-1 bg-white border rounded text-sm min-w-[60px] text-center">
                    {servingMultiplier}x
                  </span>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setServingMultiplier(servingMultiplier + 0.5)
                    }}
                    className="w-8 h-8 bg-white border rounded-full flex items-center justify-center hover:bg-gray-100 text-sm"
                    disabled={servingMultiplier >= 4}
                  >
                    +
                  </button>
                </div>
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
                  <StarRating rating={userRating} interactive={!!user} />
                </div>
              </div>

              {/* Nutrition */}
              {recipe.nutrition && (
                <div className="grid grid-cols-2 gap-2 mb-4 p-3 bg-gray-50 rounded">
                  <div className="text-xs">
                    <span className="font-medium">Calories:</span> {Math.round(recipe.nutrition.calories * servingMultiplier)}
                  </div>
                  <div className="text-xs">
                    <span className="font-medium">Protein:</span> {Math.round(recipe.nutrition.protein_g * servingMultiplier)}g
                  </div>
                  <div className="text-xs">
                    <span className="font-medium">Carbs:</span> {Math.round(recipe.nutrition.carbs_g * servingMultiplier)}g
                  </div>
                  <div className="text-xs">
                    <span className="font-medium">Fat:</span> {Math.round(recipe.nutrition.fat_g * servingMultiplier)}g
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Details View */
            <div className="flex flex-col h-full overflow-hidden">
              {/* Ingredients */}
              <div className="mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                  <h4 className="font-medium text-gray-900">
                    Ingredients {servingMultiplier !== 1 && <span className="text-sm text-gray-600">(adjusted for {servingMultiplier}x)</span>}
                  </h4>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setShowSubstitutions(!showSubstitutions)
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 self-start sm:self-center px-2 py-1 border border-blue-200 rounded"
                  >
                    {showSubstitutions ? '🔽 Hide substitutions' : '🔄 Show substitutions'}
                  </button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {recipe.ingredients?.map((ingredient, index) => {
                    const substitutions = getSubstitutions(ingredient.name)
                    return (
                      <div key={`${recipe._id}-ingredient-${index}`} className="border-b border-gray-100 last:border-b-0 pb-2 last:pb-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                          <span className="text-sm text-gray-700">• {ingredient.name}</span>
                          <span className="text-xs sm:text-sm text-gray-500">{adjustQuantity(ingredient.quantity, servingMultiplier)}</span>
                        </div>
                        {showSubstitutions && substitutions && (
                          <div className="mt-1 ml-3 text-xs text-gray-500">
                            <span className="font-medium">Alternatives:</span> {substitutions.join(', ')}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Steps */}
              <div className="flex-1 overflow-hidden">
                <h4 className="font-medium text-gray-900 mb-2">Instructions:</h4>
                <div className="overflow-y-auto" style={{maxHeight: '280px'}}>
                  <ol className="text-sm text-gray-700 space-y-3 pr-2 pb-2">
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
            </div>
          )}
        </div>

        {/* Toggle Button - Always at bottom */}
        <div className="mt-4 pt-4 border-t">
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setExpanded(!expanded)
            }}
            className="w-full text-blue-600 hover:text-blue-800 text-sm font-medium py-2"
          >
            {expanded ? '◀ Back to summary' : '▶ Show ingredients & steps'}
          </button>
        </div>
      </div>
    </div>
  )
}