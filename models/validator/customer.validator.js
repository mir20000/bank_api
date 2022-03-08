const Joi = require("joi");

const authScheme = Joi.object({
  name: Joi.string().pattern(new RegExp("^[a-zA-Z_ ]{3,30}$")),
  email: Joi.string().trim().lowercase().email(),
  contactNo: Joi.string().pattern(/[6-9]{1}[0-9]{9}/),
  password: Joi.string(),
  CIF_No: Joi.string().alphanum(),
  isActive: Joi.string()
    .valid("active", "deactive", "blocked", "notVarified")
    .default("notVarified"),
  createdAt: Joi.date().default(Date.now()),
});

module.exports = authScheme;
