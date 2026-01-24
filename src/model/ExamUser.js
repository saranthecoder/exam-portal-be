const mongoose = require("mongoose");

const statsSchema = new mongoose.Schema({
  total: { type: Number, default: 0 },
  answered: { type: Number, default: 0 },
  notAnswered: { type: Number, default: 0 },
  marked: { type: Number, default: 0 },
  notVisited: { type: Number, default: 0 }
}, { _id: false });

const liveIndicatorSchema = new mongoose.Schema({
  warningCount: { type: Number, default: 0 },
  tabSwitchCount: { type: Number, default: 0 },
  faceOffCount: { type: Number, default: 0 },
  noiseDetectedCount: { type: Number, default: 0 }
}, { _id: false });

const examTimingSchema = new mongoose.Schema({
  examDate: {
    type: Date,          // Date of the exam (e.g., 2026-01-28)
    required: true
  },
  startTime: {
    type: Date,          // When candidate actually starts exam
    default: null
  },
  submittedAt: {
    type: Date,          // When candidate submits exam
    default: null
  }
}, { _id: false });

const examUserSchema = new mongoose.Schema({

  applicationNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  name: { type: String, required: true },
  dob: { type: Date, required: true },
  phone: { type: String, default: null },
  email: { type: String, default: null },

  isSubmitted: { type: Boolean, default: false },
  terminated: { type: Boolean, default: false },

  stats: { type: statsSchema, default: () => ({}) },
  liveIndicator: { type: liveIndicatorSchema, default: () => ({}) },

  examTiming: {
    type: examTimingSchema,
    required: true
  },

  finalMarks: { type: Number, default: null }

}, { timestamps: true });

module.exports = mongoose.model("ExamUser", examUserSchema);
