import React, { useState } from 'react';
import axios from 'axios';

export default function AuthModal({ open, onClose, onAuth }) {
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let res;
      if (mode === 'signup') {
        res = await axios.post('/api/signup', { name, email, password });
      } else {
        res = await axios.post('/api/login', { email, password });
      }
      if (res.data.ok && res.data.user) {
        onAuth(res.data.user);
        onClose();
      } else {
        setError(res.data.error || 'Unknown error');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl">×</button>
        <h2 className="text-xl font-bold mb-4 text-center">{mode === 'signup' ? 'Sign Up' : 'Login'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded font-semibold" disabled={loading}>
            {loading ? 'Please wait...' : (mode === 'signup' ? 'Sign Up' : 'Login')}
          </button>
        </form>
        <div className="mt-4 text-center text-sm">
          {mode === 'signup' ? (
            <span>Already have an account? <button className="text-blue-600 underline" onClick={() => setMode('login')}>Login</button></span>
          ) : (
            <span>New user? <button className="text-blue-600 underline" onClick={() => setMode('signup')}>Sign Up</button></span>
          )}
        </div>
      </div>
    </div>
  );
}
