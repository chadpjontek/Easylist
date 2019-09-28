import React, { useEffect, useState } from 'react';
import Popup from './Popup';
import usePopup from '../hooks/usePopup';
import Spinner from '../components/Spinner';
import { clearTokens, addToken } from '../helpers/dbhelper';
import '../styles/Signin.scss';

const SignIn = (props) => {
  // set/get state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Get/set state of popup
  const { isShowingPopup, togglePopup, message } = usePopup();

  // On first load...
  useEffect(() => {
    document.title = 'Sign in';
    // check if this is a redirect from an email verification...
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('msg');
    // ... display the message if there is
    if (myParam) {
      togglePopup(myParam);
    }
  }, []);

  /**
   * Handle the form submit event
   * @param {Event} e - event object
   */
  const handleSubmit = e => {
    e.preventDefault();
    // Send a request to the server to signin with email and password
    (async () => {
      try {
        // Show spinner while making network request
        setIsLoading(true);
        const response = await fetch('http://localhost:3000/api/users/signin', {
          body: JSON.stringify({ email, password }),
          mode: 'cors',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
        });
        // Parse body as json
        const json = await response.json();
        if (json.token) {
          // Delete other tokens from IDB
          await clearTokens();
          // Put JWT in token store
          await addToken({ createdAt: Date.now(), token: json.token });
          // Notify user of successful signin
          setIsLoading(false);
          togglePopup('Successful sign in!');
          return;
        }
        if (json.error) {
          throw new Error(json.error);
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
            <input required className='email-input' type="text" name="" id="email" onChange={handleChange} />
            <label className='label--email' htmlFor="email">email</label>
          </div>
          <div className="group">
            <input required type="password" name="" id="password" onChange={handleChange} />
            <label className='label--password' htmlFor="password">password</label>
          </div>
          {isLoading ? <Spinner content='checking...' /> :
            <button className='btn btn--primary' type="submit">Sign in</button>}
        </form>
      </div>
      <div className="note note--signup">
        <p className="note--signup__p">Not registered? Create an account. It&apos;s free!</p>
        <button onClick={() => props.history.push('/signup')} className="btn btn--primary">Sign up</button>
      </div>
    </div>
  );
};

export default SignIn;