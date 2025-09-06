import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated } from '../utils/auth';

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;