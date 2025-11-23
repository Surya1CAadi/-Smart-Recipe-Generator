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
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        📸 Image Recognition
        {!modelLoaded && (
          <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
            Loading AI...
          </span>
        )}
      </h2>
      
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          dragOver 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
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
              className="max-w-full max-h-48 mx-auto rounded"
            />
            {loading ? (
              <p className="text-blue-600">Analyzing image...</p>
            ) : (
              <p className="text-green-600">Image analyzed! Check ingredients below.</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-4xl">📷</div>
            <div>
              <p className="text-lg font-medium text-gray-700">
                Drop an image here or click to upload
              </p>
              <p className="text-sm text-gray-500 mt-2">
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
      
      <div className="mt-4 p-3 bg-blue-50 rounded text-xs text-blue-800">
        💡 <strong>Tip:</strong> For best results, use clear, well-lit photos with visible ingredients
      </div>
    </div>
  )
}