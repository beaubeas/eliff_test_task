const validator = require("../utils/validator");
const { isValidPhoneNumber } = require("libphonenumber-js");

const registerValidator = async (req, res, next) => {
  // Skip validation if this is a file upload (multipart/form-data)
  // The validation will be handled after file upload middleware
  if (
    req.headers["content-type"] &&
    req.headers["content-type"].includes("multipart/form-data")
  ) {
    return next();
  }

  const validationRule = {
    email: "required|string|email",
    userName: "required|string",
    age: "required|min:18|max:150",
    gender: "required|string",
    street: "required|string",
    city: "required|string",
    zipCode: "required|string",
    phoneNumber: "required|string",
    password: "required|string|confirmed|password",
    password_confirmation: "required|string",
  };

  await validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        message: "Input validation failed",
        data: err,
      });
    } else {
      // Validate Phone number
      if (isValidPhoneNumber(req.body.phoneNumber)) next();
      else
        res.status(412).send({
          message: "Input validation failed",
          data: "Phone Number Invalid",
        });
    }
  }).catch((err) => console.log(err));
};

const loginValidator = async (req, res, next) => {
  const validationRule = {
    email: "required|string",
    password: "required|string|password",
  };

  await validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        message: "Input validation failed",
        data: err,
      });
    } else {
      next();
    }
  }).catch((err) => console.log(err));
};

const caseRegisterValidator = async (req, res, next) => {
  // Skip validation if this is a file upload (multipart/form-data)
  // The validation will be handled after file upload middleware
  if (
    req.headers["content-type"] &&
    req.headers["content-type"].includes("multipart/form-data")
  ) {
    return next();
  }

  const validationRule = {
    userId: "required|string",
    caseType: "required|string",
    description: "required|string",
    oppositePartyName: "required|string",
    oppositePartyContact: "required|string",
    oppositePartyAddress: "required|string",
    issuePendingStatus: "required|string",
  };

  await validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        message: "Input validation failed",
        data: err,
      });
    } else {
      next();
    }
  }).catch((err) => console.log(err));
};

const caseVerfiedStatusUpdateValidator = async (req, res, next) => {
  const validationRule = {
    id: "required|string",
    verified: "required|boolean",
  };

  await validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        message: "Input validation failed",
        data: err,
      });
    } else {
      next();
    }
  }).catch((err) => console.log(err));
};

const caseOppositeStatusUpdateValidator = async (req, res, next) => {
  const validationRule = {
    id: "required|string",
    oppositeStatus: "required|integer|min:0|max:2",
  };

  await validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        message: "Input validation failed",
        data: err,
      });
    } else {
      next();
    }
  }).catch((err) => console.log(err));
};

const caseStatusUpdateValidator = async (req, res, next) => {
  const validationRule = {
    id: "required|string",
    caseStatus: "required|integer|min:0|max:4",
  };

  await validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        message: "Input validation failed",
        data: err,
      });
    } else {
      next();
    }
  }).catch((err) => console.log(err));
};
module.exports = {
  registerValidator,
  loginValidator,
  caseRegisterValidator,
  caseOppositeStatusUpdateValidator,
  caseVerfiedStatusUpdateValidator,
  caseStatusUpdateValidator,
};
