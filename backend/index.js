require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");

const jwtStrategy = require("./middlewares/passport.js");
const connectDB = require("./config/db.js");

const routes = require("./route.js");

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use("/uploads", express.static("uploads"));

app.use(passport.initialize());
passport.use(jwtStrategy);

// Routes
app.use("/api", routes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
