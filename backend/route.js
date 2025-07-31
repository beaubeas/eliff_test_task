const express = require("express");
const {
  registerValidator,
  loginValidator,
  caseRegisterValidator,
  caseOppositeStatusUpdateValidator,
  caseVerfiedStatusUpdateValidator,
  caseStatusUpdateValidator,
} = require("./middlewares/validationMiddleware.js");
const { auth, isAdmin } = require("./middlewares/authMiddleware.js");
const {
  uploadUserPhoto,
  uploadCaseProof,
} = require("./middlewares/uploadMiddleware.js");
const { register, login } = require("./controllers/userController.js");
const {
  caseRegister,
  updateCaseVerificationStatus,
  updateOppositeStatus,
  updateCaseStatus,
  fetchAllCases,
  fetchCaseByUserId,
} = require("./controllers/caseController.js");

const router = express.Router();

/**
 * User management
 */
router.post("/register", uploadUserPhoto, register);
router.post("/login", loginValidator, login);

/**
 * Case management
 */
router.post("/case/register", auth, uploadCaseProof, caseRegister);
router.post(
  "/case/update/verified",
  isAdmin,
  caseVerfiedStatusUpdateValidator,
  updateCaseVerificationStatus
);
router.post(
  "/case/update/opposite",
  isAdmin,
  caseOppositeStatusUpdateValidator,
  updateOppositeStatus
);
router.post(
  "/case/update/status",
  isAdmin,
  caseStatusUpdateValidator,
  updateCaseStatus
);
router.get("/cases/all", isAdmin, fetchAllCases);
router.post("/cases/user", auth, fetchCaseByUserId);

module.exports = router;
