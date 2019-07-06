import React from 'react';
import bold from '../images/bold.svg';
import editCheck from '../images/edit-check.svg';
import italic from '../images/italic.svg';
import nestedList from '../images/nested-list.svg';
import notify from '../images/notify.svg';
import ol from '../images/ol.svg';
import underline from '../images/underline.svg';
import '../styles/EditList.scss';

const EditTools = (props) => {
  return (
    <div className="edit">
      <div className='row'>
        <div className="column">
          <button className='btn-edit'><img src={ol} alt="toggle ordered list" /></button>
        </div>
        <div className="column">
          <button className='btn-edit'>
            <img src={editCheck} alt="toggle checkboxes" />
          </button>
        </div>
        <div className="column">
          <button className='btn-edit highlight'>
            <img src={nestedList} alt="link to other list" />
          </button>
        </div>
        <div className="column">
          <button className='btn-edit'>
            <img src={bold} alt="toggle bold" />
          </button>
        </div>
        <div className="column">
          <button className='btn-edit'>
            <img src={italic} alt="toggle italic" />
          </button>
        </div>
        <div className="column">
          <button className='btn-edit'>
            <img src={underline} alt="toggle underline" />
          </button>
        </div>
        <div className="column">
          <button className='btn-edit highlight'>
            <img src={notify} alt="toggle notification" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTools;