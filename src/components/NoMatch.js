import React, { useEffect } from 'react';

const NoMatch = () => {
  useEffect(() => {
    document.title = '404';
  });
  return (
    <div className='container'>
      <h1 className='h1'>Opps. Nothing to see here. Error 404.</h1>
    </div>
  );
};

export default NoMatch;