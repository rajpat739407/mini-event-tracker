// Check if we're in the browser environment
const isBrowser = () => typeof window !== 'undefined';

export const setAuthToken = (token) => {
  if (isBrowser()) {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }
};

export const getAuthToken = () => {
  if (isBrowser()) {
    return localStorage.getItem('token');
  }
  return null;
};

export const setUserId = (userId) => {
  if (isBrowser()) {
    if (userId) {
      localStorage.setItem('userId', userId);
    } else {
      localStorage.removeItem('userId');
    }
  }
};

export const getUserId = () => {
  if (isBrowser()) {
    return localStorage.getItem('userId');
  }
  return null;
};

export const isAuthenticated = () => {
  if (isBrowser()) {
    return !!getAuthToken();
  }
  return false;
};

export const logout = () => {
  if (isBrowser()) {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    window.location.href = '/login';
  }
};