
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSelector, useDispatch } from 'react-redux';
import { addSection } from '../../lib/redux/slices/portfolioSlice';
import { useToast } from '../../hooks/use-toast';

export const SECTION_TEMPLATES = [
  {
    id: 'header-template',
    type: 'header',
    title: 'Header',
    description: 'Add a header section with your name, title, and image',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
    template: {
      content: {
        name: 'Your Name',
        title: 'Professional Title',
        subtitle: 'Brief tagline about yourself',
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80',
      },
    },
  },
  {
    id: 'about-template',
    type: 'about',
    title: 'About',
    description: 'Add an about section with your bio and skills',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    template: {
      content: {
        title: 'About Me',
        description: 'Write a compelling introduction about yourself here.',
        skills: ['Web Design', 'UX/UI', 'Frontend Development'],
      },
    },
  },
  {
    id: 'projects-template',
    type: 'projects',
    title: 'Projects',
    description: 'Add a projects section to showcase your work',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
      </svg>
    ),
    template: {
      content: {
        title: 'My Projects',
        projects: [
          {
            id: 'project1',
            title: 'Project One',
            description: 'Description of your first project',
            image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80',
            link: '#',
          },
        ],
      },
    },
  },
  {
    id: 'contact-template',
    type: 'contact',
    title: 'Contact',
    description: 'Add a contact section with your email and social links',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
    template: {
      content: {
        title: 'Contact Me',
        email: 'your.email@example.com',
        phone: '+1 123 456 7890',
        social: {
          twitter: 'https://twitter.com/yourusername',
          linkedin: 'https://linkedin.com/in/yourusername',
          github: 'https://github.com/yourusername',
        },
      },
    },
  },
];

// Creating a draggable template item component
const DraggableTemplateItem = ({ template, onAdd }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: template.id,
    data: {
      type: 'template',
      template
    }
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`drag-item p-3 bg-white dark:bg-slate-800 border border-gray-200 rounded-md shadow-sm`}
    >
      <div className="flex items-center">
        <div 
          {...attributes} 
          {...listeners}
          className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-md bg-indigo-500 text-white cursor-move"
        >
          {template.icon}
        </div>
        <div className="ml-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {template.title}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-300">
            {template.description}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onAdd(template)}
        className="mt-2 w-full inline-flex justify-center items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white dark:bg-slate-500 dark:text-slate-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Add Section
      </button>
    </div>
  );
};

const SectionsList = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { setNodeRef } = useDroppable({
    id: 'sections-list',
    data: {
      accepts: ['template']
    }
  });

  const handleAddSection = (template) => {
    const newSection = {
      id: `${template.type}-${Date.now()}`,
      type: template.type,
      ...template.template,
    };
    
    dispatch(addSection(newSection));
    toast({
      title: `${template.title} section added`,
      description: "Drag and drop to reposition the section",
    });
  };

  return (
    <div className="bg-white h-full dark:bg-slate-600">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Add Sections</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
          Click add to add sections to the canvas
        </p>
      </div>
      
      <div className="p-4">
        <div
          ref={setNodeRef}
          className="space-y-3"
        >
          <SortableContext 
            items={SECTION_TEMPLATES.map(t => t.id)} 
            strategy={verticalListSortingStrategy}
          >
            {SECTION_TEMPLATES.map((template) => (
              <DraggableTemplateItem
                key={template.id}
                template={template}
                onAdd={handleAddSection}
              />
            ))}
          </SortableContext>
        </div>
      </div>
    </div>
  );
};

export default SectionsList;