
import React, { useState } from 'react';

const HeaderSection = ({ section, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(section.content);

// Handle for change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle for submit
  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ content: formData });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white border border-gray-300 shadow-sm rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Professional Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700">
                Subtitle/Tagline
              </label>
              <input
                type="text"
                id="subtitle"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                Profile Image URL
              </label>
              <input
                type="text"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  // View mode
  return (
    <div 
      className="relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16 px-4 sm:px-6 rounded-t-lg"
      onClick={() => setIsEditing(true)}
    >
      <div className="flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto">
        <div className="text-center md:text-left mb-6 md:mb-0">
          <h1 className="text-4xl font-bold mb-2">{section.content.name}</h1>
          <h2 className="text-xl font-medium mb-3">{section.content.title}</h2>
          <p className="text-indigo-200">{section.content.subtitle}</p>
        </div>
        
        <div className="shrink-0">
          <img
            src={section.content.image}
            alt={section.content.name}
            className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-md"
          />
        </div>
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-20 rounded-t-lg">
        <button
          type="button"
          className="bg-white text-indigo-600 py-2 px-4 rounded-md shadow-sm text-sm font-medium"
        >
          Edit Header
        </button>
      </div>
    </div>
  );
};

export default HeaderSection;
