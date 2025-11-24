require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Recipe = require('./models/recipe');

const app = express();
app.use(cors());
app.use(express.json());

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

// Rate a recipe
app.post('/api/recipes/:id/rate', async (req, res) => {
  try {
    const { rating } = req.body;
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ ok: false, error: 'Rating must be between 1-5' });
    }
    
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ ok: false, error: 'Recipe not found' });
    }
    
    recipe.ratings.push(rating);
    await recipe.save();
    
    const avgRating = recipe.ratings.reduce((a, b) => a + b, 0) / recipe.ratings.length;
    
    res.json({ ok: true, avgRating, totalRatings: recipe.ratings.length });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Get recipe suggestions based on popular ratings
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
    
    const withAvgRating = recipes.map(recipe => {
      const avgRating = recipe.ratings.length > 0 
        ? recipe.ratings.reduce((a, b) => a + b, 0) / recipe.ratings.length 
        : 0;
      return { ...recipe, avgRating, ratingCount: recipe.ratings.length };
    });
    
    const suggestions = withAvgRating
      .filter(r => r.ratingCount >= 1) // At least 1 rating
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, 15); // Increased limit for better variety
    
    res.json({ ok: true, data: suggestions, filters: { dietary, cuisine, difficulty } });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get('/api/health', (req, res) => res.json({ ok: true, now: new Date() }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
