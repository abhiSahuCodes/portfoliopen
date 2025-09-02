
import React from 'react';
import { useDispatch } from 'react-redux';
import { DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { reorderSections, setDragging, addSection } from '../lib/redux/slices/portfolioSlice';
import EditorHeader from '../components/editor/EditorHeader';
import SectionsList from '../components/editor/SectionsList';
import PortfolioCanvas from '../components/editor/PortfolioCanvas';
import { useToast } from '../hooks/use-toast';
import { SECTION_TEMPLATES } from '../components/editor/SectionsList';

const Editor = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  
  // Configure sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Minimum drag distance before activation
      },
    })
  );
  
  const handleDragStart = (event) => {
    dispatch(setDragging(true));
  };
  
  const handleDragEnd = (event) => {
    dispatch(setDragging(false));
    
    const { active, over } = event;
    
    // If no valid drop target
    if (!over) {
      return;
    }
    
    // If dropped in the same position
    if (active.id === over.id) {
      return;
    }
    
    // Handle dropping a template from sections list to canvas
    if (active.id.includes('-template') && over.id === 'portfolio-canvas') {
      // Find the template using the active id
      const template = SECTION_TEMPLATES.find(t => t.id === active.id);
      
      if (template) {
        // Create a new section based on the template
        const newSection = {
          id: `${template.type}-${Date.now()}`,
          type: template.type,
          ...template.template,
        };
        
        // Add the new section to the portfolio
        dispatch(addSection(newSection));
        
        toast({
          title: `${template.title} section added`,
          description: "Section has been added to your portfolio",
        });
      }
      return;
    }
    
    // Handle reordering within the canvas
    if (active.data.current?.type === 'section' && over.data.current?.type === 'section') {
      dispatch(reorderSections({
        sourceIndex: active.data.current.index,
        destinationIndex: over.data.current.index,
      }));
      
      toast({
        title: "Section reordered",
        description: "The section has been moved to a new position",
      });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <EditorHeader />
      
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 flex flex-col lg:flex-row">
          <div className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-gray-200 bg-white overflow-y-auto">
            <SectionsList />
          </div>
          <PortfolioCanvas />
        </div>
      </DndContext>
    </div>
  );
};

export default Editor;