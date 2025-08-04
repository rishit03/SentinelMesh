import { useState } from 'react';

const useNotificationsToggle = (initialValue = true) => {
  const [notifications, setNotifications] = useState(initialValue);

  return [notifications, setNotifications];
};

export default useNotificationsToggle;

