import React, { useEffect } from 'react';
import MenuModal from './MenuModal';
import useMenuModal from '../hooks/useMenuModal';

const NoMatch = () => {
  useEffect(() => {
    document.title = '404';
  });
  const { isShowingMenu, toggleMenu } = useMenuModal();
  return (
    <div className='container container--app'>
      <MenuModal
        isShowing={isShowingMenu}
        hide={toggleMenu}>
      </MenuModal>
      <h1 className='h1'>Opps. Nothing to see here. Error 404.</h1>
      <button className='btn btn--menu' onClick={toggleMenu}>
        Menu
      </button>
    </div>
  );
};

export default NoMatch;