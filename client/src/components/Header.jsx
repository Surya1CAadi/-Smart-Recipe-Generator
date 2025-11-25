import React from 'react';
import AuthModal from './AuthModal';

export default function Header({ user, onLogout, onAuth, authOpen, setAuthOpen }) {
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
            <div className="flex items-center gap-4">
              {/* Removed AI-Powered and 34+ Recipes */}
              {user ? (
                <>
                  <span className="font-semibold">{user.name || user.email}</span>
                  <button onClick={onLogout} className="bg-white/20 px-3 py-1 rounded hover:bg-white/30">Logout</button>
                </>
              ) : (
                <button onClick={() => setAuthOpen(true)} className="bg-white/20 px-3 py-1 rounded hover:bg-white/30">Login / Sign Up</button>
              )}
            </div>
          </div>
        </div>
      </div>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onAuth={onAuth} />
    </header>
  );
}