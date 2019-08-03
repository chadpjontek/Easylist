import React, { useState, useEffect } from 'react';
import { getListsPromise } from '../helpers/dbhelper';
import '../styles/ViewLists.scss';


const ViewLists = (props) => {
  // local state getters/setters
  const [lists, setLists] = useState(null);


  // on first load...
  useEffect(() => {
    // ... change title
    document.title = 'View lists';
    // ... fetch list data
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
      <div className='lists'>
        {lists ? lists.map((list, i) => <div
          style={{ transform: `rotate(${Math.floor(Math.random() * (15 - -15) + -15)}deg)` }}
          key={i}
          onClick={handleClick}
          className={`list ${list.backgroundColor}--note`}>
          {list.name}
        </div>) : null}
      </div>
    </div >
  );
};

export default ViewLists;