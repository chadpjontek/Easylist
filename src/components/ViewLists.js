import React from 'react';
import MenuModal from './MenuModal';
import useMenuModal from '../hooks/useMenuModal';

const ViewLists = () => {
  const { isShowing, toggle } = useMenuModal();
  return (
    <div>
      <MenuModal
        isShowing={isShowing}
        hide={toggle}>
      </MenuModal>
      <div>View lists page</div>
      <button className='btn btn--menu' onClick={toggle}>
        Menu
      </button>
    </div>
  );
};

export default ViewLists;