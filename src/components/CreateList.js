import React from 'react';
import MenuModal from './MenuModal';
import useMenuModal from '../hooks/useMenuModal';

const CreateList = () => {
  const { isShowing, toggle } = useMenuModal();
  return (
    <div>
      <MenuModal
        isShowing={isShowing}
        hide={toggle}>
      </MenuModal>
      <div>Create a list page</div>
      <button className='btn btn--menu' onClick={toggle}>
        Menu
      </button>
    </div>
  );
};

export default CreateList;