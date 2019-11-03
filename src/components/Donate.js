import React, { useEffect } from 'react';
import ourPic from '../images/our-pic.jpg';

const Donate = () => {
  useEffect(() => {
    document.title = 'Donate';
  }, []);
  const routeToDonate = () => {
    window.location.href = 'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=KA4UXP6PBC5P4&source=url';
  };
  return (
    <div className='container'>
      <div className="note note--donate donate-page">This app is completely free and ad-free. If you enjoy it, please consider a donation. My son and I thank you for your support!
        <button className='btn btn-donate' onClick={routeToDonate}></button>
      </div>
      <img className='our-pic donate-page' src={ourPic} alt="" />
    </div>
  );
};

export default Donate;