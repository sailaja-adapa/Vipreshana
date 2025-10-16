const Models = require("../../Models/index.models");
const { sendOTP, generateOTP } = require("../../services/twilioService");
const { sendEmailOTP, generateEmailOTP } = require("../../services/emailOTPService");

const sendOTPController = async (req, res) => {
    const { phone, email, verificationType } = req.body;

    console.log('📥 OTP Request Body:', req.body);
    console.log('🔍 Parsed values:', { phone, email, verificationType });

    try {
        // Validate input
        if (!verificationType || (verificationType !== 'phone' && verificationType !== 'email')) {
            return res.status(400).json({ 
                success: false, 
                error: "Verification type must be 'phone' or 'email'" 
            });
        }

        if (verificationType === 'phone' && !phone) {
            return res.status(400).json({ 
                success: false, 
                error: "Phone number is required for SMS verification" 
            });
        }

        if (verificationType === 'email' && !email) {
            return res.status(400).json({ 
                success: false, 
                error: "Email is required for email verification" 
            });
        }

        // Check if user is already registered
        const existingUser = verificationType === 'phone' 
            ? await Models.UserSchema.findOne({ phone })
            : await Models.UserSchema.findOne({ email });
            
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                error: `${verificationType === 'phone' ? 'Phone number' : 'Email'} already registered` 
            });
        }

        // Check for existing unexpired OTP
        const existingOTP = await Models.OTPSchema.findOne({
            [verificationType]: verificationType === 'phone' ? phone : email,
            verificationType,
            expiresAt: { $gt: new Date() },
            isVerified: false
        });

        if (existingOTP) {
            const timeDiff = Math.ceil((existingOTP.expiresAt - new Date()) / 1000 / 60);
            return res.status(429).json({
                success: false,
                error: `Please wait ${timeDiff} minutes before requesting another OTP`
            });
        }

        // Generate new OTP
        const otp = verificationType === 'phone' ? generateOTP() : generateEmailOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Save OTP to database
        const newOTP = new Models.OTPSchema({
            phone: verificationType === 'phone' ? phone : null,
            email: verificationType === 'email' ? email : null,
            verificationType,
            otp,
            expiresAt
        });
        await newOTP.save();

        // Send OTP based on verification type
        let sendResult;
        
        if (verificationType === 'phone') {
            sendResult = await sendOTP(phone, otp);
        } else {
            sendResult = await sendEmailOTP(email, otp);
        }

        if (!sendResult.success) {
            // Delete the saved OTP if sending failed
            await Models.OTPSchema.findByIdAndDelete(newOTP._id);
            return res.status(500).json({
                success: false,
                error: sendResult.error || "Failed to send OTP. Please try again."
            });
        }

        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            expiresIn: "10 minutes"
        });

    } catch (error) {
        console.error('Error in sendOTPController:', error);
        res.status(500).json({
            success: false,
            error: "Failed to send OTP"
        });
        
    }
};

module.exports = sendOTPController; 
