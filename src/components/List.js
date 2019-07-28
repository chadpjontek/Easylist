import React, { useEffect, useState } from 'react';
import Popup from './Popup';
import usePopup from '../hooks/usePopup';
import { getListPromise } from '../helpers/dbhelper';
import '../styles/List.scss';

const List = (props) => {
  // get listName from location
  const listName = decodeURI(window.location.pathname.split('/')[2]);

  // local state
  const [items, setItems] = useState([]);

  // on first load...
  useEffect(() => {
    // ...update title
    document.title = listName;
    // ...fetch list items
    const fetchData = async () => {
      try {
        const results = await getListPromise(listName);
        setItems(results.items);
      } catch (error) {
        throw new Error(error);
      }
    };
    fetchData();
  }, []);

  // Get/set state of popup
  const { isShowingPopup, togglePopup, message } = usePopup();

  // Function to delete a list
  const deleteList = async () => {
    try {
      // lazy load
      const { deleteListPromise } = await import(/* webpackChunkName: "deleteListPromise" */'../helpers/dbhelper');
      // delete list
      await deleteListPromise(listName);
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
    props.history.push(`/lists/${encodeURIComponent(listName)}/edit`, { listName: listName });
  };


  return (
    <div className='container-list'>
      <Popup
        isShowing={isShowingPopup}
        text={message}
        hide={togglePopup}>
      </Popup>
      <div className="list-header">
        <h1 className='h1'>{listName}</h1>
        <button className='btn btn--edit' onClick={editList}>edit</button>
        <button className='btn btn--share' onClick={shareList}>share</button>
        <button className='btn btn--delete' onClick={deleteList}>delete</button>
      </div>
      <ul className='items'>
        {items.map((item, i) => <li
          key={i}
          className='item'>
          {item.content}
        </li>)}
      </ul>
    </div>
  );
};

export default List;