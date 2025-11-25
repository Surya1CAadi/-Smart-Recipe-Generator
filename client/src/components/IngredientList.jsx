import React, { useState } from 'react'

export default function IngredientList({ ingredients, onAdd, onRemove, onClear }) {
  const [newIngredient, setNewIngredient] = useState('')

  const handleAdd = (e) => {
    e.preventDefault()
    if (newIngredient.trim()) {
      onAdd(newIngredient.trim())
      setNewIngredient('')
    }
  }

  return (
    <div className="bg-gradient-to-br from-white via-green-50/30 to-blue-50/30 rounded-xl shadow-lg border-2 border-transparent p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5 opacity-50"></div>
      <div className="relative z-10">
      <h2 className="text-lg font-semibold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent flex items-center">
        <span className="text-2xl mr-2 animate-bounce">🥗</span> Your Ingredients
      </h2>
      
      <form onSubmit={handleAdd} className="mb-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newIngredient}
            onChange={(e) => setNewIngredient(e.target.value)}
            placeholder="Add ingredient (e.g., chicken, tomato)"
            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-md font-medium"
          >
            Add
          </button>
        </div>
      </form>

      {ingredients.length > 0 ? (
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            {ingredients.map((ingredient, index) => (
              <span
                key={ingredient}
                className={`inline-flex items-center px-3 py-2 rounded-full text-sm text-white font-medium shadow-md transform hover:scale-105 transition-all duration-200 ${
                  index % 4 === 0 ? 'bg-gradient-to-r from-emerald-500 to-teal-600' :
                  index % 4 === 1 ? 'bg-gradient-to-r from-blue-500 to-indigo-600' :
                  index % 4 === 2 ? 'bg-gradient-to-r from-purple-500 to-pink-600' :
                  'bg-gradient-to-r from-orange-500 to-red-600'
                }`}
              >
                {ingredient}
                <button
                  onClick={() => onRemove(ingredient)}
                  className="ml-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full w-5 h-5 flex items-center justify-center transition-all"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          
          <button
            onClick={onClear}
            className="text-sm text-gray-600 hover:text-gray-800 underline"
          >
            Clear all ingredients
          </button>
        </div>
      ) : (
        <p className="text-gray-500 text-sm mb-3">
          Add ingredients manually or upload a food image to get started
        </p>
      )}
      
      {/* Quick add buttons - always visible */}
      <div className="flex flex-wrap gap-2 mt-4">
        <span className="text-sm text-purple-600 font-medium flex items-center gap-1">
          <span>⚡</span> Quick add:
        </span>
        {['chicken', 'tomato', 'pasta', 'rice', 'onion', 'potato', 'cheese', 'garlic'].map((item, index) => (
          !ingredients.includes(item) && (
            <button
              key={item}
              onClick={() => onAdd(item)}
              className={`px-3 py-1 text-xs rounded-full transition-all duration-200 transform hover:scale-110 font-medium ${
                index % 3 === 0 ? 'bg-gradient-to-r from-pink-400 to-rose-500 text-white shadow-md' :
                index % 3 === 1 ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-md' :
                'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-md'
              }`}
            >
              + {item}
            </button>
          )
        ))}
      </div>
      
      {ingredients.length > 0 && (
        <div className="mt-4 p-4 bg-gradient-to-r from-green-100 to-teal-100 rounded-lg border border-green-300 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-green-800">
            <span className="text-lg animate-pulse">✅</span>
            <span className="font-semibold">{ingredients.length} ingredient(s) ready for recipe matching</span>
          </div>
        </div>
      )}
    </div>
    </div>
  )
}