import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowLeft, Move, Edit, Layout, FileDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '@/components/common/Navbar';

const Features = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const handleBack = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  const features = [
    {
      name: "Portfolio Editor",
      description: "Create and edit your professional portfolio with ease",
      isPro: false,
      icon: Edit
    },
    {
      name: "Multiple Sections",
      description: "Header, About Me, Skills, Projects, and Experience sections",
      isPro: false,
      icon: Layout
    },


    {
      name: "Export to PDF, JSON, & HTML",
      description: "Download your portfolio as PDF, JSON, and HTML Document",
      isPro: false,
      icon: FileDown
    },
    {
      name: "Drag and Drop Sections",
      description: "Easily rearrange portfolio sections by dragging and dropping",
      isPro: false,
      icon: Move
    },
    {
      name: "AI Description",
      description: "Transform your descriptions with AI-powered writing assistance",
      isPro: true,
      icon: Sparkles
    },
    {
      name: "AI Skill Generation",
      description: "Generate relevant skills based on keywords and industry trends",
      isPro: true,
      icon: Sparkles
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 relative">
      <div className="absolute inset-0 -z-10 dark:block hidden" style={{
        backgroundImage: "url('/dark-bg.svg')",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover'
      }}></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          className="mb-6 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={handleBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Features</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">Everything you need to create an outstanding portfolio</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {features.map((feature) => (
            <Card key={feature.name} className="relative h-full flex flex-col bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-purple-900 border-gray-200 dark:border-gray-700">
              <CardHeader className="flex-shrink-0">
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-md leading-tight text-gray-900 dark:text-gray-100">{feature.name}</CardTitle>
                  {feature.isPro && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 flex-shrink-0">
                      Pro
                    </Badge>
                  )}
                </div>
                <div className="mt-2">
                  <feature.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default Features;
