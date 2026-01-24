const express = require("express");
const router = express.Router();

const {
  createExamUser,
  loginExamUser,
  submitExam,
  sendResultsByRange
} = require("../controller/examUserController");

router.post("/", createExamUser);
router.post("/login", loginExamUser);
router.put("/submit/:applicationNumber", submitExam);
router.post("/results/send-range", sendResultsByRange);

module.exports = router;
