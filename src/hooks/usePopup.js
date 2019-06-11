import { useState } from 'react';

/**
 * React hook that returns the popup message, state, and ability to toggle it.
 */
const usePopup = () => {
  const [isShowingPopup, setIsShowingPopup] = useState(false);
  const [message, setMessage] = useState('');

  const togglePopup = (message) => {
    setIsShowingPopup(!isShowingPopup);
    setMessage(message);
  };

  return {
    isShowingPopup,
    togglePopup,
    message
  };
};

export default usePopup;