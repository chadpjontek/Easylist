import React, { useState, useEffect } from 'react';
import '../styles/TitleHeader.scss';
import logo from '../images/easylist-logo.svg';
import checkbox from '../images/checkbox.svg';
import checkmark from '../images/checkmark.svg';

const TitleHeader = () => {
  return (
    <div className='TitleHeader'>
      <img className='TitleHeader__img' src={logo} alt="Easy List logo" />
      <p className='TitleHeader__description'>A shareable list app.</p>
      <br />
      <ul className="TitleHeader__list">
        <li>
          <img className='TitleHeader__checkbox' src={checkbox} />
          <img className='TitleHeader__checkmark' src={checkmark} />
          <span className="TitleHeader__checkbox-label">Make a list.</span>
        </li>
        <li>
          <img className='TitleHeader__checkbox' src={checkbox} />
          <img className='TitleHeader__checkmark' src={checkmark} />
          <span className="TitleHeader__checkbox-label">Save it.</span>
        </li>
        <li>
          <img className='TitleHeader__checkbox' src={checkbox} />
          <img className='TitleHeader__checkmark' src={checkmark} />
          <span className="TitleHeader__checkbox-label">Share it.</span>
        </li>
      </ul>
      <br />
      <p className='TitleHeader__description'>It&apos;s easy!</p>
    </div>
  );
};

export default TitleHeader;