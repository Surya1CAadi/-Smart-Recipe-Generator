import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import * as tf from '@tensorflow/tfjs'
import * as mobilenet from '@tensorflow-models/mobilenet'
import Header from './components/Header'
import ImageUpload from './components/ImageUpload'
import IngredientList from './components/IngredientList'
import RecipeCard from './components/RecipeCard'
import FilterPanel from './components/FilterPanel'
import LoadingSpinner from './components/LoadingSpinner'

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
    dietary: []
  })
  const [activeTab, setActiveTab] = useState('search') // search, suggestions, upload

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
      console.log('Loading MobileNet model...')
      await tf.ready()
      const loadedModel = await mobilenet.load()
      setModel(loadedModel)
      console.log('Model loaded successfully')
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
        
        // Get predictions from model
        const predictions = await model.classify(canvas)
        
        // Map predictions to ingredients
        const detectedIngredients = predictions
          .filter(p => p.probability > 0.1)
          .map(p => mapPredictionToIngredient(p.className))
          .filter(ingredient => ingredient !== null)
          .slice(0, 5) // Limit to top 5
        
        if (detectedIngredients.length > 0) {
          const uniqueIngredients = [...new Set([...ingredients, ...detectedIngredients])]
          setIngredients(uniqueIngredients)
          setActiveTab('search')
        } else {
          setError('No food ingredients detected. Try a clearer image.')
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
    // Map MobileNet classifications to common ingredients
    const ingredientMap = {
      'banana': 'banana',
      'orange': 'orange',
      'apple': 'apple',
      'broccoli': 'broccoli',
      'carrot': 'carrot',
      'pizza': 'cheese',
      'hamburger': 'beef',
      'hot dog': 'sausage',
      'ice cream': 'cream',
      'doughnut': 'flour',
      'cake': 'flour',
      'mushroom': 'mushroom',
      'bell pepper': 'bell pepper',
      'corn': 'corn',
      'pineapple': 'pineapple',
      'strawberry': 'strawberry',
      'lemon': 'lemon',
      'pomegranate': 'pomegranate'
    }
    
    const lowerClassName = className.toLowerCase()
    
    // Direct matches
    if (ingredientMap[lowerClassName]) {
      return ingredientMap[lowerClassName]
    }
    
    // Partial matches
    for (const [key, value] of Object.entries(ingredientMap)) {
      if (lowerClassName.includes(key) || key.includes(lowerClassName)) {
        return value
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
          return ingredients.some(ingredient => 
            recipe.ingredients.some(ri => 
              ri.name.toLowerCase().includes(ingredient.toLowerCase())
            )
          )
        })
        setRecipes(filtered.length > 0 ? filtered : fallbackRecipes)
        return
      }
      
      const response = await axios.post(`${API_BASE}/recipes/match`, {
        ingredients,
        dietary: filters.dietary
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
        setRecipes(fallbackRecipes)
        return
      }
      
      const response = await axios.get(`${API_BASE}/recipes/suggestions`)
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image Upload or Ingredients */}
          <div className="lg:col-span-1">
            {activeTab === 'upload' && (
              <ImageUpload 
                onImageUpload={handleImageUpload}
                loading={loading}
                modelLoaded={!!model}
              />
            )}
            
            {(activeTab === 'search' || activeTab === 'suggestions') && (
              <div className="space-y-6">
                <IngredientList
                  ingredients={ingredients}
                  onAdd={addIngredient}
                  onRemove={removeIngredient}
                  onClear={clearAll}
                />
                
                {activeTab === 'search' && (
                  <>
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
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Recipe Results */}
          <div className="lg:col-span-2">
            {recipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recipes.map(recipe => (
                  <RecipeCard
                    key={recipe._id}
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
