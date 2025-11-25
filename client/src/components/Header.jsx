import React from 'react'

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-lg border-b w-full sticky top-0 z-50">
      <div className="w-full px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-3xl animate-bounce">🍳</div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Smart Recipe Generator
              </h1>
              <p className="text-blue-100 text-sm">
                Find recipes from your ingredients or food photos
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-6 text-sm text-white">
            <div className="flex items-center space-x-2 bg-white/20 rounded-full px-3 py-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/20 rounded-full px-3 py-2">
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
              <span>34+ Recipes</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}