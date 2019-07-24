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
 * Returns a promise that gets a list from indexedDB
 * @param {string} list - The name of list to get
 */
const getListPromise = async (name) => (await idbPromise).get('lists', name);

/**
 * Returns a promise that deletes a list from indexedDB
 * @param {string} name - The name of list to be deleted
 */
const deleteListPromise = async (name) => (await idbPromise).delete('lists', name);

/**
 * Returns a promise that updates a list in indexedDB
 * @param {string} list - The list to be updated
 */
const updateListPromise = async (list) => (await idbPromise).put('lists', list);

export {
  addListPromise,
  getListPromise,
  deleteListPromise,
  updateListPromise
};