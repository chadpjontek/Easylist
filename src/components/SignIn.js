import React from 'react';
import MenuModal from './MenuModal';
import useMenuModal from '../hooks/useMenuModal';

const SignIn = () => {
  const { isShowing, toggle } = useMenuModal();
  return (
    <div>
      <MenuModal
        isShowing={isShowing}
        hide={toggle}>
      </MenuModal>
      <div>Sign in page</div>
      <button className='btn btn--menu' onClick={toggle}>
        Menu
      </button>
    </div>
  );
};

export default SignIn;