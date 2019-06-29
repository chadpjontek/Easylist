import React, { useEffect } from 'react';

const ViewLists = () => {
  useEffect(() => {
    document.title = 'View lists';
  });
  return (
    <div className='container'>
      <h1 className='h1'>View lists page</h1>
    </div>
  );
};

export default ViewLists;