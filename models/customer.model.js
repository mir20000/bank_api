const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const autoIdGenerator = require("../middlewares/autoIdGenerator");

const CustomerSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true },
    contactNo: { type: String, required: true },
    password: { type: String, required: true },
    CIF_No: { type: String },
    isActive: { type: String },
    createdAt: { type: Date },
  },
  { timestamps: true }
);
CustomerSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(Number(process.env.SECRET_KEY));
  this.password = await bcrypt.hash(this.password, salt);
  this.CIF_No = await autoIdGenerator();
});

CustomerSchema.pre("updateOne", async function () {
  //src = https://stackoverflow.com/questions/67390900/mongoose-pre-update-hook-working-but-changes-arent-reflected-in-database
  const data = this._update["$set"];
  const salt = await bcrypt.genSalt(Number(process.env.SECRET_KEY));
  data.password = await bcrypt.hash(data.password, salt);
});

CustomerSchema.methods.createJWT = async function () {
  return jwt.sign(
    { userId: this._id, name: this.name, user_type: "customer" },
    process.env.EncKey,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

CustomerSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("Customer", CustomerSchema);
