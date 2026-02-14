const ExamUser = require("../model/ExamUser");
const { sendMail } = require("../utils/sendMail");
const {
    swcetRegistrationMail,
    examSubmittedMail,
    examResultMail,
    examTerminationMail
} = require("../utils/emailTemplates");

const createExamUser = async (req, res) => {
    try {
        const { name, dob, phone, email, examDate } = req.body;

        if (!name || !dob || !email || !examDate) {
            return res.status(400).json({
                message: "Name, DOB, Email and Exam Date are required"
            });
        }

        /* ================= CHECK DUPLICATE REGISTRATION ================= */
        const existingUser = await ExamUser.findOne({
            email: email,
            "examTiming.examDate": new Date(examDate)
        });

        if (existingUser) {
            return res.status(409).json({
                message: "This email is already registered for the selected exam date."
            });
        }

        /* ================= GENERATE APPLICATION NUMBER ================= */
        const now = new Date();
        const year = now.getFullYear().toString().slice(-2);
        const month = (now.getMonth() + 1).toString().padStart(2, "0");

        const prefix = `SWCET${year}${month}`;

        const lastUser = await ExamUser.findOne({
            applicationNumber: { $regex: `^${prefix}` }
        }).sort({ applicationNumber: -1 });

        let nextCount = 1;

        if (lastUser) {
            const lastNumber = lastUser.applicationNumber.slice(-2);
            nextCount = parseInt(lastNumber) + 1;
        }

        const paddedCount = nextCount.toString().padStart(2, "0");
        const applicationNumber = `${prefix}${paddedCount}`;

        /* ================= CREATE USER ================= */
        const user = await ExamUser.create({
            applicationNumber,
            name,
            dob,
            phone,
            email,
            examTiming: {
                examDate: new Date(examDate)
            }
        });

        /* ================= FORMAT DATE ================= */
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

const loginExamUser = async (req, res) => {
    try {
        const { applicationNumber, dob } = req.body;

        if (!applicationNumber || !dob) {
            return res.status(400).json({
                message: "Application Number and DOB are required"
            });
        }

        // Convert DOB to Date object (normalize)
        const inputDob = new Date(dob);

        const user = await ExamUser.findOne({ applicationNumber });

        if (!user) {
            return res.status(404).json({
                message: "Invalid Application Number or DOB"
            });
        }

        // Compare DOB (ignore time part)
        const userDob = new Date(user.dob);

        if (userDob.toISOString().split("T")[0] !== inputDob.toISOString().split("T")[0]) {
            return res.status(401).json({
                message: "Invalid Application Number or DOB"
            });
        }

        // Optional: Prevent login if terminated
        if (user.terminated) {
            return res.status(403).json({
                message: "Your exam has been terminated. Please contact support."
            });
        }

        res.status(200).json({
            message: "Login successful",
            user
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const submitExam = async (req, res) => {
    try {
        const { stats, liveIndicator, finalMarks, terminated } = req.body;

        const user = await ExamUser.findOne({
            applicationNumber: req.params.applicationNumber,
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isSubmitted) {
            return res.status(400).json({ message: "Exam already submitted" });
        }

        // ✅ Update according to schema
        user.stats = stats;
        user.liveIndicator = liveIndicator;
        user.finalMarks = finalMarks;
        user.isSubmitted = true;
        user.examTiming.submittedAt = new Date();

        // ✅ Mark terminated if auto submitted
        if (terminated) {
            user.terminated = true;
        }

        await user.save();

        /* ================= EMAIL SECTION ================= */

        if (user.email) {
            const formattedDate = new Date(
                user.examTiming.submittedAt
            ).toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
                dateStyle: "full",
                timeStyle: "short",
            });

            const html = examSubmittedMail(
                user.name,
                user.applicationNumber,
                formattedDate
            );

            await sendMail(
                user.email,
                "SW-CET 2026 – Exam Submission Confirmation",
                null,
                html
            );
        }

        /* ================================================= */

        res.json({ message: "Exam submitted successfully" });

    } catch (error) {
        console.error("Submit Exam Error:", error);
        res.status(500).json({ message: error.message });
    }
};

const sendResultsByRange = async (req, res) => {
    try {
        const { fromAppNo, toAppNo } = req.body;

        if (!fromAppNo || !toAppNo) {
            return res.status(400).json({
                message: "fromAppNo and toAppNo are required"
            });
        }

        const users = await ExamUser.find({
            applicationNumber: {
                $gte: fromAppNo,
                $lte: toAppNo
            },
            isSubmitted: true
        }).sort({ applicationNumber: 1 });

        if (!users.length) {
            return res.status(404).json({
                message: "No submitted users found in this range"
            });
        }

        for (const user of users) {
            if (!user.email) continue;

            let html;

            if (user.terminated) {
                html = examTerminationMail(user);
            } else {
                html = examResultMail(user);
            }

            await sendMail(
                user.email,
                user.terminated
                    ? "SW-CET 2026 – Exam Termination Notice"
                    : "SW-CET 2026 – Result Notification",
                null,
                html
            );
        }

        res.json({
            message: `Results sent successfully to ${users.length} candidates`
        });

    } catch (error) {
        console.error("Send Results Error:", error);
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    createExamUser,
    loginExamUser,
    submitExam,
    sendResultsByRange
};
