const mongoose = require("mongoose");

let AccountSchema = mongoose.Schema(
  {
    CIF_No: { type: String, required: true },

    accountNumber: { type: String, required: true },

    IFSC: { type: String },

    accountBalance: { type: Number, required: true },

    accoutType: { type: String },

    createdAt: { type: Date },
  },
  { timestamp: true }
);

module.exports = mongoose.model("account", AccountSchema);
