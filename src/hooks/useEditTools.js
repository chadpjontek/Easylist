import { useState } from 'react';

const useEditTools = () => {
  const [name, setName] = useState('');
  const [items, setItems] = useState([]);

  return {
    name,
    items,
    setName,
    setItems
  };
};

export default useEditTools;