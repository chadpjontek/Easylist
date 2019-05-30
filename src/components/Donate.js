import React, { useEffect } from 'react';
import MenuModal from './MenuModal';
import useMenuModal from '../hooks/useMenuModal';

const Donate = () => {
  useEffect(() => {
    document.title = 'Donate';
  });
  const { isShowing, toggle } = useMenuModal();
  return (
    <div className='container--app'>
      <MenuModal
        isShowing={isShowing}
        hide={toggle}>
      </MenuModal>
      <h1 className='h1'>Donate page</h1>
      <button className='btn btn--menu' onClick={toggle}>
        Menu
      </button>
    </div>
  );
};

export default Donate;