import React, { useState, useEffect } from 'react';
import '../styles/PaperBackground.scss';

/**
 * A Component that creates a full screen, paper-like background that scales to
 * the user's screen.
 */
const PaperBackground = () => {
  // Make the background look like paper
  // Lines and holes needed to be added/removed on resize and component creation
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  let timeout = false;

  /**
   * Set state of windowHeight if it changes
   * @param {object} e - Event object
   */
  const handleResize = e => {
    if (windowHeight !== window.innerHeight) {
      setWindowHeight(window.innerHeight);
    }
  };

  /**
   * Limit rate of resize
   */
  const debounceResize = () => {
    clearTimeout(timeout);
    timeout = setTimeout(handleResize, 250);
  };

  // React Effect Hook
  useEffect(() => {
    // Check for resize events and handle
    window.addEventListener('resize', debounceResize);
    // Return a cleanup function
    return () => window.removeEventListener('resize', debounceResize);
  });

  // Get user's font-size
  const fontSize = Number(getComputedStyle(document.body, '')
    .fontSize.match(/(\d+)px/)[1]);

  // Set the spacing of the horizontal lines
  const lineHeight = fontSize * 2;

  // Get the number of horizontal lines to create
  const numLines = Math.floor(windowHeight / lineHeight);

  // ... and store each in an array
  const hLines = [...Array(numLines)]
    .map((e, i) => {
      let hLineStyle = {
        height: `${lineHeight}px`,
        top: `${(i * lineHeight) + lineHeight}px`
      };
      return <div
        className={i !== 0 ? 'h-line' : ''}
        style={hLineStyle}
        key={i + 'h'}>
      </div>;
    });

  // Store the vertical line in an array
  const vLine = [<div className="v-line" key={'vLine'}></div>];

  // Get the number of holes to create
  const numHoles = Math.floor(windowHeight / (lineHeight * 6));

  // ... and store each in an array
  const holes = [...Array(numHoles)]
    .map((e, i) => {
      let holeStyle = {
        top: `${(i * 6 * 42) + 42}px`
      };
      return <div className='paper-hole' style={holeStyle} key={i + 'ph'}></div>;
    });

  // Concat all the lines and holes and return them in div
  const lines = vLine.concat(hLines, holes);
  return <div id='paper'>{lines}</div>;
};

export default PaperBackground;