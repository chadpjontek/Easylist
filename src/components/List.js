import React, { useEffect, useState } from 'react';
import Popup from './Popup';
import usePopup from '../hooks/usePopup';
import { validateListName } from '../helpers';
import { getListPromise } from '../helpers/dbhelper';
import '../styles/List.scss';

const List = (props) => {
  // get name from location
  const name = decodeURI(window.location.pathname.split('/')[2]);

  // local state getters/setters
  const [html, setHtml] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('');
  const [isInvalidList, setisInvalidList] = useState(false);

  // Get/set state of popup
  const { isShowingPopup, togglePopup, message } = usePopup();

  // on first load...
  useEffect(() => {
    // Check validity of list name and handle
    if (!validateListName(name)) {
      const msg = 'Name must be between 1 and 24 characters and not start with a space.';
      togglePopup(msg);
      return setisInvalidList(true);
    }
    // ...update title
    document.title = name;
    // ...fetch list
    const fetchData = async () => {
      try {
        const { html, backgroundColor } = await getListPromise(name);
        setHtml(html);
        setBackgroundColor(backgroundColor);
      } catch (error) {
        throw new Error(error);
      }
    };
    fetchData();
  }, []);

  // Function to delete a list
  const deleteList = async () => {
    try {
      // lazy load
      const { deleteListPromise } = await import(/* webpackChunkName: "deleteListPromise" */'../helpers/dbhelper');
      // delete list
      await deleteListPromise(name);
      // redirect to lists page
      props.history.push('/lists');
    } catch (error) {
      throw new Error(error);
    }
  };

  // Function to share a list
  const shareList = () => {
    // TODO: create url where list can be viewed publicly and copy link to clipboard
    // Display popup msg
    const msg = 'Your list can be viewed at: \n\nhttps://easylist.link/list/1q2w3e4r5t6y7u8i9o0p \nThe link has been copied to your clipboard.';
    return togglePopup(msg);
  };

  // Function to edit a list
  const editList = () => {
    // redirect to editList
    props.history.push(`/lists/${encodeURIComponent(name)}/edit`, { name });
  };


  return (isInvalidList ?
    <div className='list--error'>
      <Popup
        isShowing={isShowingPopup}
        text={message}
        hide={togglePopup} >
      </Popup >
      <button className='btn btn--error' onClick={() => props.history.push('/')}>Home</button>
    </div >
    :
    <div className='container view-list'>
      <Popup
        isShowing={isShowingPopup}
        text={message}
        hide={togglePopup} >
      </Popup >
      <div className="list-header">
        <h1 className='h1'>{name}</h1>
        <button className='btn btn--list btn--edit' onClick={editList}>edit</button>
        <button className='btn btn--list btn--share' onClick={shareList}>share</button>
        <button className='btn btn--list btn--delete' onClick={deleteList}>delete</button>
      </div>
      <div className={`editbox ${backgroundColor}--note`} dangerouslySetInnerHTML={{ __html: html }}></div>
    </div >
  );
};

export default List;