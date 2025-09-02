import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useSelector, useDispatch } from "react-redux";
import {
  removeSection,
  updateSection,
} from "../../lib/redux/slices/portfolioSlice";
import { useToast } from "../../hooks/use-toast";

// Section Components
import HeaderSection from "./sections/HeaderSection";
import AboutSection from "./sections/AboutSection";
import ProjectsSection from "./sections/ProjectsSection";
import ContactSection from "./sections/ContactSection";

const SectionComponentMap = {
  header: HeaderSection,
  about: AboutSection,
  projects: ProjectsSection,
  contact: ContactSection,
};

// Creating a draggable section component
const DraggableSection = ({ section, index, onRemove, onUpdate }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: section.id,
    data: {
      type: 'section',
      section,
      index
    }
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  
  const SectionComponent = SectionComponentMap[section.type];
  
  if (!SectionComponent) {
    console.error(`No component found for section type: ${section.type}`);
    return null;
  }
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`mb-6 relative group`}
    >
      <div className="absolute top-2 right-2 hidden group-hover:flex space-x-1 z-10">
        <div
          {...attributes}
          {...listeners}
          className="p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-move"
          aria-label="Drag to reorder"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
            />
          </svg>
        </div>
        <button
          type="button"
          onClick={() => onRemove(section.id)}
          className="p-1 rounded-md text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
          aria-label="Remove section"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </button>
      </div>
      <SectionComponent
        section={section}
        onUpdate={(updates) => onUpdate(section.id, updates)}
      />
    </div>
  );
};

const PortfolioCanvas = () => {
  const { currentPortfolio, isDragging } = useSelector(
    (state) => state.portfolio
  );
  const dispatch = useDispatch();
  const { toast } = useToast();
  
  const { setNodeRef } = useDroppable({
    id: 'portfolio-canvas',
    data: {
      type: 'canvas',
      accepts: ['section', 'template']
    }
  });

  const handleRemoveSection = (sectionId) => {
    dispatch(removeSection(sectionId));
    toast({
      title: "Section removed",
      description: "The section has been removed from your portfolio",
    });
  };

  const handleUpdateSection = (sectionId, updates) => {
    dispatch(updateSection({ sectionId, updates }));
  };

  const sortedSections = [...currentPortfolio.sections].sort(
    (a, b) => a.order - b.order
  );

  return (
    <div className="bg-gray-100 dark:bg-gray-900 flex-1 p-6 overflow-y-auto">
      <div
        id="portfolio-preview"
        className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden"
      >
        <div
          ref={setNodeRef}
          className={`min-h-[500px] ${
            isDragging
              ? "bg-blue-50 dark:bg-blue-900/20 border-2 border-dashed border-blue-200 dark:border-blue-700"
              : ""
          }`}
        >
          {sortedSections.length === 0 && (
            <div className="text-center py-16 px-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Your portfolio is empty
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Drag and drop sections from the left sidebar to build your
                portfolio
              </p>
            </div>
          )}

          <SortableContext 
            items={sortedSections.map(s => s.id)}
            strategy={verticalListSortingStrategy}
          >
            {sortedSections.map((section, index) => (
              <DraggableSection
                key={section.id}
                section={section}
                index={index}
                onRemove={handleRemoveSection}
                onUpdate={handleUpdateSection}
              />
            ))}
          </SortableContext>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCanvas;
