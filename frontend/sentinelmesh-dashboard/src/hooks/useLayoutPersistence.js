import { useState, useEffect } from 'react';

const useLayoutPersistence = (key, initialLayout) => {
  const [layout, setLayout] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedLayout = localStorage.getItem(key);
        return storedLayout ? JSON.parse(storedLayout) : initialLayout;
      } catch (error) {
        console.error('Error parsing stored layout:', error);
        return initialLayout;
      }
    }
    return initialLayout;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(layout));
    }
  }, [layout, key]);

  return [layout, setLayout];
};

export default useLayoutPersistence;


