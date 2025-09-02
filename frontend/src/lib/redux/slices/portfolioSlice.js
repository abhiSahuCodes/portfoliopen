import { createSlice } from "@reduxjs/toolkit";
import { arrayMove } from "@dnd-kit/sortable";

// Initial portfolio template
const initialState = {
  currentPortfolio: {
    id: "default",
    title: "My Portfolio",
    sections: [
      {
        id: "header",
        type: "header",
        content: {
          name: "Your Name",
          title: "Professional Title",
          subtitle: "Brief tagline about yourself",
          image:
            "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80",
        },
        order: 0,
      },
      {
        id: "about",
        type: "about",
        content: {
          title: "About Me",
          description: "Write a compelling introduction about yourself here.",
          skills: ["Web Design", "UX/UI", "Frontend Development"],
        },
        order: 1,
      },
      {
        id: "projects",
        type: "projects",
        content: {
          title: "My Projects",
          projects: [
            {
              id: "project1",
              title: "Project One",
              description: "Description of your first project",
              image:
                "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80",
              link: "#",
            },
            {
              id: "project2",
              title: "Project Two",
              description: "Description of your second project",
              image:
                "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80",
              link: "#",
            },
          ],
        },
        order: 2,
      },
      {
        id: "contact",
        type: "contact",
        content: {
          title: "Contact Me",
          email: "your.email@example.com",
          phone: "+1 123 456 7890",
          social: {
            twitter: "https://twitter.com/yourusername",
            linkedin: "https://linkedin.com/in/yourusername",
            github: "https://github.com/yourusername",
          },
        },
        order: 3,
      },
    ],
    theme: {
      primaryColor: "#6E59A5",
      secondaryColor: "#2DD4BF",
      fontFamily: "Inter, sans-serif",
    },
  },
  savedPortfolios: [],
  isDragging: false,
};

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    // Update portfolio title
    updatePortfolioTitle: (state, action) => {
      state.currentPortfolio.title = action.payload;
    },

    // Update section
    updateSection: (state, action) => {
      const { sectionId, updates } = action.payload;
      const sectionIndex = state.currentPortfolio.sections.findIndex(
        (section) => section.id === sectionId
      );

      if (sectionIndex !== -1) {
        state.currentPortfolio.sections[sectionIndex] = {
          ...state.currentPortfolio.sections[sectionIndex],
          ...updates,
        };
      }
    },

    // Add section
    addSection: (state, action) => {
      const newSection = {
        ...action.payload,
        id: `${action.payload.type}-${Date.now()}`,
        order: state.currentPortfolio.sections.length,
      };
      state.currentPortfolio.sections.push(newSection);
    },

    // Remove section
    removeSection: (state, action) => {
      const sectionId = action.payload;
      state.currentPortfolio.sections = state.currentPortfolio.sections.filter(
        (section) => section.id !== sectionId
      );

      // Reorder remaining sections
      state.currentPortfolio.sections.forEach((section, index) => {
        section.order = index;
      });
    },

    // Reorder sections
    reorderSections: (state, action) => {
      const { sourceIndex, destinationIndex } = action.payload;
      state.currentPortfolio.sections = arrayMove(
        state.currentPortfolio.sections,
        sourceIndex,
        destinationIndex
      );

      // Update order values
      state.currentPortfolio.sections.forEach((section, index) => {
        section.order = index;
      });
    },

    // Update theme
    updateTheme: (state, action) => {
      state.currentPortfolio.theme = {
        ...state.currentPortfolio.theme,
        ...action.payload,
      };
    },

    // Set dragging state
    setDragging: (state, action) => {
      state.isDragging = action.payload;
    },

    // Save portfolio
    savePortfolio: (state) => {
      const portfolioExists = state.savedPortfolios.some(
        (p) => p.id === state.currentPortfolio.id
      );

      if (!portfolioExists) {
        // Deep copy to avoid reference to currentPortfolio
        state.savedPortfolios.push(
          JSON.parse(JSON.stringify(state.currentPortfolio))
        );
      } else {
        state.savedPortfolios = state.savedPortfolios.map((p) =>
          p.id === state.currentPortfolio.id
            ? JSON.parse(JSON.stringify(state.currentPortfolio))
            : p
        );
      }
    },

    // Ensure payload merges with defaults so Editor never mounts with missing fields
    // Load portfolio
    loadPortfolio: (state, action) => {
      const base = JSON.parse(JSON.stringify(initialState.currentPortfolio));
      const incoming = JSON.parse(JSON.stringify(action.payload || {}));

      // Map backend _id to frontend id for consistency
      if (incoming._id && !incoming.id) {
        incoming.id = incoming._id;
      }

      // Normalize sections with order (fallback to defaults when missing or empty)
      let sections =
        Array.isArray(incoming.sections) && incoming.sections.length > 0
          ? incoming.sections
          : base.sections;
      sections = sections.map((s, idx) => ({
        ...s,
        order: typeof s.order === "number" ? s.order : idx,
      }));

      const theme = incoming.theme
        ? { ...base.theme, ...incoming.theme }
        : base.theme;

      state.currentPortfolio = {
        ...base,
        ...incoming,
        sections,
        theme,
      };
    },

    // Import portfolio (use same merge strategy)
    importPortfolio: (state, action) => {
      const base = JSON.parse(JSON.stringify(initialState.currentPortfolio));
      const incoming = JSON.parse(JSON.stringify(action.payload || {}));

      // Map backend _id to frontend id for consistency
      if (incoming._id && !incoming.id) {
        incoming.id = incoming._id;
      }

      let sections =
        Array.isArray(incoming.sections) && incoming.sections.length > 0
          ? incoming.sections
          : base.sections;
      sections = sections.map((s, idx) => ({
        ...s,
        order: typeof s.order === "number" ? s.order : idx,
      }));

      const theme = incoming.theme
        ? { ...base.theme, ...incoming.theme }
        : base.theme;

      state.currentPortfolio = {
        ...base,
        ...incoming,
        sections,
        theme,
      };
    },

    // Create new portfolio
    createNewPortfolio: (state, action) => {
      const id = `portfolio-${Date.now()}`;
      // Deep copy of initial state
      const newPortfolio = JSON.parse(
        JSON.stringify(initialState.currentPortfolio)
      );
      newPortfolio.id = id;
      newPortfolio.title =
        action.payload || `Portfolio ${state.savedPortfolios.length + 1}`;
      state.currentPortfolio = newPortfolio;
    },

    // Delete portfolio
    deletePortfolio: (state, action) => {
      const portfolioId = action.payload;
      state.savedPortfolios = state.savedPortfolios.filter(
        (portfolio) => portfolio.id !== portfolioId
      );
    },

    // Set saved portfolios from server
    setSavedPortfolios: (state, action) => {
      const portfolios = Array.isArray(action.payload) ? action.payload : [];
      // Map backend _id to frontend id for consistency
      state.savedPortfolios = portfolios.map((portfolio) => ({
        ...portfolio,
        id: portfolio._id || portfolio.id,
      }));
    },

    // Save portfolio (local state only - backend save handled by TanStack Query)
    savePortfolio: (state) => {
      const portfolioExists = state.savedPortfolios.some(
        (p) => p.id === state.currentPortfolio.id
      );

      if (!portfolioExists) {
        // Deep copy to avoid reference to currentPortfolio
        state.savedPortfolios.push(
          JSON.parse(JSON.stringify(state.currentPortfolio))
        );
      } else {
        state.savedPortfolios = state.savedPortfolios.map((p) =>
          p.id === state.currentPortfolio.id
            ? JSON.parse(JSON.stringify(state.currentPortfolio))
            : p
        );
      }
    },
  },
});

export const {
  updatePortfolioTitle,
  updateSection,
  addSection,
  removeSection,
  reorderSections,
  updateTheme,
  setDragging,
  savePortfolio,
  loadPortfolio,
  importPortfolio,
  createNewPortfolio,
  deletePortfolio,
  setSavedPortfolios,
} = portfolioSlice.actions;

export default portfolioSlice.reducer;
