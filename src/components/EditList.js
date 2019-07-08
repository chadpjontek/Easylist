import React, { useEffect, useState } from 'react';
import uuid from 'uuid/v1';
import { useStateValue } from '../hooks/stateManager';
import del from '../images/delete.svg';

// The input form
const InputForm = (props) => {
  const { addItem, handleChange, inputContent } = props;
  return (
    <form onSubmit={addItem}>
      <input id='input' type='text' required onChange={handleChange} value={inputContent} />
      <span className='bar'></span>
      <label htmlFor='input'>Add item</label>
    </form>
  );
};

// Item
const Item = (props) => {
  const { item, deleteItem } = props;
  console.log(props);
  // Calculate the available screen space to add item
  const screenSpace = window.innerWidth - 80;
  // Create regex to determine where to split string into array
  const re = new RegExp(`.{1,${Math.floor(screenSpace / 9.24)}}`, 'g');
  // Split the string into an array
  const lines = item.content.match(re);
  return (
    <div>
      {lines.map((line) => <li key={uuid()} className="item">{line}</li>)}
      <button onClick={() => deleteItem(item.id)} className='btn-del'><img src={del} alt="delete" /></button>
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


  // Add item to list
  const addItem = e => {
    e.preventDefault();
    setItems([...items, { id: uuid(), content: inputContent }]);
  };

  // Handle text input changes
  const handleChange = e => {
    setInputContent(e.target.value);
  };

  // Delete item
  const deleteItem = id => {
    const itemList = items.filter(item => item.id !== id);
    setItems(itemList);
  };

  return (
    <div className='container-edit'>
      <h1 className='h1'>{listName}</h1>
      <InputForm
        addItem={addItem}
        handleChange={handleChange}
        inputContent={inputContent} />
      <ul>
        {items.map((item) => <Item key={item.id} item={item} deleteItem={() => deleteItem(item.id)} />)}
      </ul>
    </div>
  );
};

export default EditList;