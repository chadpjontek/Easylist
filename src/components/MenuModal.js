import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import '../styles/MenuModal.scss';

const MenuModal = ({ showMenu, hide }) => {
  // TODO: Add routes to each menu item
  return showMenu ? createPortal(
    <div id='menuModal' className="modal">
      <div className="modal-content">
        <div className="menu-btn-group">
          <button onClick={hide} className='btn btn--sign-in'>Sign in</button>
          <button onClick={hide} className='btn btn--home'>Home</button>
          <button onClick={hide} className='btn btn--make-list'>Make a list</button>
          <button onClick={hide} className='btn btn--view-lists'>View lists</button>
          <button onClick={hide} className='btn btn--donate'>Donate</button>
        </div>
      </div>
    </div>, document.getElementById('modal')
  ) : null;
};

export default MenuModal;