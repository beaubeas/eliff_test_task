const UserModel = require("../models/userModel.js");
const passport = require("passport");

const auth = async (req, res, next) => {
  try {
    passport.authenticate("jwt", (err, user, info) => {
      if (err) {
        return res.status(401).send({ message: "Unauthorized" });
      }

      if (!user) {
        return res.status(401).send({ message: "Unauthorized" });
      }

      req.user = user;
      next();
    })(req, res, next);
  } catch (err) {
    console.log("Authentication Error: ", err);
    res.status(401).send({
      message: "Error in authentication middleware",
    });
  }
};

// Admin Access
const isAdmin = async (req, res, next) => {
  try {
    passport.authenticate("jwt", (err, user, info) => {
      if (err) {
        return res.status(401).send({ message: "Unauthorized" });
      }

      if (!user) {
        return res.status(401).send({ message: "Unauthorized" });
      }

      if (user.role !== 1) {
        return res.status(403).send({
          message: "Access denied. Admin role required.",
        });
      }
      req.user = user;
      next();
    })(req, res, next);
  } catch (err) {
    console.log("Admin Error: ", err);
    res.status(401).send({
      message: "Error in admin middleware",
    });
  }
};

module.exports = {
  auth,
  isAdmin,
};
