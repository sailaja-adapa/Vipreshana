const Models = require("../../Models/index.models");

const verifyOTPController = async (req, res) => {
    const { phone, email, otp, verificationType } = req.body;

    try {
        // Validate input
        if (!otp) {
            return res.status(400).json({
                success: false,
                error: "OTP is required"
            });
        }

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

        // Find the OTP record
        const otpRecord = await Models.OTPSchema.findOne({
            [verificationType]: verificationType === 'phone' ? phone : email,
            verificationType,
            otp,
            expiresAt: { $gt: new Date() },
            isVerified: false
        });

        if (!otpRecord) {
            // Check if OTP exists but is expired
            const expiredOTP = await Models.OTPSchema.findOne({
                [verificationType]: verificationType === 'phone' ? phone : email,
                verificationType,
                otp,
                expiresAt: { $lte: new Date() }
            });

            if (expiredOTP) {
                return res.status(400).json({
                    success: false,
                    error: "OTP has expired. Please request a new one."
                });
            }

            // Check if OTP exists but is already verified
            const verifiedOTP = await Models.OTPSchema.findOne({
                [verificationType]: verificationType === 'phone' ? phone : email,
                verificationType,
                otp,
                isVerified: true
            });

            if (verifiedOTP) {
                return res.status(400).json({
                    success: false,
                    error: "OTP has already been used."
                });
            }

            // Increment attempts
            const existingOTP = await Models.OTPSchema.findOne({ 
                [verificationType]: verificationType === 'phone' ? phone : email,
                verificationType,
                isVerified: false 
            });
            if (existingOTP) {
                existingOTP.attempts += 1;
                await existingOTP.save();

                if (existingOTP.attempts >= existingOTP.maxAttempts) {
                    return res.status(400).json({
                        success: false,
                        error: "Too many failed attempts. Please request a new OTP."
                    });
                }
            }

            return res.status(400).json({
                success: false,
                error: "Invalid OTP. Please check and try again."
            });
        }

        // Mark OTP as verified
        otpRecord.isVerified = true;
        await otpRecord.save();

        res.status(200).json({
            success: true,
            message: "OTP verified successfully"
        });

    } catch (error) {
        console.error('Error in verifyOTPController:', error);
        res.status(500).json({
            success: false,
            error: "Failed to verify OTP"
        });
    }
};

module.exports = verifyOTPController; 
