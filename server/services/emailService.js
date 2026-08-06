const sendLoginOtpEmail = async ({ email, fullName, otp }) => {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
    throw new Error("Email service is not configured.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM,
      to: [email],
      subject: "Your Employee Management login code",
      html: `<div style="font-family:Arial,sans-serif;color:#172033"><h2>Hello ${fullName},</h2><p>Use this one-time code to sign in:</p><p style="font-size:28px;font-weight:700;letter-spacing:6px">${otp}</p><p>This code expires in 10 minutes. Do not share it with anyone.</p></div>`,
    }),
  });

  if (!response.ok) throw new Error("Unable to send the one-time code.");
};

export default sendLoginOtpEmail;
