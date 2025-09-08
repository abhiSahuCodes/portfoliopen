
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Sparkles, Loader2 } from 'lucide-react';
import { apiEnhanceText, apiGenerateSkills } from '../../../lib/api/ai';
import AIPromptDialog from '../../ui/ai-prompt-dialog';

const AboutSection = ({ section, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(section.content);
  const [newSkill, setNewSkill] = useState('');
  const [isEnhancingDescription, setIsEnhancingDescription] = useState(false);
  const [isGeneratingSkills, setIsGeneratingSkills] = useState(false);
  const [showDescriptionDialog, setShowDescriptionDialog] = useState(false);
  const [showSkillsDialog, setShowSkillsDialog] = useState(false);
  const { user, subscription } = useSelector((state) => state.auth);
  const isPro = subscription === 'pro';

  // Edit mode
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add Skills
  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  // Remove Skills
  const handleRemoveSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  // AI Enhancement for Description
  const handleEnhanceDescription = async (prompt) => {
    if (!isPro) return;
    
    setIsEnhancingDescription(true);
    setShowDescriptionDialog(false);
    try {
      const response = await apiEnhanceText(prompt, 'about');
      if (response.success) {
        setFormData(prev => ({
          ...prev,
          description: response.data.enhanced
        }));
      }
    } catch (error) {
      console.error('Failed to enhance description:', error);
    } finally {
      setIsEnhancingDescription(false);
    }
  };

  // AI Skills Generation
  const handleGenerateSkills = async (prompt) => {
    if (!isPro) return;
    
    setIsGeneratingSkills(true);
    setShowSkillsDialog(false);
    try {
      const response = await apiGenerateSkills(prompt, formData.skills);
      if (response.success) {
        const newSkills = response.data.skills.filter(skill => 
          !formData.skills.some(existing => 
            existing.toLowerCase() === skill.toLowerCase()
          )
        );
        setFormData(prev => ({
          ...prev,
          skills: [...prev.skills, ...newSkills.slice(0, 5)]
        }));
      }
    } catch (error) {
      console.error('Failed to generate skills:', error);
    } finally {
      setIsGeneratingSkills(false);
    }
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ content: formData });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-sm rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Section Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                {isPro && (
                  <button
                    type="button"
                    onClick={() => setShowDescriptionDialog(true)}
                    disabled={isEnhancingDescription}
                    className="inline-flex items-center px-2 py-1 text-xs font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-md hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isEnhancingDescription ? (
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    ) : (
                      <Sparkles className="h-3 w-3 mr-1" />
                    )}
                    {isEnhancingDescription ? 'Enhancing...' : 'AI Enhance'}
                  </button>
                )}
              </div>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Skills
                </label>
                {isPro && (
                  <button
                    type="button"
                    onClick={() => setShowSkillsDialog(true)}
                    disabled={isGeneratingSkills}
                    className="inline-flex items-center px-2 py-1 text-xs font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-md hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGeneratingSkills ? (
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    ) : (
                      <Sparkles className="h-3 w-3 mr-1" />
                    )}
                    {isGeneratingSkills ? 'Generating...' : 'AI Generate'}
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.skills.map((skill, index) => (
                  <div 
                    key={index}
                    className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(index)}
                      className="ml-2 text-indigo-500 hover:text-indigo-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill"
                  className="block w-full border border-gray-300 dark:border-gray-600 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add
                </button>
              </div>
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
        
        {/* AI Prompt Dialogs */}
        <AIPromptDialog
           isOpen={showDescriptionDialog}
           onClose={() => setShowDescriptionDialog(false)}
           onSubmit={handleEnhanceDescription}
           title="Enhance About Description"
           description="Provide keywords or a description to enhance your about section with AI."
           placeholder="Describe what you want to highlight in your about section (e.g., 'Focus on my leadership skills and passion for innovation')..."
           isLoading={isEnhancingDescription}
           submitButtonText="Enhance"
         />
        
        <AIPromptDialog
           isOpen={showSkillsDialog}
           onClose={() => setShowSkillsDialog(false)}
           onSubmit={handleGenerateSkills}
           title="Generate Skills"
           description="Describe your field, role, or interests to generate relevant skills."
           placeholder="Describe your field or role to generate relevant skills (e.g., 'Frontend developer with React expertise')..."
           isLoading={isGeneratingSkills}
           submitButtonText="Generate"
         />
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
        <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
          {section.content.title}
        </h2>
        
        <div className="mb-8">
          <p className="text-gray-700 text-lg leading-relaxed">
            {section.content.description}
          </p>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {section.content.skills.map((skill, index) => (
              <span 
                key={index}
                className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-10 rounded-lg">
        <button
          type="button"
          className="bg-white text-indigo-600 py-2 px-4 rounded-md shadow-sm text-sm font-medium"
        >
          Edit About Section
        </button>
      </div>
    </div>
  );
};

export default AboutSection;
