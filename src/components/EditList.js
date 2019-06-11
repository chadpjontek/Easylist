import React, { useEffect } from 'react';
import MenuModal from './MenuModal';
import useMenuModal from '../hooks/useMenuModal';

const EditList = (props) => {
  // destruct to get listName from React Router's state history
  const { listName } = props.history.location.state || { listName };
  useEffect(() => {
    document.title = 'Edit list';
  });
  const { isShowingMenu, toggleMenu } = useMenuModal();
  return (
    <div className='container container--app'>
      <MenuModal
        isShowing={isShowingMenu}
        hide={toggleMenu}>
      </MenuModal>
      <h1 className='h1'>{listName}</h1>
      <button className='btn btn--menu-bottom ' onClick={toggleMenu}>
        Menu
      </button>
    </div>
  );
};

export default EditList;