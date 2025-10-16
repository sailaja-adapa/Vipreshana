const Models = require("../../Models/index.models");
const bcrypt = require('bcryptjs');
const Templates = require("../../Templates/index.templates");
const sendMail = require("../../Utils/sendMail");

// Sanitization function
const sanitize = (str) => {
    return str?.trim().replace(/[<>"'\/]/g, '');
};



const userRegisterController = async (req, res) => {
    let { name, email, password, phone, role } = req.body;

    try {
        name = sanitize(name);
        email = sanitize(email);
        phone = phone?.trim();
        role = sanitize(role);



        // Check if user already exists
        const existingUser = await Models.UserSchema.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return res.status(400).json({ error: "Email or Phone already registered" });
        }

        // Verify OTP before registration (check for either phone or email verification)
        const verifiedOTP = await Models.OTPSchema.findOne({
            $or: [
                { phone, isVerified: true, expiresAt: { $gt: new Date() } },
                { email, isVerified: true, expiresAt: { $gt: new Date() } }
            ]
        });

        if (!verifiedOTP) {
            return res.status(400).json({ 
                error: "Phone number or email not verified. Please verify with OTP first." 
            });
        }

        // Hash password and create user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newRegistration = new Models.UserSchema({ 
            name, 
            email, 
            password: hashedPassword, 
            phone, 
            role 
        });
        await newRegistration.save();

        // Delete the verified OTP after successful registration
        await Models.OTPSchema.findByIdAndDelete(verifiedOTP._id);

        // Create a mail content...
        const mailData = Templates.SignupMailTemplate({ email, name, subject: "Welcome to Vipreshana" });

        // Send the welcome mail...
        await sendMail(mailData, (error, info) => {
            if (error) {
                console.log("Mail sending error...");
            } else {
                console.log("Mail sent", info);
            }
        });

        res.status(200).json({ message: "Registration successful!" });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: "Failed to register user" });
    }
}

module.exports = userRegisterController;
