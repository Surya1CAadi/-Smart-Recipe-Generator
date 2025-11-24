# Smart Recipe Generator — Complete MERN Application ✅

A comprehensive full-stack web application that suggests recipes based on available ingredients or uploaded food photos using AI-powered ingredient recognition.

## 🎯 Project Status: COMPLETE

### ✅ All Required Features Implemented:
- **Image Recognition**: TensorFlow.js COCO-SSD for ingredient detection from photos
- **Recipe Matching**: Smart algorithm with ingredient overlap scoring and substitutions
- **Advanced Filtering**: Difficulty, cuisine, cook time, dietary restrictions
- **Rating System**: 5-star ratings with personalized suggestions
- **Responsive UI**: Mobile-first design with Tailwind CSS
- **Recipe Database**: 34+ diverse recipes across multiple cuisines
- **Deployment Ready**: Configured for Vercel (frontend) and Render (backend)

## 🚀 Features

### 📸 AI-Powered Image Recognition
- Upload food photos to automatically detect ingredients
- TensorFlow.js COCO-SSD object detection model runs entirely in the browser
- Maps detected objects to cooking ingredients with confidence scoring

### 🔍 Smart Recipe Matching
- Find recipes based on available ingredients with scoring algorithm
- Handles ingredient substitutions (e.g., rice → basmati, chicken → poultry)
- Ingredient substitution suggestions for dietary preferences
- Dietary restriction filtering (vegetarian, vegan, gluten-free)

### 🎛️ Advanced Search & Filters
- Filter by difficulty level (easy/medium/hard)
- Cuisine selection (Indian, Italian, Asian, Mexican, Mediterranean, etc.)
- Maximum cooking time constraints
- Multiple dietary preference support

### ⭐ Personalization & Ratings
- 5-star rating system for recipes
- Popular recipe suggestions based on community ratings
- Advanced filtering for popular recipes (Veg/Non-Veg, cuisine, difficulty)
- Personalized recommendations

### 📱 Modern UI/UX
- Responsive Tailwind CSS design
- Tab-based navigation (Upload → Search → Popular)
- Mobile-optimized interface
- Loading states and error handling

## 🍽️ Recipe Database (34+ Recipes)

- **Indian**: Butter Chicken, Palak Paneer, Rajma, Chicken Biryani, Dal Tadka, Aloo Gobi, Tandoori Chicken, Vegetable Biryani
- **Italian**: Classic Tomato Pasta, Margherita Pizza, Chicken Alfredo Pasta, Caprese Salad
- **Asian**: Chicken Teriyaki, Vegetable Fried Rice, Pad Thai, Kimchi Fried Rice, Beef Stir Fry, Miso Soup
- **Mexican**: Black Bean Tacos, Chicken Enchiladas, Guacamole
- **Mediterranean**: Greek Salad, Chicken Souvlaki, Falafel, Hummus
- **American**: Caesar Salad, Grilled Cheese Sandwich, BBQ Pulled Pork, Mac and Cheese
- **French**: French Omelette, Beef Bourguignon
- **Others**: Fish and Chips, Spanish Paella, German Potato Salad

## 🛠️ Quick Start

### Prerequisites:
- Node.js 16+
- MongoDB (local or Atlas)
- Git

### 1. Clone & Setup
```cmd
git clone https://github.com/your-username/Smart-Recipe-Generator.git
cd "Smart-Recipe-Generator"
```

### 2. Backend Setup
```cmd
cd server
npm install
copy .env.example .env
rem Edit .env with your MongoDB URI
npm run seed
npm run dev
rem Server runs on http://localhost:5000
```

### 3. Frontend Setup
```cmd
cd client
npm install
npm run dev
rem Client runs on http://localhost:5173
```

### 4. Test the Application
1. Visit `http://localhost:5173`
2. Try the **Upload Image** tab with food photos
3. Use **Search Recipes** tab to find recipes by ingredients
4. Browse **Popular Recipes** for top-rated dishes

## 🌐 Deployment

### Frontend (Vercel):
```cmd
cd client
npm install -g vercel
npm run build
vercel --prod
```

### Backend (Render.com):
1. Connect GitHub repository to Render
2. Set environment variables: `MONGO_URI`, `PORT=5000`
3. Deploy with automatic builds

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

### Example API Usage:
```bash
# Get Indian vegetarian recipes under 30 minutes
curl "http://localhost:5000/api/recipes?cuisine=Indian&dietary=vegetarian&maxCookTime=30"

# Match recipes by ingredients
curl -X POST http://localhost:5000/api/recipes/match \
  -H "Content-Type: application/json" \
  -d '{"ingredients":["chicken","tomato","onion"],"dietary":[]}'
```

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
├── README.md              # This documentation
└── vercel.json           # Deployment configuration
```

## 🧪 Technology Stack

### Frontend:
- **React 18** - Modern component library
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **TensorFlow.js** - Client-side ML inference
- **Axios** - HTTP client

### Backend:
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB

### AI/ML:
- **TensorFlow.js** - Machine learning in browser
- **COCO-SSD** - Advanced real-time object detection model

### DevOps:
- **Vercel** - Frontend deployment
- **Render/Railway** - Backend hosting
- **Docker** - Containerization

## 📝 Assessment Summary (200 words)

This Smart Recipe Generator demonstrates comprehensive full-stack development expertise using modern MERN stack technologies. The application successfully integrates AI-powered ingredient recognition through TensorFlow.js COCO-SSD object detection, enabling users to upload food photos for automatic ingredient detection.

Key technical achievements include a sophisticated recipe matching algorithm that scores ingredient overlap and handles substitutions, comprehensive filtering system supporting dietary restrictions and preferences, and a responsive React interface built with Tailwind CSS. The backend implements RESTful API design with proper error handling and efficient MongoDB queries.

The project showcases 21+ diverse recipes spanning multiple cuisines with detailed nutritional information, supporting the assessment's database requirements. Advanced features include a 5-star rating system, personalized recipe suggestions, and real-time ingredient mapping from image classifications.

Technical highlights encompass client-side machine learning implementation, scalable component architecture, mobile-first responsive design, and production-ready deployment configurations for modern platforms. The solution demonstrates clean coding practices, proper state management, and optimized user experience with loading states and error handling.

The application addresses all specified requirements while implementing advanced capabilities in AI integration, real-time data processing, and modern web development practices, delivering a production-quality solution within the given timeframe constraints.

---

**Live Demo**: Coming Soon - Deploy to see live application  
**Repository**: https://github.com/Surya1CAadi/-Smart-Recipe-Generator  
**Total Recipes**: 34 diverse recipes across 11+ cuisines