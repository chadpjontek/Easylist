import React from 'react';
import { useSpring, animated } from 'react-spring';

const Spinner = () => {
  // Create route page animations
  const props = useSpring({
    from: { opacity: 0 },
    to: async next => {
      // eslint-disable-next-line no-constant-condition
      while (1) {
        await next({ opacity: 1 });
        await next({ opacity: 0 });
      }
    },
  });

  return (
    <animated.div className='btn note--signup__button spinner' style={props}>checking...</animated.div>
  );
};

export default Spinner;