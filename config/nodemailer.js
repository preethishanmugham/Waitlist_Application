require('dotenv').config();
const emailConfig = {
  service: "gmail",
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
};
module.exports = { emailConfig };
