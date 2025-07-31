const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  caseType: {
    type: Number, // 0: Family, 1: Business, 2: Criminal
    required: true
  },
  description: {
    type: String,
    required: true
  },
  oppositePartyName: {
    type: String,
    required: true
  },
  oppositePartyContact: {
    type: String,
    required: true
  },
  oppositePartyAddress: {
    type: String,
    required: true
  },
  proofUri: {
    type: String,
    required: true
  },
  issuePendingStatus: {
    type: String,
    required: true
  },
  verifiedByAdmin: {
    type: Boolean,
    default: false
  },
  oppositeStatus: {
    type: Number, // 0: not started, 1: awaiting response, 2: accepted
    required: true,
    default: 0
  },
  caseStatus: {
    type: Number, // 0: not stated, 1: Panel created, 2: Mediation in Progress, 3: Resolved, 4: Unresolved
    required: true,
    default: 0
  }
}, {
  timestamps: true, // Enable timestamps
})
module.exports = mongoose.model("Case", caseSchema);
