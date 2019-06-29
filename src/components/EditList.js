import React, { useEffect } from 'react';

const EditList = (props) => {
  // destruct to get listName from React Router's state history
  const { listName } = props.history.location.state || { listName };
  useEffect(() => {
    document.title = 'Edit list';
  });
  return (
    <div className='container'>
      <h1 className='h1'>{listName}</h1>
    </div>
  );
};

export default EditList;