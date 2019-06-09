import React, { useEffect } from 'react';
import MenuModal from './MenuModal';
import useMenuModal from '../hooks/useMenuModal';

const EditList = (props) => {
  // destruct to get listName from React Router's state history
  const { listName } = props.history.location.state;
  useEffect(() => {
    document.title = 'Edit list';
  });
  const { isShowing, toggle } = useMenuModal();
  return (
    <div className='container--app'>
      <MenuModal
        isShowing={isShowing}
        hide={toggle}>
      </MenuModal>
      <h1 className='h1'>{listName}</h1>
      <button className='btn btn--menu-bottom ' onClick={toggle}>
        Menu
      </button>
    </div>
  );
};

export default EditList;