import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendNotificationEmail = async (imageId: number, imageUrl: string): Promise<void> => {
  // Split comma-separated emails into an array
  const emailRecipients = process.env.EMAIL_TO?.split(',') || [];

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: emailRecipients, // Nodemailer will handle the array of recipients
    subject: 'New Image Processed',
    text: `A new image (ID: ${imageId}) has been processed successfully. Here is the image url ${imageUrl}`,
  };

  await transporter.sendMail(mailOptions);
};