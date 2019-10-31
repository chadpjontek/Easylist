import React, { useEffect } from 'react';
import uuid from 'uuid/v1';

import {
  addListPromise
} from '../helpers/dbhelper';
import '../styles/List.scss';

const ListCopy = (props) => {
  // Get any previous list state from react router
  const { list } = props.location.state;

  // on first load...
  useEffect(() => {
    document.title = `${list.name}`;
  }, []);

  const saveList = async () => {
    list._id = uuid();
    await addListPromise(list);
    // redirect to lists page
    props.history.push('/lists');
  };

  return (
    <div className='container view-list'>
      <div className="list-header">
        <h1 className='h1'>{list.name}</h1>
        <button className='btn btn--list btn--save' onClick={saveList}>save list</button>
      </div>
      <div className={`editbox ${list.backgroundColor}--note`} dangerouslySetInnerHTML={{ __html: list.html }}></div>
    </div >
  );
};

export default ListCopy;