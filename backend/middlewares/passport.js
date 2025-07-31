const { ExtractJwt, Strategy } = require("passport-jwt");
const UserModel = require("../models/userModel.js");

const jwtopts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

const jwtVerify = async (payload, done) => {
  try {
    const user = await UserModel.findById(payload._id);
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (err) {
    console.log("JWT Verify Error: ", err);
    return done(err);
  }
};

const jwtStrategy = new Strategy(jwtopts, jwtVerify);

module.exports = jwtStrategy;
