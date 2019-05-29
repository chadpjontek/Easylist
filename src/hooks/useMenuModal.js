import { useState } from 'react';

/**
 * React hook that returns the state of the modal and ability to toggle it.
 */
const useMenuModal = () => {
  const [isShowing, setIsShowing] = useState(false);

  const toggle = () => {
    document.querySelector('html').classList.toggle('u-lock-scroll');
    setIsShowing(!isShowing);
  };

  return {
    isShowing,
    toggle,
  };
};

export default useMenuModal;