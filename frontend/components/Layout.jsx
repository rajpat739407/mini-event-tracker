import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { isAuthenticated, logout } from '../utils/auth';

const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = () => {
    logout();
  };

  // Don't render anything until we know we're on the client
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  const authenticated = isAuthenticated();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 font-bold text-xl text-indigo-600">
                Mini Event Tracker
              </Link>
              {authenticated && (
                <div className="hidden md:ml-6 md:flex md:space-x-8">
                  <Link
                    href="/events"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      router.pathname === '/events'
                        ? 'border-indigo-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    My Events
                  </Link>
                  <Link
                    href="/events/create"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      router.pathname === '/events/create'
                        ? 'border-indigo-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    Create Event
                  </Link>
                </div>
              )}
            </div>
            <div className="flex items-center">
              {authenticated ? (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleLogout}
                    className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-sm font-medium text-gray-700"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/login"
                    className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-sm font-medium text-gray-700"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium text-white"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
              {/* Mobile menu button */}
              {authenticated && (
                <div className="md:hidden flex items-center ml-4">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  >
                    <span className="sr-only">Open main menu</span>
                    {/* Menu icon */}
                    <svg
                      className="block h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && authenticated && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                href="/events"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                My Events
              </Link>
              <Link
                href="/events/create"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Create Event
              </Link>
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;