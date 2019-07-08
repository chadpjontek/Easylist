import React, { useEffect, useState } from 'react';
import { useStateValue } from '../hooks/stateManager';
import del from '../images/delete.svg';

// The input form
const InputForm = (props) => {
  const { handleSubmit, handleChange, inputContent } = props;
  return (
    <form onSubmit={handleSubmit}>
      <input id='input' type='text' required onChange={handleChange} />
      <span className='bar'></span>
      <label htmlFor='input'>Add item</label>
    </form>
  );
};

// Item
const Item = (props) => {
  const { content, deleteItem } = props;
  // Calculate the approx length of content in px
  const itemWidth = content.length * 9.24;
  // Calculate the available screen space to add item
  const screenSpace = window.innerWidth - 80;
  // Calculate lines needed to add the item
  const linesNeeded = Math.ceil(itemWidth / screenSpace);
  // Create regex to determine where to split string into array
  const re = new RegExp(`.{1,${Math.floor(screenSpace / 9.24)}}`, 'g');
  // Split the string into an array
  const lines = content.match(re);
  return (
    <div>
      {lines.map((e, i) => <li key={'line-' + i} className="item">{e}</li>)}
      <button onClick={deleteItem} className='btn-del'><img src={del} alt="delete" /></button>
    </div>
  );
};


const EditList = (props) => {
  // destruct to get listName from React Router's state history
  const { listName } = props.history.location.state || { listName };
  // get/set listName from global state
  const [{ currentList }, dispatch] = useStateValue();
  useEffect(() => {
    // store listname in global state for header component
    dispatch({
      type: 'changeList',
      newList: listName || 'error'
    });
  }, [listName]);
  useEffect(() => {
    document.title = 'Edit list';
  }, [listName]);

  // state
  const [isOrderedList, setIsOrderedList] = useState(false);
  const [isCheckbox, setIsCheckbox] = useState(false);
  const [isShowingMore, setIsShowingMore] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderlined, setIsUnderlined] = useState(false);
  const [isShowingForm, setIsShowingForm] = useState(false);
  const [inputContent, setInputContent] = useState('');
  const [items, setItems] = useState([]);


  // Handle form submission
  const handleSubmit = e => {
    e.preventDefault();
    // TODO: add an li with inputContext and a delete button to the right
    const values = [...items];
    setItems(values.concat(inputContent));
  };

  // Handle text input changes
  const handleChange = e => {
    setInputContent(e.target.value);
  };

  // Delete item
  const deleteItem = e => {
    const itemList = items.filter(item => item !== e);
    setItems(itemList);
  };

  return (
    <div className='container-edit'>
      <h1 className='h1'>{listName}</h1>
      <InputForm
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        inputContent={inputContent} />
      <ul>
        {items.map((e, i) => <Item key={'item-' + i} content={e} deleteItem={() => deleteItem(e)} />)}
      </ul>
    </div>
  );
};

export default EditList;