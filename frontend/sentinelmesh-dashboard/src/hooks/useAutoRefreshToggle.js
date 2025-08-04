import { useState } from 'react';

const useAutoRefreshToggle = (initialValue = true) => {
  const [autoRefresh, setAutoRefresh] = useState(initialValue);

  return [autoRefresh, setAutoRefresh];
};

export default useAutoRefreshToggle;

