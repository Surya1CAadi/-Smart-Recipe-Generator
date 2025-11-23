/**
 * Simple seed script for development. Run with `npm run seed`.
 * Add your MONGO_URI to environment or use local MongoDB.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Recipe = require('./models/recipe');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart_recipe_dev';

const sampleRecipes = [
  // Italian
  {
    title: 'Classic Tomato Pasta',
    ingredients: [ { name: 'pasta', quantity: '200g' }, { name: 'tomato', quantity: '2' }, { name: 'olive oil', quantity: '2 tbsp' }, { name: 'garlic', quantity: '2 cloves' }, { name: 'basil', quantity: '5 leaves' } ],
    steps: ['Boil pasta in salted water','Heat olive oil and sauté garlic','Add tomatoes and cook until soft','Mix pasta with sauce','Garnish with basil'],
    nutrition: { calories: 520, protein_g: 16, carbs_g: 75, fat_g: 14 },
    cuisine: 'Italian',
    difficulty: 'easy',
    cookTimeMin: 25,
    servings: 2,
    dietary: ['vegetarian'],
    ratings: [5, 4, 5]
  },
  {
    title: 'Margherita Pizza',
    ingredients: [ { name: 'pizza dough', quantity: '1' }, { name: 'tomato sauce', quantity: '1/2 cup' }, { name: 'mozzarella', quantity: '100g' }, { name: 'basil', quantity: '10 leaves' } ],
    steps: ['Preheat oven to 250°C','Roll out dough','Spread tomato sauce','Add mozzarella','Bake 10-12 minutes','Add fresh basil'],
    nutrition: { calories: 680, protein_g: 28, carbs_g: 85, fat_g: 22 },
    cuisine: 'Italian',
    difficulty: 'medium',
    cookTimeMin: 45,
    servings: 2,
    dietary: ['vegetarian'],
    ratings: [4, 5]
  },
  
  // Indian Recipes
  {
    title: 'Butter Chicken (Murgh Makhani)',
    ingredients: [ { name: 'chicken', quantity: '500g' }, { name: 'tomato', quantity: '3' }, { name: 'butter', quantity: '50g' }, { name: 'cream', quantity: '1/4 cup' }, { name: 'onion', quantity: '1' }, { name: 'ginger garlic paste', quantity: '1 tbsp' }, { name: 'garam masala', quantity: '1 tsp' } ],
    steps: ['Marinate chicken with yogurt and spices','Cook chicken until tender','Make tomato gravy with onions','Add cooked chicken to gravy','Finish with butter and cream','Serve hot with rice'],
    nutrition: { calories: 450, protein_g: 35, carbs_g: 12, fat_g: 28 },
    cuisine: 'Indian',
    difficulty: 'medium',
    cookTimeMin: 60,
    servings: 4,
    dietary: [],
    ratings: [5, 5, 4]
  },
  {
    title: 'Palak Paneer',
    ingredients: [ { name: 'paneer', quantity: '250g' }, { name: 'spinach', quantity: '500g' }, { name: 'onion', quantity: '1' }, { name: 'tomato', quantity: '1' }, { name: 'ginger garlic paste', quantity: '1 tbsp' }, { name: 'cumin seeds', quantity: '1 tsp' } ],
    steps: ['Blanch and puree spinach','Sauté onions until golden','Add ginger-garlic paste and tomatoes','Mix spinach puree','Add paneer cubes','Simmer and serve'],
    nutrition: { calories: 320, protein_g: 18, carbs_g: 15, fat_g: 22 },
    cuisine: 'Indian',
    difficulty: 'easy',
    cookTimeMin: 35,
    servings: 3,
    dietary: ['vegetarian'],
    ratings: [4, 5]
  },
  {
    title: 'Rajma (Red Kidney Bean Curry)',
    ingredients: [ { name: 'red kidney beans', quantity: '1 cup' }, { name: 'onion', quantity: '2' }, { name: 'tomato', quantity: '2' }, { name: 'ginger garlic paste', quantity: '1 tbsp' }, { name: 'cumin seeds', quantity: '1 tsp' }, { name: 'red chili powder', quantity: '1 tsp' } ],
    steps: ['Soak beans overnight and pressure cook','Sauté onions until golden','Add tomatoes and spices','Mix cooked beans','Simmer until thick','Serve with rice'],
    nutrition: { calories: 280, protein_g: 15, carbs_g: 45, fat_g: 8 },
    cuisine: 'Indian',
    difficulty: 'easy',
    cookTimeMin: 45,
    servings: 4,
    dietary: ['vegetarian', 'vegan'],
    ratings: [4]
  },
  {
    title: 'Chicken Biryani',
    ingredients: [ { name: 'chicken', quantity: '500g' }, { name: 'basmati rice', quantity: '2 cups' }, { name: 'onion', quantity: '2' }, { name: 'yogurt', quantity: '1/2 cup' }, { name: 'saffron', quantity: '1/4 tsp' }, { name: 'biryani masala', quantity: '2 tbsp' } ],
    steps: ['Marinate chicken with yogurt and spices','Cook rice until 70% done','Fry onions until golden','Layer rice and chicken','Cook on dum for 45 minutes','Serve with raita'],
    nutrition: { calories: 520, protein_g: 32, carbs_g: 65, fat_g: 18 },
    cuisine: 'Indian',
    difficulty: 'hard',
    cookTimeMin: 90,
    servings: 4,
    dietary: [],
    ratings: [5, 5, 5, 4]
  },
  {
    title: 'Dal Tadka',
    ingredients: [ { name: 'yellow lentils', quantity: '1 cup' }, { name: 'onion', quantity: '1' }, { name: 'tomato', quantity: '1' }, { name: 'cumin seeds', quantity: '1 tsp' }, { name: 'turmeric', quantity: '1/2 tsp' }, { name: 'ghee', quantity: '2 tbsp' } ],
    steps: ['Pressure cook lentils with turmeric','Heat ghee and add cumin seeds','Add onions and cook until soft','Add tomatoes and cook','Mix cooked lentils','Simmer and serve hot'],
    nutrition: { calories: 250, protein_g: 12, carbs_g: 35, fat_g: 8 },
    cuisine: 'Indian',
    difficulty: 'easy',
    cookTimeMin: 30,
    servings: 3,
    dietary: ['vegetarian'],
    ratings: [5, 4]
  },
  {
    title: 'Aloo Gobi',
    ingredients: [ { name: 'potato', quantity: '2' }, { name: 'cauliflower', quantity: '1 small' }, { name: 'onion', quantity: '1' }, { name: 'ginger garlic paste', quantity: '1 tsp' }, { name: 'turmeric', quantity: '1/2 tsp' }, { name: 'coriander powder', quantity: '1 tsp' } ],
    steps: ['Cut potato and cauliflower into pieces','Heat oil and add vegetables','Add onions and spices','Cook covered until tender','Garnish with cilantro','Serve hot'],
    nutrition: { calories: 180, protein_g: 5, carbs_g: 32, fat_g: 6 },
    cuisine: 'Indian',
    difficulty: 'easy',
    cookTimeMin: 25,
    servings: 3,
    dietary: ['vegetarian', 'vegan'],
    ratings: [4]
  },
  
  // Asian
  {
    title: 'Chicken Teriyaki',
    ingredients: [ { name: 'chicken thigh', quantity: '500g' }, { name: 'soy sauce', quantity: '3 tbsp' }, { name: 'mirin', quantity: '2 tbsp' }, { name: 'sugar', quantity: '1 tbsp' }, { name: 'ginger', quantity: '1 inch' } ],
    steps: ['Mix teriyaki sauce ingredients','Marinate chicken for 30 minutes','Pan fry chicken until golden','Add sauce and simmer','Serve with rice'],
    nutrition: { calories: 380, protein_g: 38, carbs_g: 15, fat_g: 18 },
    cuisine: 'Japanese',
    difficulty: 'medium',
    cookTimeMin: 40,
    servings: 3,
    dietary: [],
    ratings: [5, 4]
  },
  {
    title: 'Vegetable Fried Rice',
    ingredients: [ { name: 'rice', quantity: '2 cups cooked' }, { name: 'mixed vegetables', quantity: '1 cup' }, { name: 'soy sauce', quantity: '2 tbsp' }, { name: 'egg', quantity: '2' }, { name: 'garlic', quantity: '2 cloves' } ],
    steps: ['Scramble eggs and set aside','Stir fry vegetables','Add cooked rice','Mix in soy sauce and eggs','Serve hot'],
    nutrition: { calories: 420, protein_g: 14, carbs_g: 68, fat_g: 12 },
    cuisine: 'Chinese',
    difficulty: 'easy',
    cookTimeMin: 20,
    servings: 2,
    dietary: ['vegetarian'],
    ratings: [4, 4]
  },
  
  // Mexican
  {
    title: 'Black Bean Tacos',
    ingredients: [ { name: 'black beans', quantity: '1 can' }, { name: 'corn tortillas', quantity: '8' }, { name: 'avocado', quantity: '1' }, { name: 'lime', quantity: '1' }, { name: 'cilantro', quantity: '1/4 cup' }, { name: 'onion', quantity: '1/2' } ],
    steps: ['Heat black beans with spices','Warm tortillas','Mash avocado with lime','Assemble tacos','Garnish with cilantro and onion'],
    nutrition: { calories: 350, protein_g: 12, carbs_g: 58, fat_g: 10 },
    cuisine: 'Mexican',
    difficulty: 'easy',
    cookTimeMin: 15,
    servings: 2,
    dietary: ['vegetarian', 'vegan'],
    ratings: [4, 5]
  },
  
  // Mediterranean
  {
    title: 'Greek Salad',
    ingredients: [ { name: 'cucumber', quantity: '1' }, { name: 'tomato', quantity: '2' }, { name: 'feta cheese', quantity: '100g' }, { name: 'olive oil', quantity: '3 tbsp' }, { name: 'olives', quantity: '1/4 cup' }, { name: 'red onion', quantity: '1/4' } ],
    steps: ['Chop vegetables into chunks','Crumble feta cheese','Mix with olive oil and herbs','Add olives','Serve fresh'],
    nutrition: { calories: 280, protein_g: 8, carbs_g: 12, fat_g: 24 },
    cuisine: 'Greek',
    difficulty: 'easy',
    cookTimeMin: 10,
    servings: 2,
    dietary: ['vegetarian'],
    ratings: [5]
  },
  
  // American
  {
    title: 'Caesar Salad',
    ingredients: [ { name: 'romaine lettuce', quantity: '1 head' }, { name: 'parmesan cheese', quantity: '1/2 cup' }, { name: 'croutons', quantity: '1/2 cup' }, { name: 'caesar dressing', quantity: '1/4 cup' } ],
    steps: ['Wash and chop romaine','Toss with caesar dressing','Add parmesan and croutons','Serve immediately'],
    nutrition: { calories: 320, protein_g: 12, carbs_g: 18, fat_g: 24 },
    cuisine: 'American',
    difficulty: 'easy',
    cookTimeMin: 10,
    servings: 2,
    dietary: ['vegetarian'],
    ratings: [4]
  },
  {
    title: 'Grilled Cheese Sandwich',
    ingredients: [ { name: 'bread', quantity: '4 slices' }, { name: 'cheese', quantity: '4 slices' }, { name: 'butter', quantity: '2 tbsp' } ],
    steps: ['Butter bread slices','Place cheese between bread','Cook in pan until golden','Flip and cook other side','Serve hot'],
    nutrition: { calories: 480, protein_g: 18, carbs_g: 45, fat_g: 26 },
    cuisine: 'American',
    difficulty: 'easy',
    cookTimeMin: 10,
    servings: 2,
    dietary: ['vegetarian'],
    ratings: [5, 4]
  },
  
  // Thai
  {
    title: 'Pad Thai',
    ingredients: [ { name: 'rice noodles', quantity: '200g' }, { name: 'shrimp', quantity: '200g' }, { name: 'egg', quantity: '2' }, { name: 'bean sprouts', quantity: '1 cup' }, { name: 'fish sauce', quantity: '2 tbsp' }, { name: 'tamarind paste', quantity: '1 tbsp' } ],
    steps: ['Soak rice noodles until soft','Stir fry shrimp and eggs','Add noodles and sauce','Mix in bean sprouts','Garnish with peanuts and lime'],
    nutrition: { calories: 450, protein_g: 24, carbs_g: 55, fat_g: 15 },
    cuisine: 'Thai',
    difficulty: 'medium',
    cookTimeMin: 30,
    servings: 2,
    dietary: [],
    ratings: [5, 5]
  },
  
  // French
  {
    title: 'French Omelette',
    ingredients: [ { name: 'eggs', quantity: '3' }, { name: 'butter', quantity: '2 tbsp' }, { name: 'herbs', quantity: '1 tbsp' }, { name: 'cheese', quantity: '2 tbsp' } ],
    steps: ['Beat eggs with salt and pepper','Heat butter in non-stick pan','Pour eggs and stir gently','Add cheese and herbs','Fold and serve'],
    nutrition: { calories: 420, protein_g: 22, carbs_g: 3, fat_g: 36 },
    cuisine: 'French',
    difficulty: 'medium',
    cookTimeMin: 15,
    servings: 1,
    dietary: ['vegetarian'],
    ratings: [4, 5]
  },
  
  // Middle Eastern
  {
    title: 'Hummus',
    ingredients: [ { name: 'chickpeas', quantity: '1 can' }, { name: 'tahini', quantity: '2 tbsp' }, { name: 'lemon juice', quantity: '2 tbsp' }, { name: 'garlic', quantity: '2 cloves' }, { name: 'olive oil', quantity: '2 tbsp' } ],
    steps: ['Drain chickpeas','Blend all ingredients until smooth','Add water if needed','Taste and adjust seasoning','Serve with pita'],
    nutrition: { calories: 220, protein_g: 8, carbs_g: 24, fat_g: 12 },
    cuisine: 'Middle Eastern',
    difficulty: 'easy',
    cookTimeMin: 10,
    servings: 4,
    dietary: ['vegetarian', 'vegan'],
    ratings: [5, 4]
  },
  
  // British
  {
    title: 'Fish and Chips',
    ingredients: [ { name: 'white fish', quantity: '400g' }, { name: 'potatoes', quantity: '500g' }, { name: 'flour', quantity: '1 cup' }, { name: 'beer', quantity: '1/2 cup' }, { name: 'oil', quantity: 'for frying' } ],
    steps: ['Cut potatoes into chips','Make beer batter with flour','Dip fish in batter','Deep fry fish and chips','Serve with mushy peas'],
    nutrition: { calories: 680, protein_g: 35, carbs_g: 65, fat_g: 32 },
    cuisine: 'British',
    difficulty: 'hard',
    cookTimeMin: 45,
    servings: 2,
    dietary: [],
    ratings: [4]
  },
  
  // Spanish
  {
    title: 'Spanish Paella',
    ingredients: [ { name: 'bomba rice', quantity: '2 cups' }, { name: 'chicken', quantity: '300g' }, { name: 'seafood', quantity: '200g' }, { name: 'saffron', quantity: '1/4 tsp' }, { name: 'bell pepper', quantity: '1' }, { name: 'green beans', quantity: '100g' } ],
    steps: ['Heat paella pan','Brown chicken and seafood','Add vegetables and rice','Pour in saffron stock','Simmer without stirring','Rest before serving'],
    nutrition: { calories: 520, protein_g: 28, carbs_g: 58, fat_g: 18 },
    cuisine: 'Spanish',
    difficulty: 'hard',
    cookTimeMin: 60,
    servings: 4,
    dietary: [],
    ratings: [5, 5]
  },
  
  // Korean
  {
    title: 'Kimchi Fried Rice',
    ingredients: [ { name: 'kimchi', quantity: '1 cup' }, { name: 'cooked rice', quantity: '2 cups' }, { name: 'egg', quantity: '2' }, { name: 'sesame oil', quantity: '1 tbsp' }, { name: 'green onion', quantity: '2' } ],
    steps: ['Chop kimchi','Fry kimchi until fragrant','Add rice and mix','Fry eggs sunny side up','Serve rice topped with egg'],
    nutrition: { calories: 380, protein_g: 16, carbs_g: 52, fat_g: 12 },
    cuisine: 'Korean',
    difficulty: 'easy',
    cookTimeMin: 20,
    servings: 2,
    dietary: ['vegetarian'],
    ratings: [4, 5]
  },
  
  // German
  {
    title: 'German Potato Salad',
    ingredients: [ { name: 'potatoes', quantity: '1kg' }, { name: 'bacon', quantity: '100g' }, { name: 'onion', quantity: '1' }, { name: 'vinegar', quantity: '3 tbsp' }, { name: 'mustard', quantity: '1 tbsp' } ],
    steps: ['Boil potatoes until tender','Fry bacon until crispy','Sauté onions in bacon fat','Mix warm potatoes with dressing','Serve warm or cold'],
    nutrition: { calories: 320, protein_g: 8, carbs_g: 45, fat_g: 12 },
    cuisine: 'German',
    difficulty: 'easy',
    cookTimeMin: 35,
    servings: 4,
    dietary: [],
    ratings: [4]
  }
];

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to Mongo for seeding');
    await Recipe.deleteMany({});
    await Recipe.insertMany(sampleRecipes);
    console.log('Seeded sample recipes');
    process.exit(0);
  })
  .catch(err => {
    console.error('Seeding error', err);
    process.exit(1);
  });
