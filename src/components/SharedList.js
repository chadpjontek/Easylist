import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { getSharedList } from '../helpers/dbhelper';
import Popup from '../components/Popup';
import usePopup from '../hooks/usePopup';
const SharedList = (props) => {
  // get _id from location
  const id = decodeURI(window.location.pathname.split('/')[2]);
  console.log(id);

  // Get/set state of popup
  const { isShowingPopup, togglePopup, message } = usePopup();

  // on first load...
  useEffect(() => {
    // ...fetch list
    const fetchData = async () => {
      try {
        const listCopy = await getSharedList(id);
        if (!listCopy) {
          // something went wrong so return error
          togglePopup('Something went wrong. The list may no longer exist or is no longer shared. Make sure you are signed in.');
          document.title = 'list error';
        } else {
          console.log('list found!');
          // redirect with new list copy
          setTimeout(() => props.history.push({
            pathname: `/lists/${id}/edit`,
            state: { list: listCopy }
          }), 1500
          );
        }
      } catch (error) {
        // setIsLoading(false);
        document.title = 'list error';
        throw new Error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className='container view-list'>
      <Popup
        isShowing={isShowingPopup}
        text={message}
        hide={togglePopup} >
      </Popup >
      <h1 className='h1'>Loading...</h1>
    </div >
  );
};

export default SharedList;