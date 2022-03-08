const Employee = require("../models/employee.model");
const Customer = require("../models/customer.model");
const Account = require("../models/account.model");
const CheckCIF = require("../middlewares/checkcif");
const accountAuthScheme = require("../models/validator/account.validator");

const {
  CustomAPIError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
} = require("../error");
const { StatusCodes } = require("http-status-codes");

const CreateAccount = async (req, res) => {
  const {
    body: { CIF: CIF, acctype, ammount },
  } = req;

  if (!CheckCIF(CIF)) {
    throw new NotFoundError("Please Provide valid CIF");
  }

  const customer = await Customer.findOne({ CIF_No: CIF });

  if (!customer || customer.length <= 0) {
    throw new NotFoundError(`No Customer Found`);
  }

  //frozen Set
  let result = {};

  try {
    result = await accountAuthScheme.validateAsync(req.body);
  } catch (error) {
    throw new BadRequestError(error);
  }

  const AccountData = {
    CIF_No: CIF,
    accountBalance: ammount,
    accoutType: acctype,
  };

  const account = await Account.create(AccountData);

  if (!account || account.length <= 0) {
    throw new NotFoundError(`No Customer Found`);
  }
  res.status(StatusCodes.OK).json({
    success: true,
    message: `account Updated with id: ${account._id} `,
    account: account,
  });
};

const GetBalance = async (req, res) => {
  const {
    body: { id: customer_id },
  } = req;

  if (!CheckId(customer_id)) {
    throw new BadRequestError("Please Provide valid Id");
  }

  const customerData = await Customer.findById({ _id: customer_id }).select({
    name: true,
    accBalance: true,
    isActive: true,
  });

  if (!customerData || customerData.length <= 0) {
    throw new NotFoundError(`No Customer Found`);
  }

  return res.status(StatusCodes.OK).json({
    success: true,
    message: "Ammount fatched",
    customer_data: customerData,
  });
};

const setAccountBalance = async (req, res) => {
  const { id: customer_id } = req.params;
  const { amount } = req.body;
  const employee = await Employee.findOne({ _id: employee_id });
  if (!employee || employee.length <= 0) {
    return res.status(200).json({
      success: false,
      message: "Employee Not Matched",
    });
  }

  let result = {};

  try {
    result = await accountAuthScheme.validateAsync(req.body);
  } catch (error) {
    throw new BadRequestError(error);
  }

  const customerData = await Customer.findByIdAndUpdate(
    { _id: customer_id },
    { accBalance: amount },
    {
      new: true,
      runValidators: true,
    }
  );

  return res.status(200).json({
    success: true,
    message: "Ammount fatched",
    customer_data: customerData,
  });
};

const getAccountStatus = async (req, res) => {
  const { id: customer_id } = req.params;

  const customerData = await Customer.findById({ _id: customer_id }).select({
    name: 1,
    isActive: 1,
  });

  return res.status(200).json({
    success: true,
    message: "Status fatched",
    customer_data: customerData,
  });
};

const setAccountStatus = async (req, res) => {
  const { id: customer_id } = req.params;

  const { status } = req.body;
  const employee = await Employee.findOne({ _id: employee_id });

  if (!employee || employee.length <= 0) {
    return res.status(200).json({
      success: false,
      message: "Employee Not Matched",
    });
  }

  let result = {};

  try {
    result = await accountAuthScheme.validateAsync(req.body);
  } catch (error) {
    throw new BadRequestError(error);
  }

  const customerData = await Customer.findByIdAndUpdate(
    { _id: customer_id },
    { isActive: status },
    {
      new: true,
      runValidators: true,
    }
  );

  return res.status(200).json({
    success: true,
    message: "Status fatched",
    customer_data: customerData,
  });
};

module.exports = {
  CreateAccount,
  GetBalance,
  setAccountBalance,
  getAccountStatus,
  setAccountStatus,
};
