const Validator = require("validatorjs");
const validator = async (body, rules, customMessages, callback) => {
  const validation = new Validator(body, rules, customMessages);

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W])[a-zA-Z\d\W]{8,}$/;

  Validator.register(
    "password",
    (value) => passwordRegex.test(value),
    "Password must be at least 8 characters long, include one uppercase, one lowercase, one number, and one special character"
  );

  validation.passes(() => callback(null, true));
  validation.fails(() => callback(validation.errors, false));
};

module.exports = validator;
