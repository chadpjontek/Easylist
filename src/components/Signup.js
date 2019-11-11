import React, { useEffect, useState } from 'react';
import Popup from './Popup';
import Spinner from './Spinner';
import usePopup from '../hooks/usePopup';
import { apiServerUrl } from '../helpers/dbhelper';
import '../styles/Signin.scss';

const SignUp = (props) => {
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

  /**
   * Handle the form submit event
   * @param {Event} e - event object
   */
  const handleSubmit = e => {
    e.preventDefault();
    // Send a request to the server to signup
    (async () => {
      try {
        // Show spinner while making network request
        setIsLoading(true);
        const response = await fetch(`${apiServerUrl}/api/users`, {
          body: JSON.stringify({ username, email, password }),
          mode: 'cors',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
        });
        // Parse body as json
        const json = await response.json();
        if (json.msg) {
          // Notify user of successful signup
          setIsLoading(false);
          togglePopup(json.msg);
          return;
        }
        if (json.error) {
          throw new Error(json.error);
        }
        // If no json returned throw error
        throw new Error('something went wrong');
      } catch (error) {
        setIsLoading(false);
        let msg;
        if (error.name === 'SyntaxError') {
          msg = 'You have reached your max number of server requests. Try again in a few minutes.';
        } else if (error.name === 'TypeError') {
          msg = 'Check your internet connection try again.';
        } else {
          msg = `${error.name} - ${error.message}`;
        }
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
    <div className='container'>
      <Popup
        isShowing={isShowingPopup}
        text={message}
        hide={togglePopup} >
      </Popup >
      <div className='form-container'>
        <form id='signIn' onSubmit={handleSubmit}>
          <div className="group">
            <input
              required
              minLength='3'
              maxLength='16'
              className='username-input'
              type="text"
              id="username"
              onChange={handleChange} />
            <label className='label--username' htmlFor="username">username</label>
          </div>
          <div className="group">
            <input required className='email-input' type="text" id="email" onChange={handleChange} />
            <label className='label--email' htmlFor="email">email</label>
          </div>
          <div className="group">
            <input required type="password" id="password" onChange={handleChange} />
            <label className='label--password' htmlFor="password">password</label>
          </div>
          {isLoading ? <Spinner content='checking...' /> : <button className='btn btn--primary' type="submit">Sign up</button>}

        </form>
      </div>
      <div className="note note--signup">
        <p className="note--signup__p">Already have an account?</p>
        <button onClick={() => props.history.push('/signin')} className="btn btn--primary">Sign in</button>
      </div>
    </div>
  );
};

export default SignUp;