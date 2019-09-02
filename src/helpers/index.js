/**
 * Function to sanitize an input of possible malicious code
 * @param {string} input - Input string to be sanitized
 */
const cleanInput = (input) => input.replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ListName regex
const listNameRe = /^\S.{0,23}$/;
/**
 * Returns true if a valid list name
 * @param {string} listName - List name to be validated
 */
const validateListName = (listName) => listNameRe.test(listName);

export {
  cleanInput,
  validateListName
};