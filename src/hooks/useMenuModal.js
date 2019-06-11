import { useState } from 'react';

/**
 * React hook that returns the state of the modal and ability to toggle it.
 */
const useMenuModal = () => {
  const [isShowingMenu, setIsShowingMenu] = useState(false);

  const toggleMenu = () => {
    document.querySelector('html').classList.toggle('u-lock-scroll');
    setIsShowingMenu(!isShowingMenu);
  };

  return {
    isShowingMenu,
    toggleMenu,
  };
};

export default useMenuModal;