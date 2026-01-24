const express = require("express");
const router = express.Router();

const {
  createExamUser,
  getExamUser,
  updateStats,
  updateLiveIndicator,
  submitExam,
  setFinalMarks
} = require("../controller/examUserController");

router.post("/", createExamUser);
router.get("/:applicationNumber", getExamUser);
router.put("/:applicationNumber/stats", updateStats);
router.put("/:applicationNumber/live", updateLiveIndicator);
router.put("/:applicationNumber/submit", submitExam);
router.put("/:applicationNumber/result", setFinalMarks);

module.exports = router;
