import { openDB } from 'idb';

// ===========
// IDB SECTION
// ===========

const idbPromise = openDB('easylist', 1, {
  upgrade(db) {
    db.createObjectStore('lists', {
      keyPath: '_id'
    });

    db.createObjectStore('queue', {
      autoIncrement: true
    });
  }
});

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
 * Returns a promise that adds an item to a queue
 * @param {object} item - The item to be queued
 */
const addToQueue = async (item) => (await idbPromise).add('queue', item);


// =======================
// MONGODB REQUEST SECTION
// =======================

/**
* Adds a list to MongoDB and returns the newly created list
* @param {object} list - The list to be added
*/
const createExternalList = async (list) => {
  try {
    // grab jwt for user auth
    const token = localStorage.getItem('jwt');
    // If the user is offline or doesn't have a token just exit function
    if (!window.navigator.onLine || !token) {
      return;
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
  const { _id, name, html, backgroundColor, notificationsOn, isPrivate, updatedAt } = list;
  // get the jwt for auth
  const token = localStorage.getItem('jwt');
  // If the user is offline or doesn't have a token just exit function
  if (!window.navigator.onLine || !token) {
    return false;
  }
  try {
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
  // get the jwt for auth
  const token = localStorage.getItem('jwt');
  // If the user is offline or doesn't have a token just exit function
  if (!window.navigator.onLine || !token) {
    return false;
  }
  try {
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
  // get the jwt for auth
  const token = localStorage.getItem('jwt');
  // If the user is offline or doesn't have a token just exit function
  if (!window.navigator.onLine || !token) {
    return false;
  }
  try {
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
    if (json.msg) {
      // successful save
      return json.msg;
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
    // grab jwt for user auth
    const token = localStorage.getItem('jwt');
    // If the user is offline or doesn't have a token just exit function
    if (!window.navigator.onLine || !token) {
      return;
    }
    const response = await fetch(`http://localhost:3000/api/lists/${id}/copy`, {
      body: JSON.stringify({ _id: id }),
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

const postQueue = async (id) => {
  let updatedId;
  try {
    // Open a IDB cursor and add the queue store into a temporary lists array
    let lists = [];
    let cursor = await (await idbPromise).transaction('queue').store.openCursor();
    if (!cursor) {
      // queue is empty so return true
      return true;
    }
    while (cursor) {
      lists.push(cursor.value);
      cursor = await cursor.continue();
    }

    // Check the temp arr for delete actions. For each delete action, get the id of the list to be
    // deleted, then delete all other items in temp arr with that id. Then DELETE it.
    const deleteActions = lists.filter(list => list.action === 'delete');
    for (const action of deleteActions) {
      lists = lists.filter(list => list._id !== action._id);
      // check with regex if the delete reqest is a local id - ignore if it is
      if (!/-/.test(action._id)) {
        const result = await deleteExternalList(action._id);
        if (!result) {
          return false;
        }
      }
    }

    // Check the temp arr for create actions. For each create action, check if there are any lists
    // with the same id. If there are, find the one with the most recent update and POST it. Then
    // remove all those from temp arr.
    const createActions = lists.filter(list => list.action === 'create');

    for (const action of createActions) {
      const sameId = lists.filter(list => list._id === action._id);
      if (sameId > 0) {
        const mostRecent = sameId.reduce((acc, cur) => {
          if (cur._id > acc._id) {
            return cur;
          }
        });

        const { name, html, backgroundColor, notificationsOn, isPrivate, updatedAt } = mostRecent;
        const listToCreate = { name, html, backgroundColor, notificationsOn, isPrivate, updatedAt };
        const result = await createExternalList(listToCreate);
        if (!result) {
          return false;
        }
        if (action._id === id) {
          updatedId = result._id;
        }
        lists = lists.filter(list => list._id !== mostRecent._id);
      } else {
        const { name, html, backgroundColor, notificationsOn, isPrivate, updatedAt } = action;
        const listToCreate = { name, html, backgroundColor, notificationsOn, isPrivate, updatedAt };
        const result = await createExternalList(listToCreate);
        if (!result) {
          return false;
        }
        lists = lists.filter(list => list._id !== action._id);
      }
    }

    // Check the temp arr for update actions. For each update action, find the most recent update
    // for that id and PUT it. Remove the others from the temp arr.
    const updateActions = lists.filter(list => list.action === 'update');
    for (const action of updateActions) {
      const sameId = lists.filter(list => list._id === action._id);
      if (sameId > 0) {
        const mostRecent = sameId.reduce((acc, cur) => {
          if (cur.updatedAt > acc.updatedAt) {
            return cur;
          }
        });
        const { _id, name, html, backgroundColor, notificationsOn, isPrivate, updatedAt } = mostRecent;
        const listToUpdate = { _id, name, html, backgroundColor, notificationsOn, isPrivate, updatedAt };
        const result = await updateExternalList(listToUpdate);
        if (!result) {
          return false;
        }
        lists = lists.filter(list => list._id !== mostRecent._id);
      }
    }

    // Delete all items in the queue
    cursor = await (await idbPromise).transaction('queue', 'readwrite').store.openCursor();
    while (cursor) {
      console.log(`removing ${cursor.key} from queue`);
      await cursor.delete();
      cursor = await cursor.continue();
    }

    // queue has been posted and all items removed so return the updated id of the calling
    return updatedId || true;

  } catch (error) {
    console.log(error);
    // something went wrong so return false
    return false;
  }
};

export {
  addListPromise,
  getListPromise,
  getListsPromise,
  deleteListPromise,
  updateListPromise,
  addToQueue,
  createExternalList,
  updateExternalList,
  deleteExternalList,
  shareExternalList,
  getSharedList,
  postQueue
};