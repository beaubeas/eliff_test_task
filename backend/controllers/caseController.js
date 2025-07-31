const caseModel = require("../models/caseModel.js");

const caseRegister = async (req, res) => {
  try {
    const {
      userId,
      caseType,
      description,
      oppositePartyName,
      oppositePartyContact,
      oppositePartyAddress,
      issuePendingStatus,
    } = req.body;

    // Validate required fields for file uploads
    if (
      !userId ||
      !caseType ||
      !description ||
      !oppositePartyName ||
      !oppositePartyContact ||
      !oppositePartyAddress ||
      !issuePendingStatus
    ) {
      return res.status(412).send({
        message: "Input validation failed",
        data: "All fields are required",
      });
    }

    // Validate case type
    const caseTypeNum = parseInt(caseType);
    if (isNaN(caseTypeNum) || caseTypeNum < 0 || caseTypeNum > 2) {
      return res.status(412).send({
        message: "Input validation failed",
        data: "Invalid case type",
      });
    }

    // Validate description length
    if (description.length < 50) {
      return res.status(412).send({
        message: "Input validation failed",
        data: "Description must be at least 50 characters",
      });
    }

    // Check if proof document was uploaded
    if (!req.file) {
      return res.status(400).send({
        message: "Proof document is required",
      });
    }

    // Generate proof URL
    const proofUri = `/uploads/cases/${req.file.filename}`;

    await new caseModel({
      userId,
      caseType: caseTypeNum,
      description,
      oppositePartyName,
      oppositePartyAddress,
      oppositePartyContact,
      proofUri,
      issuePendingStatus,
    }).save();

    res.status(200).send({
      message: "Case Registered Successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Error in case registration, please retry",
    });
  }
};

const updateCaseVerificationStatus = async (req, res) => {
  try {
    const existingCase = await caseModel.findById(req.body.id);
    if (!existingCase)
      return res.status(404).send({ message: "Case not found" });

    existingCase.verifiedByAdmin = req.body.verified;
    await existingCase.save();
    res.status(200).send({ message: "Updated case verification status" });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Error in case verification status update, please retry",
    });
  }
};

const updateOppositeStatus = async (req, res) => {
  try {
    const existingCase = await caseModel.findById(req.body.id);
    if (!existingCase)
      return res.status(404).send({ message: "Case not found" });

    existingCase.oppositeStatus = req.body.oppositeStatus;
    await existingCase.save();
    res.status(200).send({ message: "Updated case opposite status" });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Error in opposite status update, please retry",
    });
  }
};

const updateCaseStatus = async (req, res) => {
  try {
    const existingCase = await caseModel.findById(req.body.id);
    if (!existingCase)
      return res.status(404).send({ message: "Case not found" });

    existingCase.caseStatus = req.body.caseStatus;
    await existingCase.save();
    res.status(200).send({ message: "Updated case status" });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Error in case status update, please retry",
    });
  }
};

const fetchAllCases = async (req, res) => {
  try {
    const cases = await caseModel.find().populate("userId");
    return res.status(200).send(cases);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Error in fetching cases, please retry",
    });
  }
};

const fetchCaseByUserId = async (req, res) => {
  try {
    const cases = await caseModel
      .find({ userId: req.body.userId })
      .populate("userId");
    return res.status(200).send(cases);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Error in fetching case, please retry",
    });
  }
};

module.exports = {
  caseRegister,
  updateCaseVerificationStatus,
  updateOppositeStatus,
  updateCaseStatus,
  fetchAllCases,
  fetchCaseByUserId,
};
