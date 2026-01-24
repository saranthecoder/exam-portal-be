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

module.exports = {
  swcetRegistrationMail
};
