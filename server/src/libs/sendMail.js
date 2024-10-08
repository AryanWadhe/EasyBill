import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();  // Ensure environment variables are loaded

export const sendMail = async (options) => {
  try {
    // Ensure required environment variables are set
    const { SMTP_HOST, SMTP_PORT, SMTP_EMAIL, SMTP_PASS } = process.env;
    
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_EMAIL || !SMTP_PASS) {
      throw new Error("Missing SMTP configuration environment variables");
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === "465", // Use secure if port 465, else false
      auth: {
        user: SMTP_EMAIL,
        pass: SMTP_PASS,
      },
    });

    // Verify connection configuration
    transporter.verify((error, success) => {
      if (error) {
        console.error("SMTP connection error: ", error);
      } else {
        console.log("SMTP server is ready to take messages");
      }
    });

    const info = await transporter.sendMail({
      from: SMTP_EMAIL,
      to: options.email,
      subject: options.subject,
      text: options.message,
      attachments: [
        {
          filename: "invoice.pdf",
          content: options.content,
        },
      ],
    });
    // ----
    // const info = await transporter.sendMail({
    //   from: SMTP_EMAIL,
    //   to: "lit2021052@iiitl.ac.in",
    //   subject: "testing",
    //   text: "Happy birthday bhai sahab",
    //   // attachments: [
    //   //   {
    //   //     filename: "invoice.pdf",
    //   //     content: options.content,
    //   //   },
    //   // ],
    // });
    


    console.log("Email sent: ", info.messageId);
    return info;
    
  } catch (error) {
    console.error("Detailed error sending email: ", error.response || error.message || error);
    return error;
  }
};
