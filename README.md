# Smart Recipe Generator

A comprehensive full-stack web application that suggests recipes based on available ingredients or uploaded food photos using AI-powered ingredient recognition.


<div align="center">
  <img src="https://img.shields.io/badge/MERN-Full%20Stack-blue" />
  <img src="https://img.shields.io/badge/AI-TensorFlow.js-brightgreen" />
  <img src="https://img.shields.io/badge/Recipes-34%2B-orange" />
  <img src="https://img.shields.io/badge/License-MIT-lightgrey" />
</div>

---

## 🌐 Live Project Links
- 🔗 **Live Application URL:** https://smart-recipe-generator-jw5a.onrender.com/
-  Id - aditya@gmail.com     Password - 1234567
- 🔗 **GitHub Repository:** https://github.com/Surya1CAadi/-Smart-Recipe-Generator

---

## ✨ Key Features

- **AI Ingredient Recognition:** Upload food photos and detect ingredients using TensorFlow.js COCO-SSD.
- **Smart Recipe Matching:** Find recipes by ingredient overlap, substitutions, and dietary needs.
- **Advanced Filtering:** Filter by cuisine, difficulty, cook time, and dietary restrictions.
- **Personalized Ratings:** 5-star system, favorites, and community suggestions.
- **Responsive UI:** Mobile-first, Tailwind CSS, modern UX.
- **Rich Recipe Database:** 34+ recipes, 11+ cuisines, nutrition info.
- **Cloud Deployment:** Vercel (frontend), Render (backend), Docker-ready.

---


## 🚀 Deployment (Render)
Both backend and frontend are deployed on Render for seamless cloud hosting and scalability.

---

## 🍽️ Recipe Database (34+ Recipes)
- **Indian:** Butter Chicken, Palak Paneer, Rajma, Chicken Biryani, Dal Tadka, Aloo Gobi, Tandoori Chicken, Vegetable Biryani
- **Italian:** Classic Tomato Pasta, Margherita Pizza, Chicken Alfredo Pasta, Caprese Salad
- **Asian:** Chicken Teriyaki, Vegetable Fried Rice, Pad Thai, Kimchi Fried Rice, Beef Stir Fry, Miso Soup
- **Mexican:** Black Bean Tacos, Chicken Enchiladas, Guacamole
- **Mediterranean:** Greek Salad, Chicken Souvlaki, Falafel, Hummus
- **American:** Caesar Salad, Grilled Cheese Sandwich, BBQ Pulled Pork, Mac and Cheese
- **French:** French Omelette, Beef Bourguignon
- **Others:** Fish and Chips, Spanish Paella, German Potato Salad

---

## 🧑‍💻 Technology Stack
- **Frontend:** React 18, Vite, Tailwind CSS, TensorFlow.js, Axios
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **AI/ML:** TensorFlow.js, COCO-SSD
- **DevOps:** Render (backend & frontend)

---

## 🏗️ Project Structure
```
Smart-Recipe-Generator/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Header.jsx
│   │   │   ├── ImageUpload.jsx
│   │   │   ├── IngredientList.jsx
│   │   │   ├── RecipeCard.jsx
│   │   │   ├── FilterPanel.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── App.jsx          # Main application logic
│   │   ├── main.jsx         # React entry point
│   │   └── styles.css       # Tailwind CSS
│   ├── package.json
│   └── vite.config.js
├── server/                   # Express backend
│   ├── models/
│   │   └── recipe.js        # MongoDB recipe schema
│   ├── index.js            # Express server & API routes
│   ├── seed.js            # Database seeding script
│   ├── Dockerfile         # Container configuration
│   └── package.json
└── README.md              # This documentation
```


### Environment Variables:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-recipe
PORT=5000
NODE_ENV=production
```


## 📚 API Documentation

### Endpoints:
- `GET /api/recipes` - List all recipes with optional filters
- `POST /api/recipes/match` - Find recipes by ingredients
- `POST /api/recipes/:id/rate` - Rate a recipe (1-5 stars)
- `GET /api/recipes/suggestions` - Get popular recipes
- `GET /api/health` - API health check

---

## 🧑‍💻 Author

**Aditya Maurya**
📧 [Email](mailto:adityamaurya09249@gmail.com)
🌐 [GitHub](https://github.com/Surya1CAadi)

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute it.
