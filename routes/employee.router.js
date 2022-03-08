const express = require("express");
const router = express.Router();

const {
  GetAllEmployees,
  EmployeeLogin,
  GetEmployeeById,
  UpdateEmployeeById,
  BlockCustomerById,
} = require("../controllers/employee.controller");

router.route("/").get(GetAllEmployees);

router.route("/signin").post(EmployeeLogin);

router.route("/:id").get(GetEmployeeById).patch(UpdateEmployeeById);

router.route("/block/customer/:id").patch(BlockCustomerById);

module.exports = router;
