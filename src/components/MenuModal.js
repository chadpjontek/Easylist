import React from 'react';
import { createPortal } from 'react-dom';
import '../styles/MenuModal.scss';
import { Link } from 'react-router-dom';
import FocusTrap from 'focus-trap-react';

const MenuModal = ({ isShowing, hide }) => {
  return isShowing ? createPortal(
    <div id='menuModal' className="modal">
      <FocusTrap>
        <div className="modal-content" aria-modal="true" tabIndex="-1" role='dialog' aria-label="Menu">
          <div className="menu-btn-group">
            <Link exact to='/' onClick={hide} className='btn btn--home'>Home</Link>
            <Link to='/signin' onClick={hide} className='btn btn--sign-in'>Sign in</Link>
            <Link to='/lists/create' onClick={hide} className='btn btn--make-list'>Create list</Link>
            <Link to='/lists' onClick={hide} className='btn btn--view-lists'>View lists</Link>
            <Link to='/donate' onClick={hide} className='btn btn--donate'>Donate</Link>
          </div>
        </div>
      </FocusTrap>
    </div>, document.getElementById('modal')
  ) : null;
};

export default MenuModal;