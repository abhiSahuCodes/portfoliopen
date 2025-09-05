
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { loadPortfolio, reorderSections, setDragging, addSection } from '../lib/redux/slices/portfolioSlice';
import { apiGetPortfolio } from '../lib/api/portfolios';
import EditorHeader from '../components/editor/EditorHeader';
import SectionsList from '../components/editor/SectionsList';
import PortfolioCanvas from '../components/editor/PortfolioCanvas';
import { useToast } from '../hooks/use-toast';
import { SECTION_TEMPLATES } from '../components/editor/SectionsList';

const Editor = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Fetch portfolio by ID from URL
  const { isLoading, isError, error, data } = useQuery({
    queryKey: ['portfolio', id],
    queryFn: () => apiGetPortfolio(id),
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data) {
      // The backend controller for getById returns { success: true, portfolio: portfolioDoc }
      // We need to dispatch the nested portfolio object.
      const portfolioToLoad = data.portfolio || data;
      dispatch(loadPortfolio(portfolioToLoad));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (!id) {
      navigate('/dashboard', { replace: true });
    }
  }, [id, navigate]);

  useEffect(() => {
    if (isError) {
      toast({
        title: 'Failed to load portfolio',
        description: error?.message || 'Unable to load the selected portfolio.',
        variant: 'destructive',
      });
      navigate('/dashboard', { replace: true });
    }
  }, [isError, error, navigate, toast]);
  
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

  if (!id || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-3 text-gray-600">
          <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading portfolio...</span>
        </div>
      </div>
    );
  }
  
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