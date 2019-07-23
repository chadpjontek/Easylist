import { openDB } from 'idb';

const idbPromise = openDB('easylist', 1, {
  upgrade(db) {
    db.createObjectStore('lists', {
      keyPath: 'name'
    });
  }
});

/**
 * Returns a promise that adds a list to indexedDB
 * @param {string} list - The list to be added
 */
const addListPromise = async (list) => (await idbPromise).add('lists', list);

/**
 * Returns a promise that deletes a list from indexedDB
 * @param {string} list - The list to be deleted
 */
const deleteListPromise = async (list) => (await idbPromise).delete('lists', list);

/**
 * Returns a promise that updates a list in indexedDB
 * @param {string} list - The list to be updated
 */
const updateListPromise = async (list) => {
  (await idbPromise).put('lists', list);
};

export {
  addListPromise,
  deleteListPromise,
  updateListPromise
};