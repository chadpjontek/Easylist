import React, { useEffect } from 'react';

const List = (props) => {
  // destruct to get listName from React Router's state history
  const { listName } = props.history.location.state || { listName };
  useEffect(() => {
    document.title = listName;
  });
  // Function to delete a list
  const deleteList = async () => {
    try {
      const { deleteListPromise } = await import(/* webpackChunkName: "deleteListPromise" */'../helpers/dbhelper');
      //TODO: get id of list to delete
      const id = 0;
      deleteListPromise(id);
    } catch (error) {
      throw new Error(error);
    }
  };

  return (
    <div className='container'>
      <h1 className='h1'>{listName}</h1>
      <button onClick={deleteList}>delete</button>
    </div>
  );
};

export default List;