import React, { useEffect, useState } from 'react';
import ContentEditable from 'react-contenteditable';
import uuid from 'uuid/v1';
import Popup from './Popup';
import usePopup from '../hooks/usePopup';
import {
  getListPromise,
  updateListPromise
} from '../helpers/dbhelper';
import bold from '../images/bold.svg';
import pantone from '../images/pantone.svg';
import italic from '../images/italic.svg';
import link from '../images/link.svg';
import notify from '../images/notify.svg';
import ol from '../images/ol.svg';
import save from '../images/save-icon.svg';
import '../styles/EditList.scss';

const EditList = (props) => {
  // Get any previous list state from react router
  const { list } = props.location.state;
  // local state getters/setters
  const [isOl, setIsOl] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('blue');
  const [notificationsOn, setNotificationsOn] = useState(false);
  const [html, setHtml] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [copiedFrom, setCopiedFrom] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [selection, setSelection] = useState(undefined);
  const [url, setUrl] = useState('');
  const [isInvalidList, setisInvalidList] = useState(false);
  const [name, setName] = useState('');
  const [id, setId] = useState(decodeURI(window.location.pathname.split('/')[2]));

  // Get/set state of popup
  const { isShowingPopup, togglePopup, message } = usePopup();

  // on first load...
  useEffect(() => {
    // ...fetch list data from IDB by _id

    const fetchData = async () => {
      try {
        const listPromise = await getListPromise(id);
        console.log(listPromise);
        // check and see if the shared list is the current user's list
        if (list && !listPromise) {
          // ...update title
          document.title = `Edit ${list.name}`;
          // ...update list state
          setName(list.name);
          setHtml(list.html);
          setBackgroundColor(list.backgroundColor);
          setNotificationsOn(list.notificationsOn);
          setIsPrivate(list.isPrivate);
          setIsFinished(list.isFinished);
          setCopiedFrom(list.copiedFrom);
          setId(uuid());
          return;
        }
        // ...update title
        document.title = `Edit ${name}`;
        // ...update list state
        setName(listPromise.name);
        setHtml(listPromise.html);
        setBackgroundColor(listPromise.backgroundColor);
        setNotificationsOn(listPromise.notificationsOn);
        setIsPrivate(listPromise.isPrivate);
      } catch (error) {
        document.title = 'list error';
        console.log(error);
        setisInvalidList(true);
        togglePopup('This list does not exist.');
      }
    };
    fetchData();
    // ... focus the ContentEditable
    document.querySelector('pre').focus();
    // ... make page unscrollable
    document.body.style.overflowY = 'hidden';
    // ... return a function to restore scrolling on dismount
    return () => document.body.style.overflowY = 'visible';
  }, []);

  // Focus input text when it is rendered
  useEffect(() => {
    if (showInput) {
      document.getElementById('inputText').focus();
    }
  });

  // ... when text selection changes
  useEffect(() => {
    const handleNewSelection = () => {
      selectionIsBold() ? setIsBold(true) : setIsBold(false);
      selectionIsItalic() ? setIsItalic(true) : setIsItalic(false);
    };
    document.addEventListener('selectionchange', handleNewSelection);
    return () => document.removeEventListener('selectionchange', handleNewSelection);
  }, []);

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

  /**
   * Returns whether the selection is italic or not
   */
  const selectionIsItalic = () => {
    let isItalic = false;
    if (document.queryCommandState) {
      isItalic = document.queryCommandState('italic');
    }
    return isItalic;
  };

  /**
   * Returns whether the selection is bold or not
   */
  const selectionIsBold = () => {
    let isBold = false;
    if (document.queryCommandState) {
      isBold = document.queryCommandState('bold');
    }
    return isBold;
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
    // ... focus the ContentEditable
    if (document.activeElement !== document.querySelector('pre')) {
      document.querySelector('pre').focus();
    }
    document.execCommand('bold', false);
    setIsBold(!isBold);
  };

  /**
   * Toggle italics
   */
  const toggleItalic = e => {
    e.preventDefault();
    // ... focus the ContentEditable
    if (document.activeElement !== document.querySelector('pre')) {
      document.querySelector('pre').focus();
    }
    document.execCommand('italic', false);
    setIsItalic(!isItalic);
  };

  /**
   * Cycle through background colors
   */
  const cycleBgColor = () => {
    const colors = [
      'blue',
      'purple',
      'red',
      'yellow',
      'green'
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
    if (showInput) {
      setShowInput(false);
      setUrl('');
      return document.querySelector('pre').focus();
    }
    setSelection(saveSelection());
    setUrl('');
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
      const msg = 'Notifications off. You will no longer be notified with task completions for this list.';
      togglePopup(msg);
    } else {
      // ... turn them on
      setNotificationsOn(true);
      const msg = 'Notifications on. You will recieve an email when someone you share this list with completes it\'s tasks.';
      togglePopup(msg);
    }
  };



  /**
   * Save list to IDB before redirecting to List page
   */
  const saveList = async () => {
    const updatedList = {
      _id: id,
      name,
      html,
      notificationsOn,
      backgroundColor,
      isPrivate,
      updatedAt: Date.now(),
      copiedFrom,
      isFinished
    };
    try {
      // Update the list in IDB
      await updateListPromise(updatedList);
      // Redirect to list page
      props.history.push(`/lists/${id}`, { _id: id });
    } catch (error) {
      togglePopup(error);
    }
  };

  const handleInputTextChange = e => {
    setUrl(e.target.value);
  };

  return (isInvalidList ?
    <div className='list--error'>
      <Popup
        isShowing={isShowingPopup}
        text={message}
        hide={togglePopup} >
      </Popup >
      <button className='btn btn--error' onClick={() => props.history.push('/')}>Home</button>
    </div >
    :
    <div className='container edit-list'>
      <Popup
        isShowing={isShowingPopup}
        text={message}
        hide={togglePopup} >
      </Popup >
      <div className="container-edit__header">
        <h1 className='h1'>{name}</h1>
        <div className="edit">
          <div className='row'>
            <div className="column">
              <button className={`btn btn-edit ${backgroundColor}`} onMouseDown={cycleBgColor}>
                <img src={pantone} alt="toggle underline" />
              </button>
            </div>
            <div className="column">
              <button className={isOl ? 'btn btn-edit purple' : 'btn btn-edit'} onMouseDown={toggleOl}><img src={ol} alt="toggle ordered list" /></button>
            </div>
            <div className="column">
              <button className={isBold ? 'btn btn-edit blue' : 'btn btn-edit'} onMouseDown={toggleBold}>
                <img src={bold} alt="toggle bold" />
              </button>
            </div>
            <div className="column">
              <button className={isItalic ? 'btn btn-edit green' : 'btn btn-edit'} onMouseDown={toggleItalic}>
                <img src={italic} alt="toggle italic" />
              </button>
            </div>
            <div className="column">
              <button className={showInput ? 'btn btn-edit yellow' : 'btn btn-edit'} onMouseDown={createLink}>
                <img src={link} alt="link to other list" />
              </button>
            </div>
            <div className="column">
              <button className={notificationsOn ? 'btn btn-edit red' : 'btn btn-edit'} onMouseDown={toggleNotify}>
                <img src={notify} alt="toggle notification" />
              </button>
            </div>
            <div className="column">
              <button className='btn btn-edit' onClick={saveList}>
                <img src={save} alt="save list" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <form style={showInput ? { visibility: 'visible' } : { visibility: 'hidden' }} onSubmit={handleSubmit}>
        <input id='inputText' type='text' required onChange={handleInputTextChange} value={url} />
        <label htmlFor='input'>Enter URL</label>
      </form>
      <ContentEditable
        className={`editbox ${backgroundColor}--note`}
        tagName='pre'
        html={html}
        onChange={handleChange}
      />
    </div>);
};

export default EditList;