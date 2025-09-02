
import React, { useState } from 'react';

const ProjectForm = ({ project, onSave, onCancel }) => {
  const [formData, setFormData] = useState(project || {
    id: `project-${Date.now()}`,
    title: '',
    description: '',
    image: '',
    link: '',
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border border-gray-200 rounded-md p-4 bg-gray-50">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Project Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
          Image URL
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
      
      <div>
        <label htmlFor="link" className="block text-sm font-medium text-gray-700">
          Project Link
        </label>
        <input
          type="text"
          id="link"
          name="link"
          value={formData.link}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      
      <div className="flex justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
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
    </form>
  );
};

const ProjectsSection = ({ section, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(section.content);
  const [editingProject, setEditingProject] = useState(null);
  const [isAddingProject, setIsAddingProject] = useState(false);

  const handleTitleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      title: e.target.value
    }));
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setIsAddingProject(false);
  };

  const handleAddProject = () => {
    setIsAddingProject(true);
    setEditingProject(null);
  };

  const handleSaveProject = (project) => {
    const isNew = !formData.projects.find(p => p.id === project.id);
    
    if (isNew) {
      setFormData(prev => ({
        ...prev,
        projects: [...prev.projects, project]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        projects: prev.projects.map(p => p.id === project.id ? project : p)
      }));
    }
    
    setEditingProject(null);
    setIsAddingProject(false);
  };

  const handleRemoveProject = (projectId) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== projectId)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ content: formData });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white border border-gray-300 shadow-sm rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="section-title" className="block text-sm font-medium text-gray-700">
                Section Title
              </label>
              <input
                type="text"
                id="section-title"
                value={formData.title}
                onChange={handleTitleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Projects</h3>
                <button
                  type="button"
                  onClick={handleAddProject}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add Project
                </button>
              </div>
              
              {(isAddingProject || editingProject) && (
                <ProjectForm
                  project={editingProject}
                  onSave={handleSaveProject}
                  onCancel={() => {
                    setEditingProject(null);
                    setIsAddingProject(false);
                  }}
                />
              )}
              
              {!isAddingProject && !editingProject && (
                <div className="space-y-4">
                  {formData.projects.map(project => (
                    <div key={project.id} className="border border-gray-200 rounded-md p-4 bg-white">
                      <div className="flex justify-between">
                        <h4 className="text-base font-medium text-gray-900">{project.title}</h4>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => handleEditProject(project)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveProject(project.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                    </div>
                  ))}
                </div>
              )}
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
      className="relative bg-white py-12 px-4 sm:px-6 rounded-lg shadow-sm"
      onClick={() => setIsEditing(true)}
    >
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 pb-2 border-b border-gray-200">
          {section.content.title}
        </h2>
        
        {section.content.projects.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No projects added yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {section.content.projects.map(project => (
              <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition">
                <div className="h-48 bg-gray-200 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Project →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-10 rounded-lg">
        <button
          type="button"
          className="bg-white text-indigo-600 py-2 px-4 rounded-md shadow-sm text-sm font-medium"
        >
          Edit Projects Section
        </button>
      </div>
    </div>
  );
};

export default ProjectsSection;
