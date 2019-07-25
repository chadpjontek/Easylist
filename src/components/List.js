import React, { useEffect } from 'react';
import Popup from './Popup';
import usePopup from '../hooks/usePopup';
import '../styles/List.scss';

const List = (props) => {
  // get state from location
  const { state } = props.location;

  // set title
  useEffect(() => {
    document.title = state.name;
  }, [state.name]);

  // Get/set state of popup
  const { isShowingPopup, togglePopup, message } = usePopup();

  // Function to delete a list
  const deleteList = async () => {
    try {
      // lazy load
      const { deleteListPromise } = await import(/* webpackChunkName: "deleteListPromise" */'../helpers/dbhelper');
      // delete list
      await deleteListPromise(state.name);
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
    props.history.push(`/lists/${encodeURIComponent(state.name)}/edit`, { listName: state.name });
  };


  return (
    <div className='container-list'>
      <Popup
        isShowing={isShowingPopup}
        text={message}
        hide={togglePopup}>
      </Popup>
      <h1 className='h1'>{state.name}</h1>
      <button className='btn btn--edit' onClick={editList}>edit</button>
      <button className='btn btn--share' onClick={shareList}>share</button>
      <button className='btn btn--delete' onClick={deleteList}>delete</button>
    </div>
  );
};

export default List;