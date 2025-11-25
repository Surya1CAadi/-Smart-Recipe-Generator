require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const Recipe = require('./models/recipe');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static images from photos folder
app.use('/photos', express.static(path.join(__dirname, 'photos')));

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart_recipe_dev';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err.message));

// Get all recipes with optional filtering
app.get('/api/recipes', async (req, res) => {
  try {
    const { difficulty, cuisine, maxCookTime, dietary } = req.query;
    let filter = {};
    
    if (difficulty) filter.difficulty = difficulty;
    if (cuisine) filter.cuisine = new RegExp(cuisine, 'i');
    if (maxCookTime) filter.cookTimeMin = { $lte: parseInt(maxCookTime) };
    if (dietary) filter.dietary = { $in: dietary.split(',') };
    
    const recipes = await Recipe.find(filter).limit(50).lean();
    res.json({ ok: true, data: recipes });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Match recipes by ingredients
app.post('/api/recipes/match', async (req, res) => {
  try {
    const { ingredients = [], dietary = [], strictMatch = false } = req.body;
    
    let filter = {};
    if (dietary.length > 0) {
      filter.dietary = { $in: dietary };
    }
    
    const allRecipes = await Recipe.find(filter).lean();
    
    // Score recipes by ingredient overlap
    const scoredRecipes = allRecipes.map(recipe => {
      const recipeIngredients = recipe.ingredients.map(ing => ing.name.toLowerCase());
      const userIngredients = ingredients.map(ing => ing.toLowerCase());
      
      const matches = userIngredients.filter(ui => 
        recipeIngredients.some(ri => ri.includes(ui) || ui.includes(ri))
      );
      
      // For strict matching, ALL user ingredients must be found
      if (strictMatch && matches.length < userIngredients.length) {
        return null; // Exclude this recipe
      }
      
      const score = matches.length / Math.max(recipeIngredients.length, userIngredients.length);
      return { ...recipe, matchScore: score, matchedIngredients: matches };
    }).filter(Boolean); // Remove null entries
    
    // Sort by match score and return results
    const topMatches = scoredRecipes
      .filter(r => r.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 20); // Increased limit for better results
    
    res.json({ ok: true, data: topMatches, strictMatch });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Rate a recipe (per-user)
app.post('/api/recipes/:id/rate', async (req, res) => {
  try {
    const { rating, userId } = req.body;
    if (!userId) return res.status(400).json({ ok: false, error: 'Missing userId' });
    if (rating < 1 || rating > 5) return res.status(400).json({ ok: false, error: 'Rating must be between 1-5' });
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ ok: false, error: 'Recipe not found' });
    // Upsert user rating
    let found = false;
    recipe.userRatings = (recipe.userRatings || []).map(r => {
      if (r.userId.toString() === userId) {
        found = true;
        return { userId, rating };
      }
      return r;
    });
    if (!found) recipe.userRatings.push({ userId, rating });
    // Recalculate average
    recipe.ratings = recipe.userRatings.map(r => r.rating);
    await recipe.save();
    const avgRating = recipe.ratings.length > 0 ? recipe.ratings.reduce((a, b) => a + b, 0) / recipe.ratings.length : 0;
    res.json({ ok: true, avgRating, totalRatings: recipe.ratings.length });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Add recipe to favorites (per-user)
app.post('/api/recipes/:id/favorite', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ ok: false, error: 'Missing userId' });
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ ok: false, error: 'Recipe not found' });
    if (!recipe.favoritesUsers) recipe.favoritesUsers = [];
    if (!recipe.favoritesUsers.some(u => u.toString() === userId)) {
      recipe.favoritesUsers.push(userId);
      recipe.favorites = recipe.favoritesUsers.length;
      await recipe.save();
    }
    res.json({ ok: true, favorites: recipe.favorites });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Remove recipe from favorites (per-user)
app.delete('/api/recipes/:id/favorite', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ ok: false, error: 'Missing userId' });
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ ok: false, error: 'Recipe not found' });
    recipe.favoritesUsers = (recipe.favoritesUsers || []).filter(u => u.toString() !== userId);
    recipe.favorites = recipe.favoritesUsers.length;
    await recipe.save();
    res.json({ ok: true, favorites: recipe.favorites });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Get user's favorite recipes
app.get('/api/recipes/favorites', async (req, res) => {
  try {
    const { userId } = req.query;
    let recipes;
    if (userId) {
      recipes = await Recipe.find({ favoritesUsers: userId }).lean();
    } else {
      recipes = await Recipe.find({}).sort({ favorites: -1, createdAt: -1 }).limit(10).lean();
    }
    res.json({ ok: true, data: recipes });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Get recipe suggestions based on popular ratings and preferences
app.get('/api/recipes/suggestions', async (req, res) => {
  try {
    const { dietary, cuisine, difficulty } = req.query;
    
    // Build filter object
    let filter = {};
    if (cuisine) {
      filter.cuisine = cuisine;
    }
    if (difficulty) {
      filter.difficulty = difficulty;
    }
    if (dietary) {
      if (dietary === 'non-vegetarian') {
        // Non-vegetarian: exclude recipes with 'vegetarian' or 'vegan' tags
        filter.dietary = { $nin: ['vegetarian', 'vegan'] };
      } else {
        // Vegetarian/Vegan: include recipes with specific dietary tag
        filter.dietary = dietary;
      }
    }
    
    const recipes = await Recipe.find(filter).lean();
    
    // Enhanced scoring algorithm based on ratings, favorites, and popularity
    const scoredRecipes = recipes.map(recipe => {
      const avgRating = recipe.ratings?.length > 0 
        ? recipe.ratings.reduce((a, b) => a + b, 0) / recipe.ratings.length 
        : 0;
      const ratingScore = avgRating / 5; // Normalize to 0-1
      
      const favoritesScore = Math.min((recipe.favorites || 0) / 10, 1); // Cap at 1
      const popularityScore = Math.min(recipe.ratings?.length || 0, 20) / 20; // Cap at 1
      
      // Weight the scores: 50% rating, 25% favorites, 25% popularity
      const totalScore = (ratingScore * 0.5) + (favoritesScore * 0.25) + (popularityScore * 0.25);
      
      return {
        ...recipe,
        suggestionScore: totalScore,
        avgRating: avgRating,
        popularity: recipe.ratings?.length || 0
      };
    });
    
    // Sort by suggestion score (highest first)
    const sortedRecipes = scoredRecipes.sort((a, b) => b.suggestionScore - a.suggestionScore);
    
    res.json({ ok: true, data: sortedRecipes });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Simple signup
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ ok: false, error: 'Email and password required' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ ok: false, error: 'Email already registered' });
    const user = new User({ name, email, password });
    await user.save();
    res.json({ ok: true, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Simple login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ ok: false, error: 'Invalid credentials' });
    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ ok: false, error: 'Invalid credentials' });
    res.json({ ok: true, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get('/api/health', (req, res) => res.json({ ok: true, now: new Date() }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Images available at: http://localhost:${PORT}/photos/`);
});
