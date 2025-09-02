import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  loadPortfolio,
  importPortfolio,
  setSavedPortfolios,
} from "../lib/redux/slices/portfolioSlice";
import {
  apiListPortfolios,
  apiCreatePortfolio,
  apiDeletePortfolio,
} from "../lib/api/portfolios";
import { useToast } from "../hooks/use-toast";
import { importFromJSON } from "../lib/utils/exportUtils";
import Navbar from "../components/common/Navbar";

const Dashboard = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [newPortfolioName, setNewPortfolioName] = useState("");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewPortfolio, setPreviewPortfolio] = useState(null);
  const [portfolioToDelete, setPortfolioToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef(null);
  const { user, subscription } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch portfolios from server
  const {
    data: portfolios = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["portfolios"],
    queryFn: apiListPortfolios,
    select: (data) => data.portfolios || data, // Extract portfolios from response
    onSuccess: (data) => {
      dispatch(setSavedPortfolios(data));
    },
  });

  // Create portfolio mutation
  const createPortfolioMutation = useMutation({
    mutationFn: apiCreatePortfolio,
    onSuccess: (response) => {
      queryClient.invalidateQueries(["portfolios"]);
      // Extract portfolio from response object
      const newPortfolio = response.portfolio || response;
      dispatch(loadPortfolio(newPortfolio));
      navigate("/editor");
      toast({
        title:
          newPortfolio.sections?.length > 0
            ? "Portfolio imported"
            : "Portfolio created",
        description:
          newPortfolio.sections?.length > 0
            ? `Successfully imported: ${newPortfolio.title}`
            : `Started new portfolio: ${newPortfolio.title}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create portfolio",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete portfolio mutation
  const deletePortfolioMutation = useMutation({
    mutationFn: apiDeletePortfolio,
    onSuccess: () => {
      queryClient.invalidateQueries(["portfolios"]);
      toast({
        title: "Portfolio deleted",
        description: `Successfully deleted: ${portfolioToDelete?.title}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete portfolio",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreatePortfolio = () => {
    if (newPortfolioName.trim()) {
      createPortfolioMutation.mutate({
        title: newPortfolioName.trim(),
      });
      setNewPortfolioName("");
      setIsCreating(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleImportPortfolio = (e) => {
    const file = e.target.files[0];
    if (file) {
      importFromJSON(file)
        .then((portfolio) => {
          // Create a new portfolio in the database with imported data
          createPortfolioMutation.mutate({
            title: portfolio.title || "Imported Portfolio",
            sections: portfolio.sections || [],
            theme: portfolio.theme || {},
            isPublic: portfolio.isPublic || false,
          });
        })
        .catch((error) => {
          toast({
            title: "Import failed",
            description: error.message,
            variant: "destructive",
          });
        });
    }
    e.target.value = null;
  };

  const handleLoadPortfolio = (portfolio) => {
    dispatch(loadPortfolio(portfolio));
    navigate("/editor");
  };

  const handlePreviewPortfolio = (portfolio) => {
    setPreviewPortfolio(portfolio);
    setIsPreviewMode(true);
  };

  const closePreview = () => {
    setIsPreviewMode(false);
    setPreviewPortfolio(null);
  };

  const handleDeleteClick = (portfolio) => {
    setPortfolioToDelete(portfolio);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (portfolioToDelete) {
      deletePortfolioMutation.mutate(
        portfolioToDelete._id || portfolioToDelete.id
      );
      setPortfolioToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

  const cancelDelete = () => {
    setPortfolioToDelete(null);
    setShowDeleteConfirm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <main className="py-16">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="px-4 py-8 sm:px-0">
            <div className="pb-5 border-b border-gray-200 dark:border-gray-700 sm:flex sm:items-center sm:justify-between">
              <h3 className="text-2xl leading-6 font-medium text-gray-900 dark:text-gray-100">
                Dashboard
              </h3>
              <div className="mt-3 flex sm:mt-0 sm:ml-4">
                <button
                  type="button"
                  onClick={() => setIsCreating(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create new portfolio
                </button>
                <button
                  type="button"
                  onClick={handleImportClick}
                  className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Import portfolio
                </button>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportPortfolio}
                  className="hidden"
                  ref={fileInputRef}
                  id="import-file"
                  data-testid="import-file-input"
                />
              </div>
            </div>

            <div className="mt-6">
              <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-12 w-12 text-indigo-400 dark:text-indigo-300"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
                        />
                      </svg>
                    </div>
                    <div className="ml-5 flex-1">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                        Welcome{user ? `, ${user.name}` : ""}!
                      </h3>
                      <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400">
                        <p>
                          Create a new portfolio or manage your existing ones.
                        </p>
                      </div>
                      {subscription === "free" && (
                        <div className="mt-4">
                          <button
                            onClick={() => navigate("/pricing")}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                          >
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Get Pro
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {isPreviewMode && previewPortfolio && (
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto p-6 shadow-xl">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Preview: {previewPortfolio.title}
                    </h3>
                    <button
                      onClick={closePreview}
                      className="p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                      aria-label="Close preview"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="border border-gray-200 rounded-md p-4 max-h-[70vh] overflow-auto">
                    {/* Section array copy to avoid modification to original */}
                    {[...previewPortfolio.sections]
                      .sort((a, b) => a.order - b.order)
                      .map((section) => (
                        <div
                          key={section.id}
                          className="mb-6 p-4 border-b border-gray-200 last:border-b-0"
                        >
                          {section.type === "header" && (
                            <div className="text-center mb-8">
                              {section.content.image && (
                                <div className="w-32 h-32 mx-auto mb-4 overflow-hidden rounded-full">
                                  <img
                                    src={section.content.image}
                                    alt={section.content.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <h1 className="text-3xl font-bold text-gray-900">
                                {section.content.name}
                              </h1>
                              <p className="mt-2 text-xl text-gray-700">
                                {section.content.title}
                              </p>
                              <p className="text-md text-gray-500 mt-1">
                                {section.content.subtitle}
                              </p>
                            </div>
                          )}

                          {section.type === "about" && (
                            <div className="mb-8">
                              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                {section.content.title}
                              </h2>
                              <p className="text-gray-700 mb-6">
                                {section.content.description}
                              </p>
                              {section.content.skills &&
                                section.content.skills.length > 0 && (
                                  <div>
                                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                                      Skills
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                      {section.content.skills.map(
                                        (skill, index) => (
                                          <span
                                            key={index}
                                            className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                                          >
                                            {skill}
                                          </span>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}
                            </div>
                          )}

                          {section.type === "projects" && (
                            <div className="mb-8">
                              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                {section.content.title}
                              </h2>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {section.content.projects.map((project) => (
                                  <div
                                    key={project.id}
                                    className="border border-gray-200 rounded-lg overflow-hidden"
                                  >
                                    {project.image && (
                                      <div className="h-48 overflow-hidden">
                                        <img
                                          src={project.image}
                                          alt={project.title}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                    )}
                                    <div className="p-4">
                                      <h3 className="text-lg font-medium text-gray-900">
                                        {project.title}
                                      </h3>
                                      <p className="text-gray-700 mt-2">
                                        {project.description}
                                      </p>
                                      {project.link && (
                                        <a
                                          href={project.link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-indigo-600 hover:text-indigo-900 mt-2 inline-block"
                                        >
                                          View Project
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {section.type === "contact" && (
                            <div className="mb-8">
                              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                {section.content.title}
                              </h2>
                              <div className="space-y-2">
                                {section.content.email && (
                                  <p className="flex items-center gap-2">
                                    <span className="font-medium">Email:</span>
                                    <a
                                      href={`mailto:${section.content.email}`}
                                      className="text-indigo-600 hover:text-indigo-900"
                                    >
                                      {section.content.email}
                                    </a>
                                  </p>
                                )}
                                {section.content.phone && (
                                  <p className="flex items-center gap-2">
                                    <span className="font-medium">Phone:</span>
                                    <a
                                      href={`tel:${section.content.phone}`}
                                      className="text-indigo-600 hover:text-indigo-900"
                                    >
                                      {section.content.phone}
                                    </a>
                                  </p>
                                )}
                                {section.content.social && (
                                  <div className="flex items-center gap-4 mt-4">
                                    {section.content.social.github && (
                                      <a
                                        href={section.content.social.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-700 hover:text-indigo-600"
                                      >
                                        GitHub
                                      </a>
                                    )}
                                    {section.content.social.linkedin && (
                                      <a
                                        href={section.content.social.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-700 hover:text-indigo-600"
                                      >
                                        LinkedIn
                                      </a>
                                    )}
                                    {section.content.social.twitter && (
                                      <a
                                        href={section.content.social.twitter}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-700 hover:text-indigo-600"
                                      >
                                        Twitter
                                      </a>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {isCreating && (
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Create new portfolio
                  </h3>
                  <input
                    type="text"
                    value={newPortfolioName}
                    onChange={(e) => setNewPortfolioName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newPortfolioName.trim()) {
                        handleCreatePortfolio();
                      }
                    }}
                    placeholder="Portfolio name"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mb-4 dark:text-gray-900 py-2 px-2"
                    autoFocus
                  />
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreating(false);
                        setNewPortfolioName("");
                      }}
                      className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleCreatePortfolio}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Create
                    </button>
                  </div>
                </div>
              </div>
            )}
            {showDeleteConfirm && portfolioToDelete && (
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Delete Portfolio
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Are you sure you want to delete "{portfolioToDelete.title}"?
                    This action cannot be undone.
                  </p>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={cancelDelete}
                      className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={confirmDelete}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6">
              <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-4">
                Recent Portfolios
              </h3>
              {isLoading ? (
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="px-4 py-5 sm:p-6 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      Loading portfolios...
                    </p>
                  </div>
                </div>
              ) : error ? (
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-red-200">
                  <div className="px-4 py-5 sm:p-6 text-center">
                    <p className="text-red-600">
                      Failed to load portfolios: {error.message}
                    </p>
                  </div>
                </div>
              ) : portfolios.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {portfolios.map((portfolio) => (
                    <div
                      key={portfolio._id || portfolio.id}
                      className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                    >
                      <div className="px-4 py-5 sm:p-6">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 truncate">
                          {portfolio.title}
                        </h4>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          Last edited:{" "}
                          {new Date(
                            portfolio.updatedAt || portfolio.createdAt
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-4 sm:px-6 bg-gray-50 dark:bg-gray-700">
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => handleLoadPortfolio(portfolio)}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-white dark:hover:text-gray-300 text-sm font-medium transition-colors duration-200"
                          >
                            Edit
                          </button>
                          <span className="text-gray-300 dark:text-gray-500">
                            |
                          </span>
                          <button
                            onClick={() => handlePreviewPortfolio(portfolio)}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-white dark:hover:text-gray-300 text-sm font-medium transition-colors duration-200"
                          >
                            Preview
                          </button>
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={() => handleDeleteClick(portfolio)}
                            className="text-red-600 hover:text-red-900 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="px-4 py-5 sm:p-6 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      No portfolios yet. Create one to get started!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
