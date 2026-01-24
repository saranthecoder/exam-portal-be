const ExamUser = require("../model/ExamUser");
const { sendMail } = require("../utils/sendMail");
const { swcetRegistrationMail } = require("../utils/emailTemplates");

const createExamUser = async (req, res) => {
    try {
        const { name, dob, phone, email, examDate } = req.body;

        if (!name || !dob || !email || !examDate) {
            return res.status(400).json({
                message: "Name, DOB, Email and Exam Date are required"
            });
        }

        // Generate Application Number
        const fullYear = new Date().getFullYear();
        const year = fullYear.toString().slice(-2);
        const prefix = `SWCET${year}`;

        const lastUser = await ExamUser.findOne({
            applicationNumber: { $regex: `^${prefix}` }
        }).sort({ applicationNumber: -1 });

        let nextCount = 1;

        if (lastUser) {
            const lastNumber = lastUser.applicationNumber.slice(-4);
            nextCount = parseInt(lastNumber) + 1;
        }

        const paddedCount = nextCount.toString().padStart(4, "0");
        const applicationNumber = `${prefix}${paddedCount}`;

        // Create User
        const user = await ExamUser.create({
            applicationNumber,
            name,
            dob,
            phone,
            email,
            examTiming: {
                examDate
            }
        });

        const formattedDate = new Date(examDate).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            dateStyle: "full",
            timeStyle: "short"
        });

        const examLink = "https://swcet.saredufywpa.in/";

        const subject = "SWCET Examination Registration Confirmation";

        const html = swcetRegistrationMail(
            name,
            applicationNumber,
            formattedDate,
            examLink
        );

        await sendMail(email, subject, null, html);

        res.status(201).json({
            message: "User created and email sent successfully",
            user
        });

    } catch (error) {
        console.error("Error:", error.response?.body || error.message);
        res.status(500).json({ message: "Something went wrong" });
    }
};




/*
  @desc    Get User by Application Number
  @route   GET /api/exam-users/:applicationNumber
*/
const getExamUser = async (req, res) => {
    try {
        const user = await ExamUser.findOne({
            applicationNumber: req.params.applicationNumber
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/*
  @desc    Update Stats
  @route   PUT /api/exam-users/:applicationNumber/stats
*/
const updateStats = async (req, res) => {
    try {
        const user = await ExamUser.findOne({
            applicationNumber: req.params.applicationNumber
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.stats = { ...user.stats._doc, ...req.body };
        await user.save();

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/*
  @desc    Update Live Indicator
  @route   PUT /api/exam-users/:applicationNumber/live
*/
const updateLiveIndicator = async (req, res) => {
    try {
        const user = await ExamUser.findOne({
            applicationNumber: req.params.applicationNumber
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.liveIndicator = { ...user.liveIndicator._doc, ...req.body };

        // Auto Termination Logic
        if (user.liveIndicator.warningCount >= 5) {
            user.terminated = true;
        }

        await user.save();

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/*
  @desc    Submit Exam
  @route   PUT /api/exam-users/:applicationNumber/submit
*/
const submitExam = async (req, res) => {
    try {
        const user = await ExamUser.findOne({
            applicationNumber: req.params.applicationNumber
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.isSubmitted = true;
        await user.save();

        res.json({ message: "Exam submitted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/*
  @desc    Set Final Marks
  @route   PUT /api/exam-users/:applicationNumber/result
*/
const setFinalMarks = async (req, res) => {
    try {
        const { finalMarks } = req.body;

        const user = await ExamUser.findOne({
            applicationNumber: req.params.applicationNumber
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.finalMarks = finalMarks;
        await user.save();

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createExamUser,
    getExamUser,
    updateStats,
    updateLiveIndicator,
    submitExam,
    setFinalMarks
};
