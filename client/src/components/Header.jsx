import React from 'react'

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-3xl">🍳</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Smart Recipe Generator
              </h1>
              <p className="text-gray-600 text-sm">
                Find recipes from your ingredients or food photos
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>20+ Cuisines</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}