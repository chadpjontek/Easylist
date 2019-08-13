import React, { useEffect, useState } from 'react';
import Popup from './Popup';
import usePopup from '../hooks/usePopup';
import Spinner from './Spinner';
import '../styles/Signin.scss';

const Signup = (props) => {
  // set/get state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Get/set state of popup
  const { isShowingPopup, togglePopup, message } = usePopup();

  // On first load...
  useEffect(() => {
    document.title = 'Sign up';
  }, []);

  //TODO: fix
  /**
   * Handle the form submit event
   * @param {Event} e - event object
   */
  const handleSubmit = e => {
    e.preventDefault();
    // Show spinner while making network request
    setIsLoading(true);

    // Send a request to the server to signup
    (async () => {
      try {
        const response = await fetch('http://localhost:3000/api/users', {
          body: JSON.stringify({ username, email, password }),
          mode: 'cors',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
        });
        // Parse body as json
        setIsLoading(false);
        const json = await response.json();
        if (json.error) {
          return togglePopup(json.error);
        }
        if (json.message) {
          // Notify user of successful signin
          togglePopup(json.message);
          return;
        }
        // If no json returned throw error
        throw new Error('something went wrong');
      } catch (error) {
        setIsLoading(false);
        const msg = `${error.name} - ${error.message}`;
        togglePopup(msg);
        console.error(error);
      }
    })();
  };

  /**
   * Handle input change events
   * @param {Event} e - event object
   */
  const handleChange = e => {
    switch (e.target.id) {
      case 'username': return setUsername(e.target.value);
      case 'email': return setEmail(e.target.value);
      case 'password': return setPassword(e.target.value);
      default: return;
    }
  };

  return (
    <div className='container signin'>
      <Popup
        isShowing={isShowingPopup}
        text={message}
        hide={togglePopup} >
      </Popup >
      <div>
        <form id='signIn' onSubmit={handleSubmit}>
          <div className="group">
            <input required className='username-input' type="text" name="" id="username" onChange={handleChange} />
            <label className='label--username' htmlFor="username">username</label>
          </div>
          <div className="group">
            <input required className='email-input' type="text" name="" id="email" onChange={handleChange} />
            <label className='label--email' htmlFor="email">email</label>
          </div>
          <div className="group">
            <input required type="password" name="" id="password" onChange={handleChange} />
            <label className='label--password' htmlFor="password">password</label>
          </div>
          {isLoading ? <Spinner /> : <button className='btn btn--signin' type="submit">Sign up</button>}

        </form>
      </div>
      <div className="note note--signup">
        <p className="note--signup__p">Already have an account?</p>
        <button onClick={() => props.history.push('/signin')} className="btn note--signup__button">Sign in</button>
      </div>
    </div>
  );
};

export default Signup;