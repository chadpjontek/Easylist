import React, { useState, useEffect } from 'react';
import { getListsPromise } from '../helpers/dbhelper';
import '../styles/ViewLists.scss';

const ViewLists = (props) => {
  const [lists, setLists] = useState([]);
  useEffect(() => {
    document.title = 'View lists';
    const fetchData = async () => {
      try {
        const results = await getListsPromise();
        setLists(results);
      } catch (error) {
        throw new Error(error);
      }
    };
    fetchData();
  }, []);

  // handle list click
  const handleClick = e => {
    // redirect to the list page
    const name = e.target.innerHTML;
    props.history.push(`/lists/${name}`, { name });
  };


  return (
    <div className='container-view-lists'>
      <h1 className='h1'>Your lists:</h1>
      <ul className='lists'>
        {lists.map((list, i) => <li
          key={i}
          onClick={handleClick}
          className='list'>
          {list.name}
        </li>)}
      </ul>
    </div>
  );
};

export default ViewLists;