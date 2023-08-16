const filterTours = (req, res, next) => {
  const filterOptions = req.query || {};

  const filterObject = {
    price: {},
  };

  const optionMappings = {
    minPrice(value) {
      filterObject.price.$gte = value;
    },
    maxPrice(value) {
      filterObject.price.$lte = value;
    },
  };

  Object.keys(filterOptions).forEach(key => {
    if (Object.prototype.hasOwnProperty.call(optionMappings, key)) {
      optionMappings[key](filterOptions[key]);
    }
  });

  req.tourFilter = filterObject;
  next();
};

export default filterTours;
