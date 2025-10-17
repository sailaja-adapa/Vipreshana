const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: function() {
            return !this.email; 
        },
        index: true
    },
    email: {
        type: String,
        required: function() {
            return !this.phone;
        },
        index: true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: 'Please provide a valid email address'
        }
    },
    verificationType: {
        type: String,
        enum: ['phone', 'email'],
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expireAfterSeconds: 0 } 
    },
    attempts: {
        type: Number,
        default: 0
    },
    maxAttempts: {
        type: Number,
        default: 3
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

otpSchema.index({ phone: 1, createdAt: -1 });
otpSchema.index({ email: 1, createdAt: -1 });
otpSchema.index({ verificationType: 1, createdAt: -1 });

const OTP = mongoose.model('OTP', otpSchema);

module.exports = OTP; 
