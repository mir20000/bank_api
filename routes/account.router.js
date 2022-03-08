const express = require("express");
const router = express.Router();

import {
  CreateAccount,
  GetBalance,
  setAccountBalance,
  getAccountStatus,
  setAccountStatus,
} from "../controllers/account.controller";

router.route("/").post(CreateAccount);
router.route("/account_balence/:id").get(GetBalance).post(setAccountBalance);

router
  .route("/account_status/:id")
  .get(getAccountStatus)
  .post(setAccountStatus);
