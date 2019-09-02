import React, { useEffect, useState } from 'react';
import uuid from 'uuid/v1';
import Popup from './Popup';
import Spinner from '../components/Spinner';
import usePopup from '../hooks/usePopup';
import { cleanInput, validateListName } from '../helpers';
import { addListPromise, createExternalList, addToQueue, postQueue } from '../helpers/dbhelper';

const CreateList = (props) => {
  // Get/set local state
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Get/set state of popup
  const { isShowingPopup, togglePopup, message } = usePopup();


  // Set title on page render
  useEffect(() => {
    document.title = 'Create a list';
  }, []);

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
    try {
      const list = {
        updatedAt: Date.now(),
        name,
        html: '<ul><li><br></li></ul>',
        backgroundColor: 'blue',
        isPrivate: true,
        notificationsOn: false
      };
      let newList;
      // attemp to add to mongoDB
      setIsLoading(true);
      const posted = await postQueue();
      if (posted) {
        newList = await createExternalList(list);
      }
      setIsLoading(false);
      if (!newList) {
        console.log('adding create action to queue');
        // Must be offline, not signed in, or some other error so just add to idb and the queue
        // Generate an id first
        newList = { ...list, _id: uuid() };
        addToQueue({ ...newList, action: 'create' });
      }
      // Try to add list to indexedDB and redirect to edit page
      await addListPromise(newList);
      props.history.push(`/lists/${encodeURIComponent(newList._id)}/edit`, { _id: newList._id });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
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
      <div className="form-container">
        <form className='form'>
          <div className="group">
            <input required
              className='email-input'
              type="text"
              name="listname"
              id="listName"
              onChange={handleChange} />
            <label className='label--email' htmlFor="listName">List name</label>
          </div>
          {isLoading ? <Spinner content='working...' /> :
            <button
              className='btn btn--primary'
              type='submit'
              onClick={createList}>
              Create list
            </button>
          }
        </form>
      </div>
    </div>
  );
};

export default CreateList;