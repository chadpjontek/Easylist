import React from 'react';
import MenuModal from './MenuModal';
import useMenuModal from '../hooks/useMenuModal';

const Donate = () => {
  const { isShowing, toggle } = useMenuModal();
  return (
    <div>
      <MenuModal
        isShowing={isShowing}
        hide={toggle}>
      </MenuModal>
      <div>Donate page</div>
      <button className='btn btn--menu' onClick={toggle}>
        Menu
      </button>
    </div>
  );
};

export default Donate;