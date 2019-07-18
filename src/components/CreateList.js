import React, { useEffect, useState } from 'react';
import Popup from './Popup';
import usePopup from '../hooks/usePopup';
import { cleanInput, validateListName } from '../helpers';
import '../styles/CreateList.scss';

const CreateList = (props) => {
  // Get/set state of text input
  const [inputValue, setInputValue] = useState('');
  // Get/set state of popup
  const { isShowingPopup, togglePopup, message } = usePopup();
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
      const msg = 'Name must be between 3 and 24 characters and not start with a space.';
      return togglePopup(msg);
    }
    const listName = cleanInput(inputValue);
    // Try to add list to indexedDB and redirect to edit page
    try {
      const { addListPromise } = await import(/* webpackChunkName: "addListPromise" */'../helpers/dbhelper');
      addListPromise(listName);
      props.history.push(`/lists/${encodeURIComponent(listName)}/edit`, { listName });
    } catch (error) {
      console.log('made it');
      const msg = 'Couldn\'t add list';
      togglePopup(msg);
      throw new Error(error);
    }
  };

  const handleChange = (event) => setInputValue(event.target.value);

  return (
    <div className='container'>
      <Popup
        isShowing={isShowingPopup}
        text={message}
        hide={togglePopup}>
      </Popup>
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
    </div>
  );
};

export default CreateList;