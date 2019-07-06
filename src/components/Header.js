import React from 'react';
import useMenuModal from '../hooks/useMenuModal';
import MenuModal from '../components/MenuModal';

export default function Header(props) {
  // Get/set state of MenuModal
  const { isShowingMenu, toggleMenu } = useMenuModal();
  return (
    <header>
      <nav>
        <button className='btn btn-menu' onClick={toggleMenu}>
          Menu
        </button>
      </nav>
      <MenuModal
        isShowing={isShowingMenu}
        hide={toggleMenu} />
    </header>
  );
}
