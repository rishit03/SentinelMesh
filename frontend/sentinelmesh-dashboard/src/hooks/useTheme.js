import { useState, useEffect } from 'react';

const useTheme = () => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sentinelmesh-dark-mode') === 'true' ||
             (!localStorage.getItem('sentinelmesh-dark-mode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('sentinelmesh-dark-mode', darkMode.toString());
  }, [darkMode]);

  return [darkMode, setDarkMode];
};

export default useTheme;


