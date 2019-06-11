import React, { useEffect } from 'react';
import MenuModal from './MenuModal';
import useMenuModal from '../hooks/useMenuModal';

const SignIn = () => {
  useEffect(() => {
    document.title = 'Sign in';
  });
  const { isShowingMenu, toggleMenu } = useMenuModal();
  return (
    <div className='container container--app'>
      <MenuModal
        isShowing={isShowingMenu}
        hide={toggleMenu}>
      </MenuModal>
      <h1 className='h1'>Sign in page</h1>
      <button className='btn btn--menu' onClick={toggleMenu}>
        Menu
      </button>
    </div>
  );
};

export default SignIn;