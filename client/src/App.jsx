import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function App(){
  const [health, setHealth] = useState(null)
  const [recipes, setRecipes] = useState([])

  useEffect(()=>{
    axios.get('http://localhost:5000/api/health')
      .then(r=>setHealth(r.data))
      .catch(()=>setHealth({ ok: false }))

    axios.get('http://localhost:5000/api/recipes')
      .then(r=> setRecipes(r.data.data || []))
      .catch(()=> setRecipes([]))
  },[])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Smart Recipe Generator — Client (Part 1)</h1>
        <div className="mb-4">API health: {health ? JSON.stringify(health) : 'checking...'}</div>
        <div>
          <h2 className="text-xl font-semibold">Sample recipes from backend</h2>
          <ul>
            {recipes.map(r => (
              <li key={r._id} className="p-2 border rounded my-2 bg-white">
                <div className="font-semibold">{r.title}</div>
                <div className="text-sm text-gray-600">Cuisine: {r.cuisine || '—'}</div>
              </li>
            ))}
            {recipes.length===0 && <li>No recipes yet — run seed or add recipes.</li>}
          </ul>
        </div>
      </div>
    </div>
  )
}
