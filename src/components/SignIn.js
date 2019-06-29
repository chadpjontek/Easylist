import React, { useEffect } from 'react';

const SignIn = () => {
  useEffect(() => {
    document.title = 'Sign in';
  });
  return (
    <div className='container'>
      <h1 className='h1'>Sign in page</h1>
    </div>
  );
};

export default SignIn;