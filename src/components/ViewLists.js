import React, { useState, useEffect } from 'react';
import { getListsPromise } from '../helpers/dbhelper';

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
    <div className='container'>
      <h1 className='h1'>View lists page</h1>
      <ul>
        {lists.map((list, i) => <li key={i} onClick={handleClick}>{list.name}</li>)}
      </ul>
    </div>
  );
};

export default ViewLists;