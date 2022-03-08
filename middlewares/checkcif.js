const Customer = require("../models/customer.model");

const checkCIF = async (cifno) => {
  const validCif = await Customer.findOne({ CIF_No: cifno });

  if (!validCif) {
    return false;
  }
};

module.exports = checkCIF;
