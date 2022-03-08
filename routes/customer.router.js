const express = require("express");
const router = express.Router();

const {
  GetAllCustomer,
  CustomerRegistration,
  CustomerLogin,
  UpdateCustomerById,
  GetCustomerById,
  DeleteCustomerById,
  CustomerPasswordChange,
} = require("../controllers/customer.controller");

router.route("/").get(GetAllCustomer);

router.route("/signup").post(CustomerRegistration);

router.route("/signin").post(CustomerLogin);

router
  .route("/:id")
  .get(GetCustomerById)
  .patch(UpdateCustomerById)
  .delete(DeleteCustomerById);

router.route("/changePassword/:id/").patch(CustomerPasswordChange);

module.exports = router;
