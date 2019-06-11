import React, { useEffect } from 'react';
import TitleHeader from './TitleHeader';
import MenuModal from './MenuModal';
import useMenuModal from '../hooks/useMenuModal';
import ourPic from '../images/our-pic.jpg';
import web from '../images/website.svg';
import github from '../images/github.svg';
import twitter from '../images/twitter.svg';
import linkedin from '../images/linkedin.svg';

const Home = () => {
  useEffect(() => {
    document.title = 'EasyList';
  });
  const { isShowingMenu, toggleMenu } = useMenuModal(false);
  return (
    <div className='container container--home'>
      <header>
        <TitleHeader />
      </header>
      <main className='main'>
        <button className='btn btn--menu' onClick={toggleMenu}>
          Menu
        </button>
        <MenuModal
          isShowing={isShowingMenu}
          hide={toggleMenu} />
        <div className="container--note">
          <h2 className="main__h2 main__h2--what">What?</h2>
          <div className="note note--what">Easy List is a task/list maker app that allows you to share your lists with others easily. It&apos;s free to use and there is no download required.</div>
          <h2 className="main__h2 main__h2--why">Why?</h2>
          <div className="note note--why">The goal of Easy List is to keep things as simple as possible while still being a useful tool to track &quot;to-dos&quot; as well as be able to share them with others. </div>
          <h2 className="main__h2 main__h2--how">How?</h2>
          <div className="note note--how1">Begin with the &quot;Menu&quot; button. Here you can either create a list or view your lists. </div>
          <div className="note note--how2">
            <br />
            Creating a list is straight forward. Upon creating one, you can share it. </div>
          <div className="note note--how3">The &quot;Save&quot; button will save a copy to your device. Create a free account if you wish to have cloud access on any device.</div>
          <div className="note note--how4">The &quot;Share&quot; button will copy the link to your list that you can then share with whomever you choose.</div>
          <div className="note note--how5">When viewing your lists, you will be able to delete, edit, or share them.</div>
          <div className="note note--how6">Optionally you can set up email notifications for when a task has been completed by someone you have shared a list with. These can be turned on or off for specific tasks.</div>
          <div className="note note--donate">This app is completely free and ad-free. If you enjoy it, please consider a donation. My son and I thank you for your support!
            <button className='btn-donate'></button>
          </div>
          <img className='our-pic' src={ourPic} alt="" />
        </div>
      </main>
      <footer>
        <div className="container--footer">
          <p className='copyright'>
            Copyright 2019 - Chad Pjontek
          </p>
          <div className="container--icons">
            <img className='icon' src={web} alt="website icon" />
            <img className='icon' src={github} alt="github icon" />
            <img className='icon' src={twitter} alt="twitter icon" />
            <img className='icon' src={linkedin} alt="linkedIn icon" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;