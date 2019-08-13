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
      const msg = 'Name must be between 1 and 24 characters and not start with a space.';
      return togglePopup(msg);
    }
    const name = cleanInput(inputValue);

    // Try to add list to indexedDB and redirect to edit page
    try {
      const { addListPromise } = await import(/* webpackChunkName: "addListPromise" */'../helpers/dbhelper');
      const list = { name, html: '<ul><li><br></li></ul>', backgroundColor: 'blue' };
      await addListPromise(list);
      // if this goes ok let's see if the user has a login token
      const token = localStorage.getItem('jwt');
      if (token) {
        // They do so attempt to add to mongoDB
        const response = await fetch('http://localhost:3000/api/lists', {
          body: JSON.stringify({ name, html: '<ul><li><br></li></ul>', backgroundColor: 'blue' }),
          mode: 'cors',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'x-auth-token': token
          },
        });
        // Parse body as json
        const json = await response.json();
        if (json.error) {
          return togglePopup(json.error);
        }
        if (json.msg) {
          // Redirect to new list to edit
          return props.history.push(`/lists/${encodeURIComponent(name)}/edit`, { name });
        }
        // If no json returned throw error
        throw new Error('something went wrong');
      }
    } catch (error) {
      const msg = `${error.name} - ${error.message}`;
      togglePopup(msg);
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