const filterTours = (req, res, next) => {
  const filterOptions = req.query || {};

  const filterObject = {
    price: {},
    averageRating: {},
    startDates: {},
  };

  const optionMappings = {
    minPrice(value) {
      filterObject.price.$gte = value;
    },
    maxPrice(value) {
      filterObject.price.$lte = value;
    },
    minRating(value) {
      filterObject.averageRating.$gte = value;
    },
    maxRating(value) {
      filterObject.averageRating.$lte = value;
    },
    // Date values should be in format YYYY/MM/DD
    minDate(value) {
      filterObject.startDates.$gte = new Date(value);
    },
    maxDate(value) {
      filterObject.startDates.$lte = new Date(value);
    },
  };

  Object.keys(filterOptions).forEach(key => {
    if (Object.prototype.hasOwnProperty.call(optionMappings, key)) {
      optionMappings[key](filterOptions[key]);
    }
  });

  // Remove filter options that are not present from filterObject
  // This needs to be done, as empty values (eg. averageRating: {}) can cause errors in fetching
  Object.keys(filterObject).forEach(key => {
    if (Object.keys(filterObject[key]).length === 0) {
      delete filterObject[key];
    }
  });

  req.tourFilter = filterObject;
  next();
};

export default filterTours;
