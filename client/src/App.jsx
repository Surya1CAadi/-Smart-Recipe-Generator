import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import * as tf from '@tensorflow/tfjs'
import * as cocoSsd from '@tensorflow-models/coco-ssd'
import Header from './components/Header'
import ImageUpload from './components/ImageUpload'
import IngredientList from './components/IngredientList'
import RecipeCard from './components/RecipeCard'
import FilterPanel from './components/FilterPanel'
import LoadingSpinner from './components/LoadingSpinner'
import SubstitutionPanel from './components/SubstitutionPanel'

const API_BASE = '/api' // Use Vite proxy for dev, direct for prod

export default function App() {
  const [ingredients, setIngredients] = useState([])
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [model, setModel] = useState(null)
  const [apiConnected, setApiConnected] = useState(false)
  const [filters, setFilters] = useState({
    difficulty: '',
    cuisine: '',
    maxCookTime: '',
    servings: '',
    strictMatch: true,  // Default to strict matching
    dietary: []
  })
  const [activeTab, setActiveTab] = useState('search') // search, suggestions, upload
  const [popularFilters, setPopularFilters] = useState({
    dietary: '',
    cuisine: '',
    difficulty: ''
  })

  // Test API connection on mount
  useEffect(() => {
    testApiConnection()
    loadModel()
  }, [])

  const testApiConnection = async () => {
    try {
      const response = await axios.get(`${API_BASE}/health`)
      setApiConnected(response.data.ok)
    } catch (err) {
      console.log('API not connected, using fallback data')
      setApiConnected(false)
    }
  }

  const loadModel = async () => {
    try {
      setLoading(true)
      console.log('Loading COCO-SSD object detection model...')
      await tf.ready()
      const loadedModel = await cocoSsd.load()
      setModel(loadedModel)
      console.log('COCO-SSD model loaded successfully')
    } catch (err) {
      console.error('Error loading model:', err)
      setError('Failed to load AI model. Image recognition unavailable.')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (imageFile) => {
    if (!model) {
      setError('AI model not loaded yet. Please try again.')
      return
    }

    try {
      setLoading(true)
      setError('')
      
      // Create image element for processing
      const img = new Image()
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      img.onload = async () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        
        // Get object detections from model
        const predictions = await model.detect(canvas)
        
        // Debug: Log all predictions
        console.log('All predictions:', predictions.map(p => ({ class: p.class, score: p.score })))
        
        // Map predictions to ingredients with lower threshold
        const detectedIngredients = predictions
          .filter(p => p.score > 0.15) // Lower confidence threshold for better detection
          .map(p => {
            const ingredient = mapPredictionToIngredient(p.class)
            console.log(`Mapping "${p.class}" (${p.score.toFixed(2)}) -> "${ingredient}"`)
            return ingredient
          })
          .filter(ingredient => ingredient !== null)
          .slice(0, 8) // Increased to top 8 ingredients
        
        if (detectedIngredients.length > 0) {
          const uniqueIngredients = [...new Set([...ingredients, ...detectedIngredients])]
          setIngredients(uniqueIngredients)
          setActiveTab('search')
        } else {
          // Fallback: Add common vegetables if image appears to contain produce
          const fallbackVeggies = ['onion', 'tomato', 'potato', 'bell pepper', 'lettuce']
          setError(`No specific ingredients detected. Try adding common vegetables manually or upload a closer image. Detected objects: ${predictions.map(p => p.class).join(', ') || 'none'}`)
        }
        
        setLoading(false)
      }
      
      img.src = URL.createObjectURL(imageFile)
    } catch (err) {
      console.error('Image processing error:', err)
      setError('Error processing image. Please try again.')
      setLoading(false)
    }
  }

  const mapPredictionToIngredient = (className) => {
    // Map COCO-SSD object detection classes to cooking ingredients
    const ingredientMap = {
      // Fruits
      'banana': 'banana',
      'apple': 'apple',
      'orange': 'orange',
      'lemon': 'lemon',
      'lime': 'lime',
      
      // Vegetables - Direct matches
      'broccoli': 'broccoli',
      'carrot': 'carrot',
      'celery': 'celery',
      'cucumber': 'cucumber',
      'onion': 'onion',
      'garlic': 'garlic',
      'potato': 'potato',
      'tomato': 'tomato',
      'pepper': 'bell pepper',
      'bell pepper': 'bell pepper',
      'capsicum': 'bell pepper',
      'lettuce': 'lettuce',
      'cabbage': 'cabbage',
      'spinach': 'spinach',
      'corn': 'corn',
      'peas': 'peas',
      'beans': 'beans',
      'mushroom': 'mushroom',
      'eggplant': 'eggplant',
      'aubergine': 'eggplant',
      'zucchini': 'zucchini',
      'squash': 'squash',
      'pumpkin': 'pumpkin',
      'sweet potato': 'sweet potato',
      'beetroot': 'beetroot',
      'radish': 'radish',
      'turnip': 'turnip',
      'leek': 'leek',
      'fennel': 'fennel',
      'artichoke': 'artichoke',
      'asparagus': 'asparagus',
      'avocado': 'avocado',
      
      // Prepared foods
      'pizza': 'cheese',
      'hot dog': 'sausage',
      'hamburger': 'beef',
      'donut': 'flour',
      'cake': 'flour',
      'sandwich': 'bread',
      'salad': 'lettuce',
      'soup': 'broth',
      'pasta': 'pasta',
      'rice': 'rice',
      'bread': 'bread',
      'cheese': 'cheese',
      'egg': 'egg',
      'milk': 'milk',
      'yogurt': 'yogurt',
      'butter': 'butter',
      'meat': 'meat',
      'chicken': 'chicken',
      'beef': 'beef',
      'pork': 'pork',
      'fish': 'fish',
      'salmon': 'salmon',
      'tuna': 'tuna',
      'shrimp': 'shrimp',
      'seafood': 'seafood',
      
      // Beverages and containers that might indicate ingredients
      'wine glass': 'wine',
      'cup': 'milk',
      'bottle': 'oil',
      'bowl': 'flour', // often contains ingredients
      
      // Plants and herbs
      'potted plant': 'herbs',
      'plant': 'herbs',
      'herb': 'herbs',
      'basil': 'basil',
      'parsley': 'parsley',
      'cilantro': 'cilantro',
      'mint': 'mint',
      'rosemary': 'rosemary',
      'thyme': 'thyme',
      'oregano': 'oregano',
      
      // Non-food items
      'dining table': null,
      'fork': null,
      'knife': null,
      'spoon': null,
      'clock': null,
      'refrigerator': null,
      'person': null,
      'chair': null,
      'bench': null
    }
    
    const lowerClassName = className.toLowerCase()
    
    // Direct matches
    if (ingredientMap[lowerClassName]) {
      return ingredientMap[lowerClassName]
    }
    
    // Handle color variations (e.g., "red pepper", "green pepper")
    const colorWords = ['red', 'green', 'yellow', 'orange', 'purple', 'white', 'black', 'brown']
    let cleanClassName = lowerClassName
    colorWords.forEach(color => {
      cleanClassName = cleanClassName.replace(`${color} `, '').replace(` ${color}`, '')
    })
    
    if (ingredientMap[cleanClassName]) {
      return ingredientMap[cleanClassName]
    }
    
    // Partial matches - check if detected object contains known ingredients
    for (const [key, value] of Object.entries(ingredientMap)) {
      if (value && (lowerClassName.includes(key) || key.includes(lowerClassName))) {
        return value
      }
    }
    
    // Special handling for common vegetable synonyms
    const synonyms = {
      'capsicum': 'bell pepper',
      'aubergine': 'eggplant',
      'courgette': 'zucchini',
      'swede': 'turnip',
      'spring onion': 'onion',
      'scallion': 'onion',
      'shallot': 'onion'
    }
    
    for (const [synonym, ingredient] of Object.entries(synonyms)) {
      if (lowerClassName.includes(synonym)) {
        return ingredient
      }
    }
    
    return null
  }

  // Fallback recipe data when API is unavailable
  const fallbackRecipes = [
    {
      _id: 'fallback-1',
      title: 'Simple Tomato Pasta',
      ingredients: [{ name: 'pasta', quantity: '200g' }, { name: 'tomato', quantity: '2' }],
      steps: ['Boil pasta', 'Make tomato sauce', 'Mix together'],
      nutrition: { calories: 400, protein_g: 12, carbs_g: 60, fat_g: 8 },
      cuisine: 'Italian',
      difficulty: 'easy',
      cookTimeMin: 20,
      servings: 2,
      dietary: ['vegetarian'],
      ratings: [4, 5],
      matchScore: 0.8
    },
    {
      _id: 'fallback-2', 
      title: 'Quick Chicken Stir Fry',
      ingredients: [{ name: 'chicken', quantity: '200g' }, { name: 'vegetables', quantity: '150g' }],
      steps: ['Cut chicken', 'Stir fry with vegetables', 'Season and serve'],
      nutrition: { calories: 350, protein_g: 25, carbs_g: 15, fat_g: 18 },
      cuisine: 'Asian',
      difficulty: 'easy',
      cookTimeMin: 15,
      servings: 2,
      dietary: [],
      ratings: [4, 4, 5],
      matchScore: 0.6
    }
  ]

  const findRecipes = async () => {
    if (ingredients.length === 0) {
      setError('Please add some ingredients first.')
      return
    }

    try {
      setLoading(true)
      setError('')
      
      if (!apiConnected) {
        // Use fallback data when API not available
        const filtered = fallbackRecipes.filter(recipe => {
          if (filters.strictMatch) {
            // STRICT matching: ALL ingredients must be present
            return ingredients.every(ingredient => 
              recipe.ingredients.some(ri => 
                ri.name.toLowerCase().includes(ingredient.toLowerCase())
              )
            )
          } else {
            // FLEXIBLE matching: ANY ingredients can be present
            return ingredients.some(ingredient => 
              recipe.ingredients.some(ri => 
                ri.name.toLowerCase().includes(ingredient.toLowerCase())
              )
            )
          }
        })
        setRecipes(filtered.length > 0 ? filtered : [])
        if (filtered.length === 0) {
          setError(filters.strictMatch 
            ? 'No recipes found that contain ALL selected ingredients. Try disabling strict matching or removing some ingredients.'
            : 'No recipes found with those ingredients. Try different ingredients.'
          )
        }
        return
      }
      
      const response = await axios.post(`${API_BASE}/recipes/match`, {
        ingredients,
        dietary: filters.dietary,
        strictMatch: filters.strictMatch
      })
      
      setRecipes(response.data.data || [])
    } catch (err) {
      console.error('Recipe search error:', err)
      setError('Using demo recipes. Connect to backend for full functionality.')
      setRecipes(fallbackRecipes)
    } finally {
      setLoading(false)
    }
  }

  const getRecipeSuggestions = async () => {
    try {
      setLoading(true)
      setError('')
      
      if (!apiConnected) {
        // Use fallback data when API not available
        let filtered = fallbackRecipes
        
        // Apply popular filters
        if (popularFilters.dietary) {
          if (popularFilters.dietary === 'non-vegetarian') {
            // Non-vegetarian: exclude vegetarian and vegan recipes
            filtered = filtered.filter(recipe => 
              !recipe.dietary?.includes('vegetarian') && !recipe.dietary?.includes('vegan')
            )
          } else {
            // Vegetarian/Vegan: include recipes with specific dietary tag
            filtered = filtered.filter(recipe => 
              recipe.dietary?.includes(popularFilters.dietary)
            )
          }
        }
        if (popularFilters.cuisine) {
          filtered = filtered.filter(recipe => 
            recipe.cuisine === popularFilters.cuisine
          )
        }
        if (popularFilters.difficulty) {
          filtered = filtered.filter(recipe => 
            recipe.difficulty === popularFilters.difficulty
          )
        }
        
        setRecipes(filtered)
        return
      }
      
      // Build query params for API
      const params = new URLSearchParams()
      if (popularFilters.dietary) params.append('dietary', popularFilters.dietary)
      if (popularFilters.cuisine) params.append('cuisine', popularFilters.cuisine)
      if (popularFilters.difficulty) params.append('difficulty', popularFilters.difficulty)
      
      const url = `${API_BASE}/recipes/suggestions${params.toString() ? '?' + params.toString() : ''}`
      const response = await axios.get(url)
      setRecipes(response.data.data || [])
    } catch (err) {
      console.error('Suggestions error:', err)
      setError('Using demo recipes. Connect to backend for full functionality.')
      setRecipes(fallbackRecipes)
    } finally {
      setLoading(false)
    }
  }

  const rateRecipe = async (recipeId, rating) => {
    try {
      await axios.post(`${API_BASE}/recipes/${recipeId}/rate`, { rating })
      // Update local recipe with new rating
      setRecipes(prev => prev.map(recipe => 
        recipe._id === recipeId 
          ? { ...recipe, userRating: rating }
          : recipe
      ))
    } catch (err) {
      console.error('Rating error:', err)
    }
  }

  const addIngredient = (ingredient) => {
    if (ingredient.trim() && !ingredients.includes(ingredient.toLowerCase())) {
      setIngredients(prev => [...prev, ingredient.toLowerCase()])
    }
  }

  const removeIngredient = (ingredient) => {
    setIngredients(prev => prev.filter(ing => ing !== ingredient))
  }

  const substituteIngredient = (original, substitute) => {
    setIngredients(prev => prev.map(ing => 
      ing === original.toLowerCase() ? substitute.toLowerCase() : ing
    ))
  }

  const clearAll = () => {
    setIngredients([])
    setRecipes([])
    setError('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Connection Status */}
        {!apiConnected && (
          <div className="mb-6 p-3 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-lg">
            <div className="flex items-center">
              <span className="text-sm">⚠️ Backend not connected - Using demo data. For full functionality, start the server.</span>
            </div>
          </div>
        )}
        
        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'upload'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            📷 Upload Image
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'search'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            🔍 Search Recipes
          </button>
          <button
            onClick={() => {
              setActiveTab('suggestions')
              getRecipeSuggestions()
            }}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'suggestions'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            ⭐ Popular Recipes
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Loading Spinner */}
        {loading && <LoadingSpinner />}

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Controls */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            {activeTab === 'upload' && (
              <ImageUpload 
                onImageUpload={handleImageUpload}
                loading={loading}
                modelLoaded={!!model}
              />
            )}
            
            {activeTab === 'search' && (
              <div className="space-y-6">
                <IngredientList
                  ingredients={ingredients}
                  onAdd={addIngredient}
                  onRemove={removeIngredient}
                  onClear={clearAll}
                />
                
                <SubstitutionPanel 
                  ingredients={ingredients}
                  onSubstitute={substituteIngredient}
                />
                
                <FilterPanel 
                  filters={filters}
                  onFiltersChange={setFilters}
                />
                
                <button
                  onClick={findRecipes}
                  disabled={ingredients.length === 0 || loading}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  Find Recipes ({ingredients.length} ingredients)
                </button>
              </div>
            )}
            
            {activeTab === 'suggestions' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold mb-4">⭐ Popular Recipes</h2>
                  <p className="text-gray-600 text-sm mb-4">
                    Discover highly-rated recipes from our community. Filter by your preferences to find the perfect dish!
                  </p>
                  
                  {/* Popular Recipe Filters */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Dietary Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dietary Preference
                        </label>
                        <select
                          value={popularFilters.dietary}
                          onChange={(e) => setPopularFilters(prev => ({ ...prev, dietary: e.target.value }))}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                        >
                          <option value="">All recipes</option>
                          <option value="vegetarian">🌱 Vegetarian</option>
                          <option value="vegan">🌿 Vegan</option>
                          <option value="non-vegetarian">🍗 Non-Vegetarian</option>
                        </select>
                      </div>
                      
                      {/* Cuisine Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cuisine
                        </label>
                        <select
                          value={popularFilters.cuisine}
                          onChange={(e) => setPopularFilters(prev => ({ ...prev, cuisine: e.target.value }))}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                        >
                          <option value="">All cuisines</option>
                          <option value="Indian">🍛 Indian</option>
                          <option value="Italian">🍝 Italian</option>
                          <option value="Asian">🍜 Asian</option>
                          <option value="Mexican">🌮 Mexican</option>
                          <option value="American">🍔 American</option>
                          <option value="French">🍾 French</option>
                          <option value="Greek">🏺 Greek</option>
                          <option value="Middle Eastern">🥙 Middle Eastern</option>
                        </select>
                      </div>
                      
                      {/* Difficulty Filter */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Difficulty
                        </label>
                        <select
                          value={popularFilters.difficulty}
                          onChange={(e) => setPopularFilters(prev => ({ ...prev, difficulty: e.target.value }))}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                        >
                          <option value="">All levels</option>
                          <option value="easy">🟢 Easy</option>
                          <option value="medium">🟡 Medium</option>
                          <option value="hard">🔴 Hard</option>
                        </select>
                      </div>
                    </div>
                    
                    {/* Filter Actions */}
                    <div className="flex space-x-3">
                      <button
                        onClick={getRecipeSuggestions}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                      >
                        Apply Filters
                      </button>
                      <button
                        onClick={() => {
                          setPopularFilters({ dietary: '', cuisine: '', difficulty: '' })
                          getRecipeSuggestions()
                        }}
                        className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                  
                  {/* Active Filters Display */}
                  {(popularFilters.dietary || popularFilters.cuisine || popularFilters.difficulty) && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="text-xs text-blue-800 font-medium mb-1">Active filters:</div>
                      <div className="flex flex-wrap gap-1">
                        {popularFilters.dietary && (
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            {popularFilters.dietary === 'non-vegetarian' ? 'Non-Veg' : popularFilters.dietary}
                          </span>
                        )}
                        {popularFilters.cuisine && (
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            {popularFilters.cuisine}
                          </span>
                        )}
                        {popularFilters.difficulty && (
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            {popularFilters.difficulty}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Recipe Results */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            {recipes.length > 0 ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                {recipes.map(recipe => (
                  <RecipeCard
                    key={`recipe-${recipe._id}-${activeTab}`}
                    recipe={recipe}
                    onRate={rateRecipe}
                  />
                ))}
              </div>
            ) : !loading && activeTab !== 'upload' ? (
              <div className="text-center text-gray-500 py-12">
                <div className="text-6xl mb-4">🍳</div>
                <h3 className="text-xl font-medium mb-2">No recipes found</h3>
                <p>
                  {activeTab === 'search' 
                    ? 'Add ingredients and search to find recipes'
                    : 'No popular recipes available'
                  }
                </p>
              </div>
            ) : activeTab === 'upload' && !loading ? (
              <div className="text-center text-gray-500 py-12">
                <div className="text-6xl mb-4">📸</div>
                <h3 className="text-xl font-medium mb-2">Upload Food Image</h3>
                <p>Upload a photo of ingredients or food items to get recipe suggestions</p>
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  )
}
