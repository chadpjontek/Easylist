import React from 'react';
import { useSpring, animated } from 'react-spring';

const Spinner = (props) => {
  const { content } = props;
  // Create route page animations
  const style = useSpring({
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
    <animated.div className='btn btn--primary spinner' style={style}>{content}</animated.div>
  );
};

export default Spinner;