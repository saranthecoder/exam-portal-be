/* ======================================================
   COMPANY CONSTANTS
====================================================== */
const COMPANY_NAME = "Saredufy Web Plus Academy Pvt. Ltd.";
const SUPPORT_EMAIL = "hr@saredufywpa.in";
const SUPPORT_PHONE = "+91 - 8886200010";
const WEBSITE = "www.saredufywpa.in";
const CIN = "U85307AP2024PTC116844";

/* ======================================================
   COMPANY FOOTER
====================================================== */
const companyFooter = `
<hr style="border:none; border-top:1px solid #ddd; margin:20px 0;" />

<p style="font-size:13px;">
  <strong>Registered Address:</strong><br/>
  22-5-97/2, Plot No. 81, GuestLine Road, Kotthapalle,
  Sujatha Nagar, Tirupati, Andhra Pradesh - 517501
</p>

<p style="font-size:13px;">
  <strong>Phone:</strong> ${SUPPORT_PHONE}<br/>
  <strong>Email:</strong> ${SUPPORT_EMAIL}<br/>
  <strong>Website:</strong> ${WEBSITE}<br/>
  <strong>CIN:</strong> ${CIN}
</p>

<p style="font-size:12px; color:#666;">
  This is a <strong>system-generated email</strong>. Please do not reply.
</p>
`;

/* ======================================================
   BASE TEMPLATE (VERY IMPORTANT THIS MUST EXIST)
====================================================== */
const baseTemplate = (title, body) => `
<div style="font-family: Arial, sans-serif; color:#111; line-height:1.6;">

  <div style="display:flex; align-items:center; margin-bottom:16px;">
    <img
      src="https://saredufywpa.in/assets/logo.png"
      alt="Saredufy"
      width="48"
      height="48"
      style="border-radius:50%; margin-right:12px;"
    />
    <div>
      <strong>Saredufy Web Plus Academy</strong><br/>
      <span style="font-size:13px; color:#666;">Official Communication</span>
    </div>
  </div>

  <h2 style="margin-bottom:10px;">${title}</h2>

  ${body}

  <p style="margin-top:20px;">
    <strong>Warm regards,</strong><br/>
    <strong>${COMPANY_NAME}</strong>
  </p>

  ${companyFooter}

</div>
`;

/* ======================================================
   SWCET REGISTRATION MAIL
====================================================== */
const swcetRegistrationMail = (
  name,
  applicationNumber,
  examDateFormatted,
  examLink
) =>
  baseTemplate(
    "SWCET Examination Registration Confirmation",
    `
    <p>Dear <strong>${name}</strong>,</p>

    <p>
      Your registration for the <strong>SWCET Examination</strong>
      has been successfully completed.
    </p>

    <p>
      <strong>Application Number:</strong> ${applicationNumber}<br/>
      <strong>Exam Date & Time:</strong> ${examDateFormatted}
    </p>

    <p>
      <a href="${examLink}"
         style="
           display:inline-block;
           margin-top:10px;
           padding:12px 22px;
           background:#ff7a18;
           color:#ffffff;
           text-decoration:none;
           border-radius:6px;
           font-weight:bold;
         ">
        Start Examination
      </a>
    </p>

    <p>
      Please keep your Application Number safe for login.
    </p>
    `
  );

/* 🎓 EXAM SUBMISSION CONFIRMATION */
const examSubmittedMail = (name, applicationNumber, submittedAt) =>
  baseTemplate(
    "SW-CET 2026 – Exam Submitted Successfully",
    `
    <p>Dear <strong>${name}</strong>,</p>

    <p>
      This is to confirm that your <strong>SW-CET 2026</strong> examination
      has been successfully submitted.
    </p>

    <p>
      <strong>Application Number:</strong> ${applicationNumber}<br/>
      <strong>Submission Time:</strong> ${submittedAt}
    </p>

    <p>
      Your responses have been securely recorded in our system.
      Results will be communicated as per the official schedule.
    </p>

    <p>
      If you have any concerns, please contact our support team.
    </p>
    `
  );

const examResultMail = (user) =>
   baseTemplate(
    "SW-CET 2026 – Official Result Notification",
    `
    <p>Dear <strong>${user.name}</strong>,</p>

    <p>
      We are pleased to inform you that your <strong>SW-CET 2026</strong> 
      examination has been successfully evaluated.
    </p>

    <div style="
        margin: 24px 0;
        padding: 24px;
        background: #f4f7ff;
        border-left: 6px solid #2b6cb0;
        border-radius: 8px;
        text-align: center;
      ">
      <p style="margin: 0; font-size: 14px; color: #555;">
        FINAL SCORE
      </p>
      <p style="
          margin: 8px 0 0 0;
          font-size: 36px;
          font-weight: bold;
          color: #2b6cb0;
        ">
        ${user.finalMarks} <span style="font-size:18px; color:#555;">/ 200</span>
      </p>
    </div>

    <h3 style="margin-top:30px;">Examination Details</h3>
    <p>
      <strong>Application Number:</strong> ${user.applicationNumber}<br/>
      <strong>Exam Date:</strong> ${new Date(user.examTiming.examDate).toLocaleDateString("en-IN")}
    </p>

    <h3 style="margin-top:30px;">Performance Summary</h3>
    <p>
      <strong>Total Questions:</strong> ${user.stats.total}<br/>
      <strong>Answered:</strong> ${user.stats.answered}<br/>
      <strong>Unanswered:</strong> ${user.stats.notAnswered}
    </p>

    <div style="
        margin-top:30px;
        padding:18px;
        background:#f9fafc;
        border-radius:8px;
        border:1px solid #e2e8f0;
      ">
      <p style="margin:0;">
        Based on the official cutoff criteria, our admissions team will contact you 
        within <strong>24 hours</strong> regarding your eligibility for:
      </p>

      <ul style="margin-top:10px;">
        <li><strong>Saredufy Launchpad</strong> – Scholarship up to <strong>75%</strong></li>
        <li><strong>WebNexZ Fellowship</strong> – <strong>100% Scholarship</strong></li>
      </ul>
    </div>

    <p style="margin-top:30px;">
      Thank you for participating in SW-CET 2026. 
      We appreciate your effort and look forward to connecting with you.
    </p>
    `
  );



const examTerminationMail = (user) =>
  baseTemplate(
    "SW-CET 2026 – Exam Termination Notice",
    `
    <p>Dear <strong>${user.name}</strong>,</p>

    <p>
      Your SW-CET 2026 examination was terminated due to violation of examination guidelines.
    </p>

    <h3>🚨 Proctoring Details</h3>
    <p>
      <strong>Total Warnings:</strong> ${user.liveIndicator.warningCount}<br/>
      <strong>Tab Switches:</strong> ${user.liveIndicator.tabSwitchCount}<br/>
      <strong>Face Off Count:</strong> ${user.liveIndicator.faceOffCount}<br/>
      <strong>Noise Detected:</strong> ${user.liveIndicator.noiseDetectedCount}
    </p>

    <p>
      As per examination policy, terminated exams are not eligible for evaluation.
    </p>
    `
  );



module.exports = {
  examResultMail,
  examTerminationMail,
  swcetRegistrationMail,
  examSubmittedMail
};
