import React, { useEffect } from 'react';
import MenuModal from './MenuModal';
import useMenuModal from '../hooks/useMenuModal';
import { cleanInput } from '../helpers';
import '../styles/CreateList.scss';

const CreateList = () => {
  useEffect(() => {
    document.title = 'Create a list';
  });
  const { isShowing, toggle } = useMenuModal();
  const createList = () => {
    //TODO: Actually save the list to IndexedDB, and if logged in, save to MongoDB;
    const nameInput = document.getElementById('listName');
    const listName = cleanInput(nameInput.value);

    event.preventDefault();

    console.log(listName);
  };
  return (
    <div className='container--app'>
      <MenuModal
        isShowing={isShowing}
        hide={toggle}>
      </MenuModal>
      <form className='form'>
        <div className='input-container'>
          <label className='label'>List name: </label>
          <input id='listName' className='text-input' type='text' name='listname' />
        </div>
        <input className='btn btn--create' type='submit' value='Create list' onClick={createList} />
      </form>
      <button className='btn btn--menu-bottom ' onClick={toggle}>
        Menu
      </button>
    </div>
  );
};

export default CreateList;