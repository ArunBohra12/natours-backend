/* eslint-disable import/prefer-default-export */

/**
 * Filters an object based on the provided filter parameters.
 *
 * @param {Object} object - The object to be filtered.
 * @param {string[]} filterParams - An array of keys to be included in the filtered object.
 * @returns {Object} - A new object containing only the specified keys from the original object.
 */
export const filterObject = (object, filterParams = []) => {
  const filteredObj = {};

  filterParams.forEach(key => {
    filteredObj[key] = object[key];
  });

  return filteredObj;
};
