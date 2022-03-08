const Customer = require("../models/customer.model");

const { checkId, checkCIF, checkEmail, checkPhone } = require("../middlewares");

const customerAuthScheme = require("../models/validator/customer.validator");

const accountModel = require("../models/account.model");
const {
  CustomAPIError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
} = require("../error");
const { StatusCodes } = require("http-status-codes");

const GetAllCustomer = async (req, res) => {
  const customers = await Customer.find({}).sort("-createdAt");
  if (customers.length === 0) {
    throw new NotFoundError(`No Data Found`);
  }
  res.status(StatusCodes.OK).json({
    success: true,
    count: customers.length,
    customers: customers,
  });
};

const CustomerRegistration = async (req, res) => {
  const {
    body: {
      name: name,
      email: email,
      contactNo: contactNo,
      password: password,
    },
  } = req;

  if (password === "" || email === "") {
    //alias
    throw new BadRequestError("Please Provide Email and password");
  }

  if (await checkEmail(email)) {
    throw new BadRequestError("email is already exist");
  }

  if (await checkPhone(contactNo)) {
    throw new BadRequestError("contactNo is already exist");
  }

  let isCreated = false;
  let resposnseData = {};

  try {
    const validUser = await customerAuthScheme.validateAsync({
      name: name,
      email: email,
      contactNo: contactNo,
      password: password,
    });
    const customers = await Customer.create(validUser);
    if (!customers) {
      throw new NotFoundError(`No Customer Found`);
    } else {
      isCreated = true;
      resposnseData = customers;
    }
  } catch (error) {
    throw new BadRequestError(error);
  }

  res
    .status(isCreated ? StatusCodes.CREATED : StatusCodes.NOT_ACCEPTABLE)
    .json({
      success: isCreated,
      message: `Customer Inserted with id: ${resposnseData._id} `,
      customers: resposnseData,
    });
};

const CustomerLogin = async (req, res) => {
  const {
    body: { email: email, password: password },
  } = req;
  if (password === "" || email === "") {
    throw new BadRequestError("Please Provide proper Cred");
  }
  const customers = await Customer.findOne({ email: email });
  if (!customers) {
    throw new UnauthenticatedError("User dose not Exist");
  }
  const isPasswordCorrect = await customers.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Password");
  }
  const token = await customers.createJWT();

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Sucessfully login",
    customers: customers,
    token: token,
  });
};

const UpdateCustomerById = async (req, res) => {
  const {
    params: { id: custId },
    body: { name: name, contactNo: contactNo },
  } = req;

  if (!checkId(custId)) {
    throw new BadRequestError("Please Provide valid Id");
  }

  if (name === "" || contactNo === "") {
    throw new BadRequestError("Please Provide proper Cred");
  }

  let isUpdated = false;
  let responseData = {};

  try {
    const result = await customerAuthScheme.validateAsync({
      name: name,
      contactNo: contactNo,
    });

    const customers = await Customer.findOneAndUpdate({ _id: custId }, result, {
      new: true,
      runValidators: true,
    });

    isUpdated = true;
    responseData = customers;
  } catch (error) {
    throw new BadRequestError(error);
  }

  res
    .status(isUpdated ? StatusCodes.CREATED : StatusCodes.NOT_ACCEPTABLE)
    .json({
      success: isUpdated,
      message: `Customer Updated with id: ${responseData._id} `,
      customer: responseData,
    });
};

const GetCustomerById = async (req, res, next) => {
  const { id: custId } = req.params;
  const customers = await Customer.findById(custId);
  if (!customers) {
    throw new NotFoundError(`No Customer Found`);
  }
  res.status(StatusCodes.OK).json({
    success: true,
    message: `Customer find with id ${customers._id}`,
    customers: customers,
  });
};

const DeleteCustomerById = async (req, res) => {
  const { id: custId } = req.params;

  if (!checkId(custId)) {
    throw new BadRequestError("Please Provide valid Id");
  }

  const customers = await Customer.findOneAndUpdate(
    { _id: custId },
    { isActive: "deactive" },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!customers) {
    throw new NotFoundError(`No Customer Found`);
  }

  res.status(StatusCodes.ACCEPTED).json({
    success: true,
    message: `Customer Deleted with ${custId}`,
    customers: customers,
  });
};

const CustomerPasswordChange = async (req, res) => {
  const {
    params: { id: custId },
    body: { oldPassword: oldPassword, password: password },
  } = req;

  if (oldPassword === "" || password === "") {
    throw new BadRequestError("Please Provide proper Cred");
  }

  const customerInfo = await Customer.findById(custId);

  if (!customerInfo || customerInfo.length <= 0) {
    throw new NotFoundError("Please Provide valid Customer ID");
  } else {
    const isPasswordCorrect = await customerInfo.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError("Invalid Password");
    }
  }

  let isUpdated = false;
  let responseData = {};

  try {
    const customers = await Customer.updateOne(
      { _id: custId },
      { $set: { password: password } }
    );
    isUpdated = true;
    responseData = customers;
  } catch (error) {
    throw new BadRequestError(error);
  }

  if (!responseData || responseData.length <= 0) {
    throw new NotFoundError(`No Customer Found`);
  }
  res
    .status(isUpdated ? StatusCodes.ACCEPTED : StatusCodes.NOT_ACCEPTABLE)
    .json({
      success: true,
      message: `Customers Password Updated with id: ${
        isUpdated ? custId : "Not has been changed"
      } `,
      customers: responseData,
    });
};

module.exports = {
  GetAllCustomer,
  CustomerRegistration,
  CustomerLogin,
  UpdateCustomerById,
  GetCustomerById,
  DeleteCustomerById,
  CustomerPasswordChange,
};
