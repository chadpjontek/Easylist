import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { getSharedList } from '../helpers/dbhelper';
import Popup from '../components/Popup';
import usePopup from '../hooks/usePopup';
const SharedList = (props) => {
  // get _id from location
  const id = decodeURI(window.location.pathname.split('/')[2]);

  // get/set local state
  const [isLoading, setIsLoading] = useState(false);
  const [list, setList] = useState(false);

  // Get/set state of popup
  const { isShowingPopup, togglePopup, message } = usePopup();

  // on first load...
  useEffect(() => {
    // ...fetch list
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const listCopy = await getSharedList(id);
        setIsLoading(false);
        if (!listCopy) {
          // something went wrong so return error
          togglePopup('Something went wrong. The list may no longer exist or is no longer shared. Make sure you are signed in.');
          document.title = 'list error';
        } else {
          console.log('list found!');
          setList(listCopy);
          // ...update title
          document.title = listCopy.name;
        }
      } catch (error) {
        setIsLoading(false);
        document.title = 'list error';
        throw new Error(error);
      }
    };
    fetchData();
  }, []);

  return (!list ?
    <div className="container">
      <Popup
        isShowing={isShowingPopup}
        text={message}
        hide={togglePopup} >
      </Popup >
      {isLoading ? <h1>Loading...</h1> : null}
    </div>
    :
    (
      <Redirect
        to={{
          pathname: '/',
          state: { from: props.location }
        }}
      />
    )
  );
};

export default SharedList;