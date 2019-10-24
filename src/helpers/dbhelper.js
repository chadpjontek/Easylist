import { openDB } from 'idb';

// ===========
// IDB SECTION
// ===========

const idbPromise = openDB('easylist', 1, {
  upgrade(db) {
    db.createObjectStore('lists', {
      keyPath: '_id'
    });

    db.createObjectStore('deleteQueue', {
      keyPath: '_id'
    });

    db.createObjectStore('tokens', {
      keyPath: 'createdAt'
    });
  }
});

/**
 * Returns a promise that clears all tokens from the token store
 */
const clearTokens = async () => (await idbPromise).clear('tokens');

/**
 * Returns a promise that clears all ids from the deleteQueue store
 */
const clearQueue = async () => (await idbPromise).clear('deleteQueue');

/**
 * Returns a promise that adds a JWT to the token store
 * @param {object} token - the token object
 */
const addToken = async (token) => (await idbPromise).add('tokens', token);

/**
 * Returns a promise that gets the tokens from the token store
 */
const getTokens = async () => (await idbPromise).getAll('tokens');

/**
 * Returns a promise that gets all lists from indexedDB
 */
const getListsPromise = async () => (await idbPromise).getAll('lists');

/**
 * Returns a promise that gets a list from indexedDB
 * @param {string} _id - The _id of list to get
 */
const getListPromise = async (_id) => (await idbPromise).get('lists', _id);

/**
 * Returns a promise that adds a list to indexedDB
 * @param {string} list - The list to be added
 */
const addListPromise = async (list) => (await idbPromise).add('lists', list);

/**
 * Returns a promise that updates a list in indexedDB
 * @param {string} list - The list to be updated
 */
const updateListPromise = async (list) => (await idbPromise).put('lists', list);

/**
 * Returns a promise that deletes a list from indexedDB
 * @param {string} _id - The _id of list to be deleted
 */
const deleteListPromise = async (_id) => (await idbPromise).delete('lists', _id);

/**
 * Returns a promise that adds a _id to a queue to be deleted
 * @param {object} item - The _id to be queued for deletion
 */
const addToDeleteQueue = async (_id) => (await idbPromise).put('deleteQueue', _id);


// =======================
// MONGODB REQUEST SECTION
// =======================

/**
 * @returns a token or false
 */
const getToken = async () => {
  try {
    // make sure the user is online and has an up to date token
    const tokenArr = await getTokens();
    if (!tokenArr || tokenArr.length < 1) {
      return false;
    }
    if (tokenArr[0] && (Date.now() - tokenArr[0].createdAt) > 86400000) {
      await clearTokens();
      return false;
    }
    if (!window.navigator.onLine) {
      return false;
    }
    return tokenArr[0].token;
  } catch (error) {
    return false;
  }
};

// Get all lists
const getExternalLists = async () => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error('no token');
    }
    const response = await fetch('http://localhost:3000/api/lists', {
      mode: 'cors',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'x-auth-token': token
      },
    });
    // Parse body as json
    const json = await response.json();
    if (json.lists) {
      // return the lists
      return json.lists;
    }
    if (json.error) {
      throw new Error(json.error);
    }
    // If no json returned throw error
    throw new Error('No json error or lists response.');
  } catch (error) {
    throw error;
  }
};

// Get a specific list
const getExternalList = async (id) => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error('no token');
    }
    const response = await fetch(`http://localhost:3000/api/lists/${id}`, {
      mode: 'cors',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'x-auth-token': token
      },
    });
    // Parse body as json
    const json = await response.json();
    if (json.list) {
      // return the list
      return json.list;
    }
    if (json.error) {
      throw new Error(json.error);
    }
    // If no json returned throw error
    throw new Error('No json error or list response.');
  } catch (error) {
    console.log(error);
  }
};


/**
* Adds a list to MongoDB and returns the newly created list
* @param {object} list - The list to be added
*/
const createExternalList = async (list) => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error('no token');
    }
    const response = await fetch('http://localhost:3000/api/lists', {
      body: JSON.stringify(list),
      mode: 'cors',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'x-auth-token': token
      },
    });
    // Parse body as json
    const json = await response.json();
    if (json.list) {
      // return the newly created list
      return json.list;
    }
    if (json.error) {
      throw new Error(json.error);
    }
    // If no json returned throw error
    throw new Error('No json error or list response.');
  } catch (error) {
    console.error(error);
  }
};

/**
   * Attempts to update list to MongoDB and returns a bool
   * @param {object} list - The list to update to MongoDB
   */
const updateExternalList = async (list) => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error('no token');
    }
    const { _id, name, html, backgroundColor, notificationsOn, isPrivate, updatedAt } = list;
    const response = await fetch(`http://localhost:3000/api/lists/${_id}`, {
      body: JSON.stringify({ name, html, backgroundColor, notificationsOn, isPrivate, updatedAt }),
      mode: 'cors',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'x-auth-token': token
      },
    });
    // Parse body as json
    const json = await response.json();
    if (json.msg) {
      // successful save
      return true;
    }
    if (json.error) {
      throw new Error(json.error);
    }
    // If no json returned throw error
    throw new Error('something went wrong');
  } catch (error) {
    console.error(error);
    return false;
  }
};

/**
   * Attempts to delete a list from MongoDB and returns a bool
   * @param {string} _id - The _id of the list to delete from MongoDB
   */
const deleteExternalList = async (_id) => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error('no token');
    }
    // send request to delete list
    const response = await fetch(`http://localhost:3000/api/lists/${_id}`, {
      mode: 'cors',
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'x-auth-token': token
      },
    });
    // Parse body as json
    const json = await response.json();
    if (json.msg) {
      // successful delete
      return true;
    }
    if (json.error) {
      throw new Error(json.error);
    }
    // If no json returned throw error
    throw new Error('something went wrong');
  } catch (error) {
    console.error(error);
    return false;
  }
};

/**
   * Attempts to share a list on MongoDB and returns the response
   * @param {object} list - The _id of the list
   */
const shareExternalList = async (_id) => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error('no token');
    }
    const response = await fetch(`http://localhost:3000/api/lists/${_id}/share`, {
      mode: 'cors',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'x-auth-token': token
      },
    });
    // Parse body as json
    const json = await response.json();
    if (json.msg && json.link) {
      // successful save
      return json;
    }
    if (json.error) {
      throw new Error(json.error);
    }
    // If no json returned throw error
    throw new Error('something went wrong');
  } catch (error) {
    console.error(error);
    return false;
  }
};

/**
 * Get a copy of a shared list
 * @param {string} id - The id of list to get
 */
const getSharedList = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/api/lists/${id}/copy`, {
      mode: 'cors',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
    });
    // Parse body as json
    const json = await response.json();
    if (json.list) {
      // successful copy
      return json.list;
    }
    if (json.error) {
      throw new Error(json.error);
    }
    // If no json returned throw error
    throw new Error('something went wrong');
  } catch (error) {
    console.error(error);
    return false;
  }
};

/**
 * Delete the queue of lists from Mongo
 * @returns bool
 */
const deleteQueue = async () => {
  try {
    // Open a IDB cursor and delete each list from Mongo by id. Then delete from queue.

    let cursor = await (await idbPromise).transaction('deleteQueue').store.openCursor();
    if (!cursor) {
      // queue is empty so return success
      return true;
    }
    let ids = [];
    while (cursor) {
      ids.push(cursor.value);
      cursor = await cursor.continue();
      // const id = cursor.value._id;
      // const isDeleted = await deleteExternalList(id);
      // if (!isDeleted) throw new Error('Delete failed');
      // await cursor.delete();
      // cursor = await cursor.continue();
    }
    if (ids.length > 0) {
      for (const id of ids) {
        const isDeleted = await deleteExternalList(id._id);
        if (!isDeleted) {
          throw new Error('Could not delete external list');
        }
      }
    }
    await clearQueue();
  } catch (error) {
    console.log(error);
    // something went wrong so return false
    return false;
  }
};

/**
 * Syncs the list data between idb and mongo
 * @param {array} idbLists - the array of lists on the local idb
 * @returns the synced list array
 */
const syncLists = async (idbLists) => {
  try {
    const token = await getToken();
    if (!token) {
      throw Error('no token');
    }
    await deleteQueue();
    // filter the idbLists so the local lists can be added to external DB
    const localLists = idbLists.filter(list => /-/.test(list._id));
    if (localLists.length > 0) {
      // add lists to external DB
      for (const list of localLists) {
        // destructure list so the relevant data can be used to create the external list
        const { updatedAt, name, html, backgroundColor, isPrivate, notificationsOn, isFinished, copiedFrom } = list;
        const listToCreate = { updatedAt, name, html, backgroundColor, isPrivate, notificationsOn, isFinished, copiedFrom };
        // get the newId of the list so it can be updated locally
        const newList = await createExternalList(listToCreate);
        // Update the local list with the newId
        const updatedList = { _id: newList._id, updatedAt, name, html, backgroundColor, isPrivate, notificationsOn, isFinished, copiedFrom };
        await addListPromise(updatedList);
        await deleteListPromise(list._id);
      }
    }
    // Get external lists
    const externalLists = await getExternalLists();
    const updatedExternalLists = Array.from(externalLists);
    // update any lists that are shared between local and external DBs
    const sharedLists = idbLists.filter(list => !/-/.test(list._id));
    if (sharedLists.length > 0) {
      for (const list of sharedLists) {
        // compare external list to local and update both DBs with most recent
        const externalList = externalLists.find(exList => exList._id === list._id);
        if (externalList !== undefined) {
          if (Date.parse(externalList.updatedAt) > list.updatedAt) {
            // Update local db
            await updateListPromise(externalList);
          } else if (Date.parse(externalList.updatedAt) < list.updatedAt) {
            // Update external db
            await updateExternalList(list);
            const foundIndex = updatedExternalLists.findIndex(x => x._id == list._id);
            updatedExternalLists[foundIndex] = list;
          }
        } else {
          // The external list is absent therefore it has been deleted. Delete it locally as well.
          await deleteListPromise(list._id);
        }
      }
    }
    // Add external only lists to IDB
    const updatedLocalLists = await getListsPromise();
    if (updatedExternalLists
      && updatedLocalLists.length > 0
      && updatedExternalLists.length > updatedLocalLists.length) {
      // filter out the local lists from the external
      const externalOnlyLists = updatedExternalLists.filter(({ _id: id1 }) =>
        !updatedLocalLists.some(({ _id: id2 }) => id2 === id1));
      console.log(updatedLocalLists);
      for (const list of externalOnlyLists) {
        console.log(list);
        await addListPromise(list);
      }
    }
    // Return the updated lists
    return updatedExternalLists;
  } catch (error) {
    console.log(error);
  }
};

export {
  addListPromise,
  getListPromise,
  getListsPromise,
  deleteListPromise,
  updateListPromise,
  addToDeleteQueue,
  shareExternalList,
  getSharedList,
  syncLists,
  clearTokens,
  addToken
};