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
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-lg font-semibold mb-4">🥗 Your Ingredients</h2>
      
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
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add
          </button>
        </div>
      </form>

      {ingredients.length > 0 ? (
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            {ingredients.map((ingredient) => (
              <span
                key={ingredient}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 border border-green-200"
              >
                {ingredient}
                <button
                  onClick={() => onRemove(ingredient)}
                  className="ml-2 text-green-600 hover:text-green-800"
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
        <div>
          <p className="text-gray-500 text-sm mb-3">
            Add ingredients manually or upload a food image to get started
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs text-gray-400">Quick add:</span>
            {['chicken', 'tomato', 'pasta', 'rice', 'onion'].map(item => (
              <button
                key={item}
                onClick={() => onAdd(item)}
                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
              >
                + {item}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {ingredients.length > 0 && (
        <div className="mt-4 p-3 bg-green-50 rounded text-xs text-green-800">
          ✅ {ingredients.length} ingredient(s) ready for recipe matching
        </div>
      )}
    </div>
  )
}