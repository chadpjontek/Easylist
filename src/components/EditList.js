import React, { useEffect, useState } from 'react';
import uuid from 'uuid/v1';
import { useStateValue } from '../hooks/stateManager';
import { getListPromise } from '../helpers/dbhelper';
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

  // global state getter/setter
  const [{ items }, dispatch] = useStateValue();

  // local state
  const [inputContent, setInputContent] = useState('');
  const [wasItemAdded, setWasItemAdded] = useState(false);

  // on first load...
  useEffect(() => {
    // ...update title
    document.title = 'Edit list';
    // ...update list name state
    dispatch({
      type: 'updateName',
      name: listName
    });
    // ...fetch item data from IDB
    const fetchData = async () => {
      try {
        const result = await getListPromise(listName);
        // ...update list item state
        dispatch({
          type: 'updateItems',
          items: result.items
        });
      } catch (error) {
        throw new Error(error);
      }
    };
    fetchData();
  }, []);

  // scroll to bottom if new item added
  useEffect(() => {
    if (wasItemAdded) {
      window.scrollTo(0, document.body.scrollHeight);
    }
  }, [items]);


  // Add item to list
  const addItem = e => {
    e.preventDefault();
    dispatch({
      type: 'updateItems',
      items: [...items, { id: uuid(), content: inputContent }]
    });
    setInputContent('');
    setWasItemAdded(true);
  };

  // Handle text input changes
  const handleChange = e => {
    setInputContent(e.target.value);
  };

  // Delete item
  const deleteItem = id => {
    const itemList = items.filter(item => item.id !== id);
    dispatch({
      type: 'updateItems',
      items: itemList
    });
    setWasItemAdded(false);
  };

  return (
    <div className='container-edit'>
      <div className="container-edit__header">
        <h1 className='h1'>{listName}</h1>
        <InputForm
          addItem={addItem}
          handleChange={handleChange}
          inputContent={inputContent} />
      </div>
      <ul id='ul'>
        {items.map((item) => <Item key={item.id} item={item} deleteItem={() => deleteItem(item.id)} />)}
      </ul>
    </div>
  );
};

export default EditList;