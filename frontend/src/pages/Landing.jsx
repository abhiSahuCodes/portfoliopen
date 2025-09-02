
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import photographer from '../assets/photographer.jpg';
import developer from '../assets/developer.jpg';
import designer from '../assets/designer.jpg';
import Navbar from '../components/common/Navbar';

const Landing = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <motion.div 
        className="pt-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="relative">
          {/* <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gray-100 dark:bg-gray-800" /> */}
          <div className="mx-auto max-w-7xl">
            <motion.div 
              className="relative shadow-xl sm:overflow-hidden rounded-3xl backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 dark:border-white/10"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div 
                className="absolute inset-0 rounded-3xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <div className="h-full w-full object-cover bg-gradient-to-br from-indigo-600/30 via-purple-600/20 to-pink-600/30 dark:from-indigo-800/40 dark:via-purple-800/30 dark:to-pink-800/40 backdrop-blur-sm" />
              </motion.div>
              <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8 backdrop-blur-sm">
                <motion.h1 
                  className="text-center text-4xl font-bold tracking-tight sm:text-5xl md:text-5xl lg:text-6xl"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                >
                  <motion.span 
                    className="block text-white mb-2"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                  >
                    Create stunning portfolios
                  </motion.span>
                  <motion.span 
                    className="block text-indigo-200"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                  >
                    with drag and drop simplicity
                  </motion.span>
                </motion.h1>
                <motion.p 
                  className="mx-auto mt-6 max-w-lg text-center text-lg md:text-xl text-indigo-200 sm:max-w-3xl"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.1, duration: 0.6 }}
                >
                  Build professional portfolios in minutes, not days. Easily showcase your skills, projects, and 
                  experience with our intuitive portfolio builder.
                </motion.p>
                <motion.div 
                  className="mx-auto mt-10 max-w-sm md:flex md:max-w-none md:justify-center"
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.3, duration: 0.6 }}
                >
                  <div className="space-y-4 md:mx-auto md:inline-grid md:grid-cols-2 md:gap-5 md:space-y-0">
                    <motion.div
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <Link
                        to="/register"
                        className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-indigo-700 shadow-sm hover:bg-indigo-50 md:px-8 transition-all duration-300"
                      >
                        Get started for free
                      </Link>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <Link
                        to="/features"
                        className="flex items-center justify-center rounded-md border border-transparent bg-indigo-500 bg-opacity-60 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-opacity-70 md:px-8 transition-all duration-300"
                      >
                        Learn more
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Features Section */}
      <div className="py-24 animate-fade-in-up delay-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="md:text-center lg:text-center">
            <h2 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">Features</h2>
            <p className="mt-2 text-3xl font-bold leading-8 tracking-tight text-gray-900 dark:text-gray-100 md:text-4xl">
              Everything you need to build amazing portfolios
            </p>
            <p className="mt-4 max-w-2xl text-lg md:text-xl text-gray-500 dark:text-gray-400 md:mx-auto lg:mx-auto">
              Create professional portfolios with our comprehensive set of tools and features.
            </p>
          </div>

          <motion.div 
            className="mt-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.2
                  }
                }
              }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {/* Portfolio Editor */}
              <motion.div 
                className="relative"
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.9 },
                  show: { opacity: 1, y: 0, scale: 1 }
                }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              >
                <motion.div 
                  className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-indigo-500 text-white"
                  whileHover={{ rotate: 360, transition: { duration: 0.6 } }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </motion.div>
                <div className="pl-16">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">Portfolio Editor</h3>
                    <motion.span 
                      className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    >
                      Free
                    </motion.span>
                  </div>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                    Create and edit your professional portfolio with ease. Access the editor from your dashboard and customize every section to showcase your unique skills and experience.
                  </p>
                </div>
              </motion.div>

              {/* Multiple Sections */}
              <motion.div 
                className="relative"
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.9 },
                  show: { opacity: 1, y: 0, scale: 1 }
                }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              >
                <motion.div 
                  className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-indigo-500 text-white"
                  whileHover={{ rotate: 360, transition: { duration: 0.6 } }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                </motion.div>
                <div className="pl-16">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">Multiple Sections</h3>
                    <motion.span 
                      className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    >
                      Free
                    </motion.span>
                  </div>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                    Build comprehensive portfolios with Header, About Me, Skills, Projects, and Experience sections. Each section is fully customizable to tell your professional story.
                  </p>
                </div>
              </motion.div>



              {/* Export to PDF, JSON, and HTML */}
              <motion.div 
                className="relative"
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.9 },
                  show: { opacity: 1, y: 0, scale: 1 }
                }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              >
                <motion.div 
                  className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-indigo-500 text-white"
                  whileHover={{ rotate: 360, transition: { duration: 0.6 } }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                </motion.div>
                <div className="pl-16">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">Export to PDF, JSON, & HTML</h3>
                    <motion.span 
                      className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    >
                      Free
                    </motion.span>
                  </div>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                    Download your portfolio as a professional PDF, JSON, and HTML document. Perfect for job applications, client presentations, or offline sharing.
                  </p>
                </div>
              </motion.div>

              {/* Drag and Drop Sections */}
              <motion.div 
                className="relative"
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.9 },
                  show: { opacity: 1, y: 0, scale: 1 }
                }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              >
                <motion.div 
                  className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-indigo-500 text-white"
                  whileHover={{ rotate: 360, transition: { duration: 0.6 } }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
                  </svg>
                </motion.div>
                <div className="pl-16">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">Drag and Drop Sections</h3>
                    <motion.span 
                      className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    >
                      Free
                    </motion.span>
                  </div>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                    Easily rearrange portfolio sections by dragging and dropping. Customize the order to highlight your most important information first.
                  </p>
                </div>
              </motion.div>

              {/* AI Description Enhancement */}
              <motion.div 
                className="relative"
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.9 },
                  show: { opacity: 1, y: 0, scale: 1 }
                }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              >
                <motion.div 
                  className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  whileHover={{ rotate: 360, transition: { duration: 0.6 } }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423L16.5 15.75l.394 1.183a2.25 2.25 0 001.423 1.423L19.5 18.75l-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                </motion.div>
                <div className="pl-16">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">AI Description Enhancement</h3>
                    <motion.span 
                      className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    >
                      Pro
                    </motion.span>
                  </div>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                    Transform your descriptions with AI-powered writing assistance. Click the AI button in any text field to enhance your content with professional, engaging language.
                  </p>
                </div>
              </motion.div>

              {/* AI Skill Generation */}
              <motion.div 
                className="relative"
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.9 },
                  show: { opacity: 1, y: 0, scale: 1 }
                }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              >
                <motion.div 
                  className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  whileHover={{ rotate: 360, transition: { duration: 0.6 } }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423L16.5 15.75l.394 1.183a2.25 2.25 0 001.423 1.423L19.5 18.75l-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                </motion.div>
                <div className="pl-16">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">AI Skill Generation</h3>
                    <motion.span 
                      className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    >
                      Pro
                    </motion.span>
                  </div>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                    Generate relevant skills based on keywords and industry trends. Use the AI skill generator in the Skills section to discover and add skills that match your profession.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Showcase Section */}
      <motion.div 
        className="py-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="lg:text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-lg font-semibold text-indigo-600 dark:text-indigo-400"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
              viewport={{ once: true }}
            >
              Portfolio Showcase
            </motion.h2>
            <motion.p 
              className="mt-2 text-3xl font-bold leading-8 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              viewport={{ once: true }}
            >
              Beautiful portfolios made with PortfolioPen
            </motion.p>
          </motion.div>
          
          <motion.div 
             className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.div 
              className="overflow-hidden rounded-2xl shadow-2xl bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-purple-900 backdrop-blur-sm border border-white/20 dark:border-white/10"
              variants={{
                hidden: { y: 60, opacity: 0, rotateX: 45 },
                show: { y: 0, opacity: 1, rotateX: 0 }
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              whileHover={{ 
                scale: 1.05, 
                rotateY: 5,
                z: 50,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              animate={{
                y: [0, -5, 0],
                transition: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            >
              <motion.div
                className="relative overflow-hidden"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.4 }}
              >
                <img 
                  src={photographer}
                  alt="Portfolio example" 
                  className="h-48 w-full object-cover" 
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
              <motion.div 
                className="px-6 py-4"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className="font-bold text-xl mb-2 text-gray-900 dark:text-gray-100"
                  whileHover={{ scale: 1.05, color: "#6366f1" }}
                  transition={{ duration: 0.2 }}
                >
                  Photographer Portfolio
                </motion.div>
                <motion.p 
                  className="text-gray-700 dark:text-gray-300 text-base mb-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  A stunning visual portfolio for photographers featuring gallery layouts and lightbox effects.
                </motion.p>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="overflow-hidden rounded-2xl shadow-2xl bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-purple-900 backdrop-blur-sm border border-white/20 dark:border-white/10"
              variants={{
                hidden: { y: 60, opacity: 0, rotateX: 45 },
                show: { y: 0, opacity: 1, rotateX: 0 }
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              whileHover={{ 
                scale: 1.05, 
                rotateY: -5,
                z: 50,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              animate={{
                y: [0, -8, 0],
                transition: {
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }
              }}
            >
              <motion.div
                className="relative overflow-hidden"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.4 }}
              >
                <img 
                  src={developer}
                  alt="Portfolio example" 
                  className="h-48 w-full object-cover" 
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
              <motion.div 
                className="px-6 py-4"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className="font-bold text-xl mb-2 text-gray-900 dark:text-gray-100"
                  whileHover={{ scale: 1.05, color: "#10b981" }}
                  transition={{ duration: 0.2 }}
                >
                  Developer Portfolio
                </motion.div>
                <motion.p 
                  className="text-gray-700 dark:text-gray-300 text-base mb-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  A clean, professional portfolio for developers with project showcase and GitHub integration.
                </motion.p>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="overflow-hidden rounded-2xl shadow-2xl bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-purple-900 backdrop-blur-sm border border-white/20 dark:border-white/10"
              variants={{
                hidden: { y: 60, opacity: 0, rotateX: 45 },
                show: { y: 0, opacity: 1, rotateX: 0 }
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              whileHover={{ 
                scale: 1.05, 
                rotateY: 5,
                z: 50,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              animate={{
                y: [0, -6, 0],
                transition: {
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }
              }}
            >
              <motion.div
                className="relative overflow-hidden"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.4 }}
              >
                <img 
                  src={designer} 
                  alt="Portfolio example" 
                  className="h-48 w-full object-cover" 
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
              <motion.div 
                className="px-6 py-4"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className="font-bold text-xl mb-2 text-gray-900 dark:text-gray-100"
                  whileHover={{ scale: 1.05, color: "#f59e0b" }}
                  transition={{ duration: 0.2 }}
                >
                  Designer Portfolio
                </motion.div>
                <motion.p 
                  className="text-gray-700 dark:text-gray-300 text-base mb-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  A creative portfolio for designers with case studies and interactive elements.
                </motion.p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div 
        className=""
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="mx-auto max-w-7xl py-16 px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="overflow-hidden rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 shadow-xl lg:grid lg:grid-cols-2 lg:gap-4"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="px-6 pt-10 pb-12 sm:px-16 sm:pt-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20"
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="lg:self-center">
                <motion.h2 
                  className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <span className="block">Ready to build your portfolio?</span>
                  <span className="block">Start for free today.</span>
                </motion.h2>
                <motion.p 
                  className="mt-4 text-lg leading-6 text-indigo-200"
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  No credit card required. Get started in less than 2 minutes.
                </motion.p>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/register"
                    className="mt-8 inline-flex items-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-indigo-600 shadow hover:bg-indigo-50 transition-all duration-300"
                  >
                    Sign up for free
                  </Link>
                </motion.div>
              </div>
            </motion.div>
            {/* CTA Image */}
            <div className="aspect-w-5 aspect-h-3 -mt-6 md:aspect-w-2 md:aspect-h-1">
              <motion.div 
                 className="transform translate-x-6 translate-y-6 rounded-md object-cover object-left-top sm:translate-x-16 lg:translate-y-20"
                 initial={{ x: 100, y: 100, opacity: 0, rotate: 10 }}
                 whileInView={{ x: 24, y: 24, opacity: 1, rotate: 0 }}
                 transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                 viewport={{ once: true }}
                 animate={{ 
                   y: [24, 14, 24],
                   rotate: [0, 2, 0],
                   transition: {
                     y: {
                       duration: 4,
                       repeat: Infinity,
                       ease: "easeInOut"
                     },
                     rotate: {
                       duration: 6,
                       repeat: Infinity,
                       ease: "easeInOut"
                     }
                   }
                 }}
                 whileHover={{ 
                   scale: 1.05,
                   rotate: 5,
                   transition: { duration: 0.3 }
                 }}
               >
                <motion.div 
                  className="w-full h-64 bg-white rounded-lg shadow-xl p-6"
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <motion.div 
                    className="flex items-center justify-between mb-6"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.4 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="text-xl font-bold text-gray-900">John Smith</h3>
                    <span className="text-sm text-gray-500">Software Developer</span>
                  </motion.div>
                  <div className="flex gap-6">
                    <motion.div 
                      className="w-1/3"
                      initial={{ scale: 0, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 1.1, duration: 0.6, type: "spring" }}
                      viewport={{ once: true }}
                    >
                      <div className="w-full h-32 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center">
                        <motion.svg 
                          className="w-12 h-12 text-white" 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        >
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </motion.svg>
                      </div>
                    </motion.div>
                    <motion.div 
                      className="w-2/3"
                      initial={{ x: 50, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ delay: 1.3, duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">About Me</h4>
                      <p className="text-sm text-gray-600 mb-4">Passionate full-stack developer with 5+ years of experience</p>
                      <motion.div 
                        className="space-y-2"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 1.5, duration: 0.5 }}
                        viewport={{ once: true }}
                      >
                        <div className="flex flex-wrap gap-2">
                          <motion.span 
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            transition={{ delay: 1.6, duration: 0.3, type: "spring" }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.1 }}
                          >
                            React
                          </motion.span>
                          <motion.span 
                            className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            transition={{ delay: 1.7, duration: 0.3, type: "spring" }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.1 }}
                          >
                            Node.js
                          </motion.span>
                          <motion.span 
                            className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            transition={{ delay: 1.8, duration: 0.3, type: "spring" }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.1 }}
                          >
                            Python
                          </motion.span>
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Footer Section */}
      <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8 xl:col-span-1">
              <span className="text-2xl font-semibold gradient-text">PortfolioPen</span>
              <p className="text-gray-500 dark:text-gray-400 text-base">
                Making portfolio creation simple, beautiful, and powerful.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-base font-medium text-gray-900 dark:text-white">Solutions</h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a href="#" className="text-base text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                        Personal Portfolio
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                        Developer Portfolio
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                        Designer Portfolio
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                        Freelancer Portfolio
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-base font-medium text-gray-900 dark:text-white">Support</h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a href="#" className="text-base text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                        Documentation
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                        Guides
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                        API Status
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                        Contact Us
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-base font-medium text-gray-900 dark:text-white">Company</h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a href="#" className="text-base text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                        About
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                        Blog
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                        Jobs
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                        Press
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-base font-medium text-gray-900 dark:text-white">Legal</h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a href="#" className="text-base text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                        Privacy
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                        Terms
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                        Cookie Policy
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
            <p className="text-base text-gray-400 dark:text-gray-500 text-center">
              &copy; 2025 PortfolioPen. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
