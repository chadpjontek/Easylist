import React from 'react';
import bold from '../images/bold.svg';
import editCheck from '../images/edit-check.svg';
import italic from '../images/italic.svg';
import nestedList from '../images/nested-list.svg';
import notify from '../images/notify.svg';
import ol from '../images/ol.svg';
import underline from '../images/underline.svg';
import save from '../images/save-icon.svg';
import { useStateValue } from '../hooks/stateManager';
import useRouter from '../hooks/useRouter';
import '../styles/EditList.scss';

const EditTools = (props) => {
  // Store location history
  const { history } = useRouter();
  const [{ name, items, isOl, isCBox, isBold, isItalic, isUnderlined }, dispatch] = useStateValue();

  /**
   * Toggles if list is ordered
   */
  const toggleOl = () => {
    dispatch({
      type: 'toggleOl',
      isOl: !isOl
    });
  };

  /**
   * Toggles checkbox
   */
  const toggleCBox = () => {
    dispatch({
      type: 'toggleCBox',
      isCBox: !isCBox
    });
  };

  /**
   * Toggles bold
   */
  const toggleBold = () => {
    dispatch({
      type: 'toggleBold',
      isBold: !isBold
    });
  };

  /**
   * Toggles italics
   */
  const toggleItalic = () => {
    dispatch({
      type: 'toggleItalic',
      isItalic: !isItalic
    });
  };

  /**
   * Toggles underline
   */
  const toggleUnderline = () => {
    dispatch({
      type: 'toggleUnderline',
      isUnderlined: !isUnderlined
    });
  };

  /**
   * Open dialog to link to another list
   */
  const linkToList = () => {
    //TODO: select list to link to and add to item with a highlight
  };

  /**
   * Toggles notification
   */
  const toggleNotify = () => {
    //TODO: put bell on item
  };


  /**
   * Saves list to IDB before redirecting to List page
   */
  const saveList = async () => {
    try {
      // Update the list in IDB
      const { updateListPromise } = await import(/* webpackChunkName: "updateListPromise" */'../helpers/dbhelper');
      await updateListPromise({ name, items });
      // Redirect to list page
      history.push(`/lists/${name}`, { name });
    } catch (error) {
      throw new Error(error);
    }
  };

  return (
    <div className="edit">
      <div className='row'>
        <div className="column">
          <button className={isOl ? 'btn-edit selected' : 'btn-edit'} onClick={toggleOl}><img src={ol} alt="toggle ordered list" /></button>
        </div>
        <div className="column">
          <button className={isCBox ? 'btn-edit selected' : 'btn-edit'} onClick={toggleCBox}>
            <img src={editCheck} alt="toggle checkboxes" />
          </button>
        </div>
        <div className="column">
          <button className={isBold ? 'btn-edit selected' : 'btn-edit'} onClick={toggleBold}>
            <img src={bold} alt="toggle bold" />
          </button>
        </div>
        <div className="column">
          <button className={isItalic ? 'btn-edit selected' : 'btn-edit'} onClick={toggleItalic}>
            <img src={italic} alt="toggle italic" />
          </button>
        </div>
        <div className="column">
          <button className={isUnderlined ? 'btn-edit selected' : 'btn-edit'} onClick={toggleUnderline}>
            <img src={underline} alt="toggle underline" />
          </button>
        </div>
        <div className="column">
          <button className='btn-edit highlight' onClick={linkToList}>
            <img src={nestedList} alt="link to other list" />
          </button>
        </div>
        <div className="column">
          <button className='btn-edit highlight' onClick={toggleNotify}>
            <img src={notify} alt="toggle notification" />
          </button>
        </div>
        <div className="column">
          <button className='btn-edit success' onClick={saveList}>
            <img src={save} alt="save list" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTools;