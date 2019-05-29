import React from 'react';
import MenuModal from './MenuModal';
import useMenuModal from '../hooks/useMenuModal';

const CreateList = () => {
  const { isShowing, toggle } = useMenuModal();
  return (
    <div className='container--app'>
      <MenuModal
        isShowing={isShowing}
        hide={toggle}>
      </MenuModal>
      <h1 className='h1'>Create a list page</h1>
      <button className='btn btn--menu' onClick={toggle}>
        Menu
      </button>
    </div>
  );
};

export default CreateList;