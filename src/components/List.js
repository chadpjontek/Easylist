import React, { useEffect, useState } from 'react';
import Popup from './Popup';
import usePopup from '../hooks/usePopup';
import ClipboardJS from 'clipboard';

import {
  getListPromise,
  deleteListPromise,
  updateListPromise,
  addToDeleteQueue,
  shareExternalList,
  completeList
} from '../helpers/dbhelper';
import '../styles/List.scss';

const List = (props) => {
  // get _id from location
  const _id = decodeURI(window.location.pathname.split('/')[2]);

  // local state getters/setters
  const [name, setName] = useState('Loading...');
  const [html, setHtml] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('');
  const [isInvalidList, setisInvalidList] = useState(false);
  const [shareBtnState, setShareBtnState] = useState(false);
  const [deleteBtnDisabled, setDeleteBtnDisabled] = useState(false);
  const [copiedFrom, setCopiedFrom] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [list, setList] = useState(null);

  // Get/set state of popup
  const { isShowingPopup, togglePopup, message } = usePopup();

  // on first load...
  useEffect(() => {
    // ...fetch list
    const fetchData = async () => {
      new ClipboardJS('#share');
      try {
        const idbList = await getListPromise(_id);
        if (idbList === undefined) {
          throw new Error('list does not exist');
        }
        setList(idbList);
        const { name, html, backgroundColor, copiedFrom, isFinished } = idbList;
        // ...update title
        document.title = name;
        setName(name);
        setHtml(html);
        setBackgroundColor(backgroundColor);
        setCopiedFrom(copiedFrom);
        setIsFinished(isFinished);
      } catch (error) {
        document.title = 'list error';
        console.log(error);
        setisInvalidList(true);
        togglePopup('This list does not exist.');
      }
    };
    fetchData();
  }, []);

  // Function to delete a list
  const deleteList = async () => {
    try {
      // if list is not local only, add to deleteQueue
      if (!/-/.test(_id)) {
        await addToDeleteQueue({ _id });
      }
      // Delete the list in IDB
      await deleteListPromise(_id);
      // redirect to lists page
      props.history.push('/lists');
    } catch (error) {
      setDeleteBtnDisabled(false);
      togglePopup(error);
    }
  };

  // Function to share a list
  const shareList = async () => {
    try {
      const errMsg = 'You need to be online and signed in to share a list';
      if (/-/.test(_id)) {
        togglePopup(errMsg);
        return;
      }
      // Attempt to update list on MongoDB
      setShareBtnState(true);
      const response = await shareExternalList(_id);
      setShareBtnState(false);
      console.log(response);
      if (!response) {
        togglePopup(errMsg);
      } else {
        togglePopup(response.msg);
        if (response.msg === 'Your list is now private.') {
          await updateListPromise({ ...list, isPrivate: true });
        } else {
          await updateListPromise({ ...list, isPrivate: false });
        }
      }
    } catch (error) {
      setShareBtnState(false);
      togglePopup(error);
    }
  };

  const complete = async () => {
    try {
      const list = await completeList(_id);
      if (list !== undefined) {
        await updateListPromise(list);
      }
      setIsFinished(true);
      togglePopup('Completion notification sent!');
    } catch (error) {
      if (error.message === 'Error: no token') {
        togglePopup('You need to be logged in to complete this list.');
      } else {
        togglePopup(error.message);
      }
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
        {copiedFrom && !isFinished ?
          <button className='btn btn--list btn--complete' disabled={shareBtnState} onClick={complete}>complete</button>
          :
          <button id='share' className='btn btn--list btn--share' disabled={shareBtnState} onClick={shareList} data-clipboard-text={`http://localhost:8080/lists/${_id}/shared`}>share</button>
        }
        <button className='btn btn--list btn--delete' disabled={deleteBtnDisabled} onClick={deleteList}>delete</button>
      </div>
      <div className={`editbox ${backgroundColor}--note`} dangerouslySetInnerHTML={{ __html: html }}></div>
    </div >
  );
};

export default List;