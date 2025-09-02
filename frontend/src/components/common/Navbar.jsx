
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../lib/redux/slices/authSlice';
import { useToast } from '../../hooks/use-toast';
import { ThemeToggle } from "../theme/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { ChevronDown, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, subscription } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(logout());
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
    navigate('/');
  };

  return (
    <nav className="bg-white/90 dark:bg-gradient-to-r dark:from-[#3d2952]/90 dark:to-[#1e2338]/90 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-semibold gradient-text">PortfolioPen</span>
              </Link>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link
                to="/"
                className="border-transparent text-gray-500 dark:text-white hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Home
              </Link>
              <Link
                to="/features"
                className="border-transparent text-gray-500 dark:text-white hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Features
              </Link>
              <Link
                to="/pricing"
                className="border-transparent text-gray-500 dark:text-white hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Pricing
              </Link>
            </div>
          </div>
          <div className="hidden md:ml-6 md:flex md:items-center">
            <ThemeToggle />
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-primary hover:bg-gray-100 dark:text-white dark:hover:text-primary dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Dashboard
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center space-x-2 focus:outline-none">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt={user?.name || 'User'} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.name || 'User'}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email || 'user@example.com'}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-default">
                      <User className="mr-2 h-4 w-4" />
                      <span className="flex-1">Subscription</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        subscription === 'pro' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                      }`}>
                        {subscription === 'pro' ? 'Pro' : 'Free'}
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary hover:bg-gray-100 dark:text-white dark:hover:text-primary dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary text-orange-300 hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium dark:text-orange-500"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className="text-gray-600 hover:bg-gray-50 hover:text-primary dark:text-white dark:hover:bg-gray-700 block px-3 py-2 text-base font-medium"
          >
            Home
          </Link>
          <Link
            to="/features"
            className="text-gray-600 hover:bg-gray-50 hover:text-primary dark:text-white dark:hover:bg-gray-700 block px-3 py-2 text-base font-medium"
          >
            Features
          </Link>
          <Link
            to="/pricing"
            className="text-gray-600 hover:bg-gray-50 hover:text-primary dark:text-white dark:hover:bg-gray-700 block px-3 py-2 text-base font-medium"
          >
            Pricing
          </Link>
          {/* Theme Toggle in Mobile Menu */}
          <div className="px-3 py-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-white text-base font-medium">Theme</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          {isAuthenticated ? (
            <div className="space-y-1">
              <div className="px-3 py-2">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" alt={user?.name || 'User'} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || 'user@example.com'}</p>
                    <span className={`text-xs px-2 py-1 rounded-full mt-1 inline-block w-fit ${
                      subscription === 'pro' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                    }`}>
                      {subscription === 'pro' ? 'Pro' : 'Free'}
                    </span>
                  </div>
                </div>
              </div>
              <Link
                to="/dashboard"
                className="text-gray-600 hover:bg-gray-50 hover:text-primary dark:text-white dark:hover:bg-gray-700 block px-3 py-2 text-base font-medium"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:bg-gray-50 hover:text-primary dark:text-white dark:hover:bg-gray-700 block w-full text-left px-3 py-2 text-base font-medium"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              <Link
                to="/login"
                className="text-gray-600 hover:bg-gray-50 hover:text-primary dark:text-white dark:hover:bg-gray-700 block px-3 py-2 text-base font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-gray-600 hover:bg-gray-50 hover:text-primary dark:text-white dark:hover:bg-gray-700 block px-3 py-2 text-base font-medium"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
