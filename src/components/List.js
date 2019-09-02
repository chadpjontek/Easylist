import React, { useEffect, useState } from 'react';
import Popup from './Popup';
import usePopup from '../hooks/usePopup';
import { validateListName } from '../helpers';
import {
  getListPromise,
  deleteListPromise,
  addToQueue,
  shareExternalList,
  deleteExternalList,
  postQueue
} from '../helpers/dbhelper';
import '../styles/List.scss';

const List = (props) => {
  // get _id from location
  const _id = decodeURI(window.location.pathname.split('/')[2]);

  // local state getters/setters
  const [list, setList] = useState();
  const [name, setName] = useState('Loading...');
  const [html, setHtml] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('');
  const [isInvalidList, setisInvalidList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get/set state of popup
  const { isShowingPopup, togglePopup, message } = usePopup();

  // on first load...
  useEffect(() => {
    // ...fetch list
    const fetchData = async () => {
      try {
        const list = await getListPromise(_id);
        const { name, html, backgroundColor } = list;
        // ...update title
        document.title = name;
        setList(list);
        setName(name);
        setHtml(html);
        setBackgroundColor(backgroundColor);
      } catch (error) {
        document.title = 'list error';
        throw new Error(error);
      }
    };
    fetchData();
  }, []);

  // Function to delete a list
  const deleteList = async () => {
    try {
      // Attempt to delete list on MongoDB
      setIsLoading(true);
      let isDeleted;
      const posted = await postQueue(_id);
      if (posted) {
        isDeleted = await deleteExternalList(_id);
      }
      setIsLoading(false);
      if (!isDeleted) {
        // delete failed so add delete to queue
        console.log('adding delete action to queue');
        await addToQueue({ ...list, action: 'delete' });
      }
      // Delete the list in IDB
      await deleteListPromise(_id);
      // redirect to lists page
      props.history.push('/lists');
    } catch (error) {
      togglePopup(error);
      setIsLoading(false);
    }
  };

  // Function to share a list
  const shareList = async () => {
    try {
      // Attempt to update list on MongoDB
      setIsLoading(true);
      await postQueue();
      const response = await shareExternalList(_id);
      setIsLoading(false);
      if (!response) {
        // share failed
        return togglePopup('You need to be online and signed in to share a list');
      }
      // TODO: create url where list can be viewed publicly and copy link to clipboard
      // Display popup msg
      return togglePopup(response);
    } catch (error) {
      togglePopup(error);
      setIsLoading(false);
    }
  };

  // Function to edit a list
  const editList = () => {
    // redirect to editList
    props.history.push(`/lists/${encodeURIComponent(_id)}/edit`, { _id });
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