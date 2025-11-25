const mongoose = require('mongoose');

const IngredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: String },
});

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String }, // URL for recipe image
  ingredients: [IngredientSchema],
  steps: [String],
  nutrition: {
    calories: Number,
    protein_g: Number,
    carbs_g: Number,
    fat_g: Number
  },
  cuisine: String,
  difficulty: { type: String, enum: ['easy','medium','hard'], default: 'easy' },
  cookTimeMin: Number,
  servings: { type: Number, default: 1 },
  dietary: [String],
  ratings: [Number],
  userRatings: [{ userId: String, rating: Number }], // Track per-user ratings
  favorites: { type: Number, default: 0 },
  favoritesUsers: [String], // Track user IDs who favorited
},{ timestamps: true });

module.exports = mongoose.model('Recipe', RecipeSchema);
