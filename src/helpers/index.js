// Prevent HTML and script injections on client
const cleanInput = (input) => input.replace(/</g, '&lt;').replace(/>/g, '&gt;');

module.exports = {
  cleanInput
};