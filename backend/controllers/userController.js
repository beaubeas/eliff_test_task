const userModel = require("../models/userModel.js");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const saltRounds = 10;

const register = async (req, res) => {
  try {
    const {
      userName,
      age,
      gender,
      street,
      city,
      zipCode,
      email,
      phoneNumber,
      password,
      password_confirmation,
    } = req.body;

    // Validate required fields for file uploads
    if (
      !userName ||
      !age ||
      !gender ||
      !street ||
      !city ||
      !zipCode ||
      !email ||
      !phoneNumber ||
      !password ||
      !password_confirmation
    ) {
      return res.status(412).send({
        message: "Input validation failed",
        data: "All fields are required",
      });
    }

    // Validate password confirmation
    if (password !== password_confirmation) {
      return res.status(412).send({
        message: "Input validation failed",
        data: "Passwords do not match",
      });
    }

    // Validate age
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 150) {
      return res.status(412).send({
        message: "Input validation failed",
        data: "Age must be between 18 and 150",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(412).send({
        message: "Input validation failed",
        data: "Invalid email format",
      });
    }

    // Validate phone number
    const { isValidPhoneNumber } = require("libphonenumber-js");
    if (!isValidPhoneNumber(phoneNumber)) {
      return res.status(412).send({
        message: "Input validation failed",
        data: "Phone Number Invalid",
      });
    }

    // Validate password strength
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W])[a-zA-Z\d\W]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(412).send({
        message: "Input validation failed",
        data: "Password must include uppercase, lowercase, number, and special character",
      });
    }

    // Check user email
    const existingEmail = await userModel.findOne({ email });
    if (existingEmail) {
      return res.status(400).send({
        message: "This email is already registered",
      });
    }

    // Check if photo was uploaded
    if (!req.file) {
      return res.status(400).send({
        message: "Photo is required",
      });
    }

    // Generate photo URL
    const photoUri = `/uploads/users/${req.file.filename}`;

    // Register User
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Save
    await new userModel({
      userName,
      age: ageNum,
      gender,
      street,
      city,
      zipCode,
      email,
      phoneNumber,
      photoUri,
      password: hashedPassword,
    }).save();

    res.status(200).send({
      message: "User Registered Successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Error in registration, please retry",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).send({
        message: "Invalid Password",
      });
    }

    // Token
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      message: "Login successfully",
      user: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Error in login",
      err,
    });
  }
};

const fetchUsers = async (req, res) => {
  try {
    const users = await userModel.find().sort({ createdAt: -1 });
    return res.status(200).send(users);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Error in fetching users",
      err,
    });
  }
};

const fetchUserById = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);
    return res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Error in fetching users",
      err,
    });
  }
};

module.exports = {
  register,
  login,
  fetchUsers,
  fetchUserById,
};
