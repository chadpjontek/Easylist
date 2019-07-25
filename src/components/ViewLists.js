import React, { useState, useEffect } from 'react';
import { getListsPromise } from '../helpers/dbhelper';

const ViewLists = () => {
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

  return (
    <div className='container'>
      <h1 className='h1'>View lists page</h1>
      <ul>
        {lists.map((list, i) => <li key={i}>{list.name}</li>)}
      </ul>
    </div>
  );
};

export default ViewLists;