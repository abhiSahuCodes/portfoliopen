import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Button } from './ui/button';

const GoogleOAuthButton = ({ 
  text = "Continue with Google", 
  className = "",
  disabled = false,
  onClick = null 
}) => {
  const handleGoogleAuth = () => {
    if (onClick) {
      onClick();
    } else {
      // Redirect to backend Google OAuth endpoint
      window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/google`;
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGoogleAuth}
      disabled={disabled}
      className={`
        w-full h-12 px-6 py-3
        border-2 border-gray-200 hover:border-gray-300
        bg-white hover:bg-gray-50
        text-gray-700 hover:text-gray-900
        font-medium text-base
        rounded-lg
        transition-all duration-200 ease-in-out
        shadow-sm hover:shadow-md
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white
        flex items-center justify-center gap-3
        group
        ${className}
      `}
    >
      <FcGoogle 
        className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" 
      />
      <span className="font-medium">{text}</span>
    </Button>
  );
};

export default GoogleOAuthButton;