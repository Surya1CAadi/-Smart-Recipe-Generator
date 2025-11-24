import React, { useState } from 'react'

export default function SubstitutionPanel({ ingredients, onSubstitute }) {
  const [expanded, setExpanded] = useState(false)
  
  const substitutionMap = {
    'chicken': { alternatives: ['turkey', 'tofu', 'paneer'], category: 'protein' },
    'beef': { alternatives: ['chicken', 'pork', 'mushrooms'], category: 'protein' },
    'fish': { alternatives: ['chicken', 'tofu', 'tempeh'], category: 'protein' },
    'butter': { alternatives: ['olive oil', 'coconut oil', 'margarine'], category: 'fat' },
    'milk': { alternatives: ['almond milk', 'soy milk', 'coconut milk'], category: 'dairy' },
    'cheese': { alternatives: ['nutritional yeast', 'cashew cheese', 'tofu'], category: 'dairy' },
    'cream': { alternatives: ['coconut cream', 'cashew cream', 'milk'], category: 'dairy' },
    'pasta': { alternatives: ['rice', 'quinoa', 'zucchini noodles'], category: 'carbs' },
    'rice': { alternatives: ['quinoa', 'cauliflower rice', 'pasta'], category: 'carbs' },
    'flour': { alternatives: ['almond flour', 'coconut flour', 'oat flour'], category: 'carbs' },
    'egg': { alternatives: ['flax egg', 'chia egg', 'applesauce'], category: 'binding' },
    'sugar': { alternatives: ['honey', 'maple syrup', 'stevia'], category: 'sweetener' },
    'onion': { alternatives: ['shallots', 'leeks', 'garlic'], category: 'aromatic' },
    'garlic': { alternatives: ['onion powder', 'shallots', 'ginger'], category: 'aromatic' },
    'tomato': { alternatives: ['bell pepper', 'zucchini', 'eggplant'], category: 'vegetable' }
  }

  const getSubstitutionsForIngredients = () => {
    const substitutions = []
    
    ingredients.forEach(ingredient => {
      const key = Object.keys(substitutionMap).find(key => 
        ingredient.toLowerCase().includes(key)
      )
      
      if (key) {
        substitutions.push({
          original: ingredient,
          ...substitutionMap[key],
          key: key
        })
      }
    })
    
    return substitutions
  }

  const availableSubstitutions = getSubstitutionsForIngredients()

  if (ingredients.length === 0 || availableSubstitutions.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <div>
          <h3 className="text-lg font-semibold text-gray-900">🔄 Ingredient Substitutions</h3>
          <p className="text-sm text-gray-600">
            {availableSubstitutions.length} substitution{availableSubstitutions.length !== 1 ? 's' : ''} available
          </p>
        </div>
        <span className="text-gray-400">
          {expanded ? '▼' : '▶'}
        </span>
      </button>
      
      {expanded && (
        <div className="mt-4 space-y-3">
          {availableSubstitutions.map((sub, index) => (
            <div key={index} className="border-l-4 border-blue-200 pl-4 py-2 bg-blue-50 rounded-r">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="font-medium text-gray-900">{sub.original}</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {sub.category}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-600">Try instead:</span>
                {sub.alternatives.map((alt, altIndex) => (
                  <button
                    key={altIndex}
                    onClick={() => onSubstitute && onSubstitute(sub.original, alt)}
                    className="text-xs bg-white border border-blue-200 text-blue-700 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                  >
                    {alt}
                  </button>
                ))}
              </div>
            </div>
          ))}
          
          <div className="mt-4 p-3 bg-yellow-50 rounded border border-yellow-200">
            <div className="flex items-start space-x-2">
              <span className="text-yellow-600 text-sm">💡</span>
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Substitution Tips:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Adjust quantities as needed when substituting</li>
                  <li>• Taste and season accordingly</li>
                  <li>• Some substitutions may change cooking time</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}