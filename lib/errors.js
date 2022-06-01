/**
 *
 * @param {String} type
 * @return {object}
 */
function generateError(type) {
  switch (type) {
    case 'null':
      return {
        status: 'error',
        message: 'no such record',
      };
    
  }
}



module.exports = {
  generateError,
};
