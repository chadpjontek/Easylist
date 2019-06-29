import React, { useEffect } from 'react';

const Donate = () => {
  useEffect(() => {
    document.title = 'Donate';
  });
  return (
    <div className='container'>
      <h1 className='h1'>Donate page</h1>
    </div>
  );
};

export default Donate;