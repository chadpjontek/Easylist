import { openDB } from 'idb';

const idbPromise = openDB('easylist', 1, {
  upgrade(db) {
    db.createObjectStore('lists', {
      keyPath: 'id',
      autoIncrement: true
    });
  }
});

/**
 * Returns a promise that adds a list to indexedDB
 * @param {string} listName - The name of the list to be added
 */
const addListPromise = async (name) => (await idbPromise).add('lists', { name });

export {
  addListPromise
};