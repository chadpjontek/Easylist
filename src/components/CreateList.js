import React, { useEffect, useState } from 'react';
import MenuModal from './MenuModal';
import useMenuModal from '../hooks/useMenuModal';
import { cleanInput } from '../helpers';
import '../styles/CreateList.scss';

const CreateList = (props) => {
  // Get/set state of text input
  const [inputValue, setInputValue] = useState('');
  // Set title on page render
  useEffect(() => {
    document.title = 'Create a list';
  });
  // Get/set state of MenuModal
  const { isShowing, toggle } = useMenuModal();
  /**
   * Function to create a new list
   */
  const createList = async () => {
    // Get the list name from text input and clean possible malicious code
    // TODO: Add validation
    const listName = cleanInput(inputValue);
    event.preventDefault();
    try {
      const { addListPromise } = await import('../helpers/dbhelper');
      addListPromise(listName);
      props.history.push(`/lists/${encodeURIComponent(listName)}/edit`, { listName });
    } catch (error) {
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