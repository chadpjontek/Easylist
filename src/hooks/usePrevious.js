import { useRef, useEffect } from 'react';

/**
 * A hook to store a previous state value
 * @param {*} value - The value you want to store
 */
const usePrevious = (value) => {
  // Reference hook
  const ref = useRef();

  // If value changes, store value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]);

  // Return previous value
  return ref.current;
};

export default usePrevious;