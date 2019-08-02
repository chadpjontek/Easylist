import React, { useEffect, useState } from 'react';
import ContentEditable from 'react-contenteditable';
import { getListPromise } from '../helpers/dbhelper';
import bold from '../images/bold.svg';
import pantone from '../images/pantone.svg';
import italic from '../images/italic.svg';
import link from '../images/link.svg';
import notify from '../images/notify.svg';
import ol from '../images/ol.svg';
import save from '../images/save-icon.svg';
import '../styles/EditList.scss';

const EditList = (props) => {
  // Get the name of list from the url path
  const name = decodeURI(window.location.pathname.split('/')[2]);

  // local state getters/setters
  const [isOl, setIsOl] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#E0EFFA');
  const [notificationsOn, setNotificationsOn] = useState(false);
  const [html, setHtml] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [selection, setSelection] = useState(undefined);
  const [url, setUrl] = useState('');

  // on first load...
  useEffect(() => {
    // ...update title
    document.title = `Edit ${name}`;
    // ... focus the ContentEditable
    document.querySelector('pre').focus();
    // ...fetch list data from IDB
    const fetchData = async () => {
      try {
        const { html, backgroundColor, notificationsOn } = await getListPromise(name);
        // ...update list state
        setHtml(html);
        setBackgroundColor(backgroundColor);
        setNotificationsOn(notificationsOn);
      } catch (error) {
        throw new Error(error);
      }
    };
    fetchData();
  }, []);

  // Focus input text when it is rendered
  useEffect(() => {
    if (showInput) {
      document.getElementById('inputText').focus();
    }
  });

  /**
 * Save the selection by returning its range objects
 */
  const saveSelection = () => {
    if (window.getSelection) {
      const sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        let ranges = [];
        for (let i = 0, len = sel.rangeCount; i < len; ++i) {
          ranges.push(sel.getRangeAt(i));
        }
        return ranges;
      }
    } else if (document.selection && document.selection.createRange) {
      return document.selection.createRange();
    }
    return null;
  };

  /**
   * Restore the selected area
   * @param {[Range]} savedSel - The range objects of the previously selected area
   */
  const restoreSelection = (savedSel) => {
    if (savedSel) {
      if (window.getSelection) {
        const sel = window.getSelection();
        sel.removeAllRanges();
        for (let i = 0, len = savedSel.length; i < len; ++i) {
          sel.addRange(savedSel[i]);
        }
      } else if (document.selection && savedSel.select) {
        savedSel.select();
      }
    }
  };

  // Handle form submit
  const handleSubmit = e => {
    e.preventDefault();
    // Re-select last selection
    restoreSelection(selection);
    // Create a hyperlink on that selection with the user input url
    document.execCommand('createLink', false, url);
    // Remove the input
    setShowInput(false);
  };

  // Handle input text changes
  const handleChange = e => {
    // Set the html state to the current value
    setHtml(e.target.value);
  };

  /**
   * Toggle between ordered/unordered list
   */
  const toggleOl = e => {
    e.preventDefault();
    // If the current state is ordered...
    if (isOl) {
      // ... switch to unordered
      document.execCommand('insertUnorderedList');
    } else {
      // ... swtich to ordered
      document.execCommand('insertOrderedList');
    }
    // toggle state
    setIsOl(!isOl);
  };

  /**
   * Toggle bold
   */
  const toggleBold = e => {
    e.preventDefault();
    document.execCommand('bold', false);
    setIsBold(!isBold);
  };

  /**
   * Toggle italics
   */
  const toggleItalic = e => {
    e.preventDefault();
    document.execCommand('italic', false);
    setIsItalic(!isItalic);
  };

  /**
   * Cycle through background colors
   */
  const cycleBgColor = () => {
    const colors = [
      '#E0EFFA', // blue
      '#F8E9FC', // purple
      '#FDE2E2', // red
      '#F3FEA8', // yellow
      '#C7F6D4' // green
    ];
    // Get current color's index
    const curColIdx = colors.findIndex(e => e === backgroundColor);
    // Return the first color if at end of array
    if (curColIdx === colors.length - 1) {
      return setBackgroundColor(colors[0]);
    }
    // else cycle to next color
    setBackgroundColor(colors[curColIdx + 1]);
  };

  /**
   * Handle link creation
   */
  const createLink = e => {
    e.preventDefault();
    setSelection(saveSelection());
    setShowInput(true);
  };

  /**
   * Toggle notification
   */
  const toggleNotify = () => {
    // If notifications are on...
    if (notificationsOn) {
      // ... turn them off
      setNotificationsOn(false);
    } else {
      // ... turn them on
      setNotificationsOn(true);
    }
  };

  /**
   * Save list to IDB before redirecting to List page
   */
  const saveList = async () => {
    const updatedList = {
      name,
      html,
      notificationsOn,
      backgroundColor
    };
    try {
      // Update the list in IDB
      const { updateListPromise } = await import(/* webpackChunkName: "updateListPromise" */'../helpers/dbhelper');
      await updateListPromise(updatedList);
      // Redirect to list page
      props.history.push(`/lists/${name}`, { name });
    } catch (error) {
      throw new Error(error);
    }
  };

  const handleInputTextChange = e => {
    setUrl(e.target.value);
  };

  return (
    <div className='container-edit'>
      <div className="container-edit__header">
        <h1 className='h1'>{name}</h1>
        <div className="edit">
          <div className='row'>
            <div className="column">
              <button className={isOl ? 'btn btn-edit selected' : 'btn btn-edit'} onMouseDown={toggleOl}><img src={ol} alt="toggle ordered list" /></button>
            </div>
            <div className="column">
              <button className={isBold ? 'btn btn-edit selected' : 'btn btn-edit'} onMouseDown={toggleBold}>
                <img src={bold} alt="toggle bold" />
              </button>
            </div>
            <div className="column">
              <button className={isItalic ? 'btn btn-edit selected' : 'btn btn-edit'} onMouseDown={toggleItalic}>
                <img src={italic} alt="toggle italic" />
              </button>
            </div>
            <div className="column">
              <button className='btn btn-edit highlight' onMouseDown={createLink}>
                <img src={link} alt="link to other list" />
              </button>
            </div>
            <div className="column">
              <button className='btn btn-edit' onMouseDown={cycleBgColor} style={{ backgroundColor }}>
                <img src={pantone} alt="toggle underline" />
              </button>
            </div>
            <div className="column">
              <button className={notificationsOn ? 'btn btn-edit alert' : 'btn btn-edit'} onMouseDown={toggleNotify}>
                <img src={notify} alt="toggle notification" />
              </button>
            </div>
            <div className="column">
              <button className='btn btn-edit success' onClick={saveList}>
                <img src={save} alt="save list" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {showInput ? <form onSubmit={handleSubmit}>
        <input id='inputText' type='text' required onChange={handleInputTextChange} />
        <label htmlFor='input'>Enter url</label>
      </form> : null}
      <ContentEditable
        style={{ backgroundColor }}
        className='editbox'
        tagName='pre'
        html={html}
        onChange={handleChange}
      />
    </div>
  );
};

export default EditList;