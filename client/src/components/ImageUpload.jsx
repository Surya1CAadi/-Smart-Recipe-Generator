import React, { useRef, useState } from 'react'

export default function ImageUpload({ onImageUpload, loading, modelLoaded }) {
  const fileInputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)
  const [preview, setPreview] = useState(null)

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(file))
      onImageUpload(file)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    handleFileSelect(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  return (
    <div className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-xl shadow-lg border-2 border-transparent bg-clip-border p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-50"></div>
      <div className="relative z-10">
      <h2 className="text-lg font-semibold mb-4 flex items-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        <span className="text-2xl mr-2 animate-pulse">📸</span> Image Recognition
        {!modelLoaded && (
          <span className="ml-2 text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full shadow-md animate-bounce">
            Loading AI...
          </span>
        )}
      </h2>
      
      <div
        className={`border-2 border-dashed rounded-xl p-4 sm:p-8 text-center cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
          dragOver 
            ? 'border-blue-500 bg-gradient-to-br from-blue-100 to-purple-100 shadow-lg scale-[1.02]' 
            : 'border-purple-300 bg-gradient-to-br from-gray-50 to-blue-50 hover:border-purple-400 hover:shadow-md'
        } ${!modelLoaded ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => modelLoaded && !loading && fileInputRef.current?.click()}
      >
        {preview ? (
          <div className="space-y-4">
            <img 
              src={preview} 
              alt="Preview" 
              className="max-w-full max-h-32 sm:max-h-48 mx-auto rounded"
            />
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <p className="text-blue-600 font-medium ml-2">Analyzing image...</p>
              </div>
            ) : (
              <p className="text-green-600 font-semibold bg-green-50 px-4 py-2 rounded-full inline-flex items-center gap-2">
                <span className="animate-bounce">✅</span> Image analyzed! Check ingredients below.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            <div className="text-3xl sm:text-4xl">📷</div>
            <div>
              <p className="text-base sm:text-lg font-medium text-gray-700">
                Drop an image here or click to upload
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                {modelLoaded 
                  ? 'Upload photos of ingredients, fruits, vegetables, or prepared dishes'
                  : 'AI model is loading...'
                }
              </p>
            </div>
          </div>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileSelect(e.target.files[0])}
        className="hidden"
        disabled={!modelLoaded || loading}
      />
      
      {preview && (
        <button
          onClick={() => {
            setPreview(null)
            if (fileInputRef.current) fileInputRef.current.value = ''
          }}
          className="mt-4 text-sm text-gray-600 hover:text-gray-800 underline"
        >
          Upload different image
        </button>
      )}
      
      <div className="mt-4 p-4 bg-gradient-to-r from-cyan-50 to-blue-100 rounded-lg border border-cyan-200 shadow-sm">
        <div className="flex items-start gap-2 text-sm">
          <span className="text-lg animate-pulse">💡</span>
          <div className="text-cyan-800">
            <strong className="text-cyan-900">Pro Tip:</strong> For best results, use clear, well-lit photos with visible ingredients
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}