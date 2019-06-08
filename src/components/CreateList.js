import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import MenuModal from './MenuModal';
import useMenuModal from '../hooks/useMenuModal';
import { cleanInput, validateListName } from '../helpers';
import '../styles/CreateList.scss';

const CreateList = (props) => {
  // Get/set state of text input
  const [inputValue, setInputValue] = useState('');
  // Get/set state of MenuModal
  const { isShowing, toggle } = useMenuModal();
  // Set title on page render
  useEffect(() => {
    document.title = 'Create a list';
  });

  /**
   * Function to create a new list
   */
  const createList = async () => {
    event.preventDefault();
    // Get the list name from text input, validate, and sanitize.
    if (!validateListName(inputValue)) {
      return toast.error(
        'Name must be between 3 and 24 characters and not start with a space.', {
          position: toast.POSITION.TOP_CENTER
        });
    }
    const listName = cleanInput(inputValue);
    // Try to add list to indexedDB and redirect to edit page
    try {
      const { addListPromise } = await import(/* webpackChunkName: "addListPromise" */'../helpers/dbhelper');
      addListPromise(listName);
      props.history.push(`/lists/${encodeURIComponent(listName)}/edit`, { listName });
    } catch (error) {
      toast.error('Couldn\'t add list', {
        position: toast.POSITION.TOP_CENTER
      });
      throw new Error(error);
    }
  };

  const handleChange = (event) => setInputValue(event.target.value);

  return (
    <div className='container--app'>
      <MenuModal
        isShowing={isShowing}
        hide={toggle}>
      </MenuModal>
      <form className='form'>
        <div className='input-container'>
          <label className='label'>List name: </label>
          <input
            id='listName'
            className='text-input'
            type='text'
            name='listname'
            value={inputValue}
            onChange={handleChange} />
        </div>
        <input
          className='btn btn--create'
          type='submit'
          value='Create list'
          onClick={createList} />
      </form>
      <button className='btn btn--menu-bottom ' onClick={toggle}>
        Menu
      </button>
    </div>
  );
};

export default CreateList;