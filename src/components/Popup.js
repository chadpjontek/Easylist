import React from 'react';
import { useTransition, animated } from 'react-spring';
import usePrevious from '../hooks/usePrevious';
import '../styles/Popup.scss';

const Popup = ({ isShowing, hide, text }) => {
  // Create the animation for mounting/unmounting
  const transitions = useTransition(isShowing, null, {
    from: { transform: 'scale(1.5) translate3d(-300px, -200px, 0) rotateX(0deg) rotateY(90deg) rotateZ(-30deg)', opacity: 0 },
    enter: { transform: 'scale(1) translate3d(0,0,0) rotateX(0) rotateY(0) rotateZ(-10deg)', opacity: 1 },
    leave: { transform: 'scale(1.5) translate3d(200px, 0px, 0) rotateX(0) rotateY(-90deg) rotateZ(10deg)', opacity: 0 },
    unique: true
  });
  // Save the text for when component transitions out before unmounting
  const prevMsg = usePrevious(text);
  return transitions.map(({ item, key, props }) =>
    item ? (
      <animated.div key={key} style={props} className='popup' onClick={() => hide(prevMsg)}>
        <div className='popup__inner'>
          <p>{text}</p>
        </div>
      </animated.div>
    ) : null
  );
};

export default Popup;