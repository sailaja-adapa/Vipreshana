const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const figlet = require('figlet');
const bcrypt = require('bcrypt');
require('dotenv').config();

const Configs = require('./configs/Configs');
const connectMongoDB = require('./Databases/ConnectDB');
const Controllers = require('./Controllers/index.controllers');
const { otpRateLimiter, otpVerificationRateLimiter } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  'http://localhost:3000',              // dev frontend
  'http://localhost:3001',              // dev frontend (alternative port)
  'https://vipreshana-2.vercel.app',    // deployed frontend
  'https://vipreshana-2-git-fork-thulasipri-c030df-sailaja-adapas-projects.vercel.app'  // forked frontend
];

// ✅ Updated CORS Configuration
// For local testing: allows any localhost origin
// For production: only allows specific origins
app.use(cors({
  origin: function (origin, callback) {
    console.log('🔍 CORS check for origin:', origin);
    console.log('📋 Allowed origins:', allowedOrigins);
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('✅ Allowing request with no origin');
      return callback(null, true);
    }
    
    // Allow localhost on any port for development (local testing)
    if (origin.startsWith('http://localhost:')) {
      console.log('✅ Allowing localhost origin:', origin);
      return callback(null, true);
    }
    
    // Allow specific origins (production)
    if (allowedOrigins.includes(origin)) {
      console.log('✅ Allowing specific origin:', origin);
      return callback(null, true);
    }
    
    console.log('❌ Blocking origin:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
}));

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log(`Origin: ${req.headers.origin}`);
  next();
});

// ✅ MongoDB connection
// For local testing: uses localhost if MONGO_CONNECTION_STRING is not set
// For production: uses MONGO_CONNECTION_STRING from environment variables
const mongoURI = process.env.MONGO_CONNECTION_STRING || 'mongodb://localhost:27017/vipreshana';
connectMongoDB(Configs.DB_URI);

mongoose.connect(mongoURI)
  .then(() => console.log('✨ MongoDB connected successfully ✨'))
  .catch(err => console.error('❌ MongoDB connection failed:', err));

// ✅ Mongoose schema
const registrationSchema = new mongoose.Schema({
  name: String,
  phone: {
    type: String,
    required: true,
    unique: true
  },
  password: String,
  email: String,
  role: String
}, { collection: 'registrations' });

const Registration = mongoose.models.Registration || mongoose.model('Registration', registrationSchema);

// ✅ Auth routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
console.log('Auth routes are at /api/auth');

// ✅ Basic health check
app.get('/', (req, res) => {
  res.json({
    message: 'Vipreshana Server is running!',
    availableEndpoints: [
      'GET /health - Server health check',
      'GET /api/auth/test - Authentication endpoints'
    ]
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      supabase: process.env.REACT_APP_SUPABASE_URL && process.env.REACT_APP_SUPABASE_ANON_KEY ? 'configured' : 'not_configured',
      mongodb: process.env.MONGO_CONNECTION_STRING ? 'configured' : 'not_configured'
    },
    endpoints: {
      auth: '/api/auth'
    }
  });
});

// ✅ User profile routes
app.get('/api/user/profile', Controllers.GetUserProfileController);
app.put('/api/user/profile', Controllers.UpdateUserProfileController);
app.put('/api/user/password', Controllers.UpdateUserPasswordController);

// ✅ OTP routes
app.post('/api/send-otp', otpRateLimiter, Controllers.SendOTPController);
app.post('/api/verify-otp', otpVerificationRateLimiter, Controllers.VerifyOTPController);

// ✅ Auth routes
app.post('/api/register', Controllers.UserRegisterController);
app.post('/api/forgot-password', Controllers.ForgotPasswordController);
app.post('/api/reset-password', Controllers.ResetPasswordController);

// ✅ Bookings
app.post('/api/bookings', Controllers.BookingController);
// Route to retrieve bookings by phone number - fixes issue where users couldn't see their bookings even though booking on that phone number was already made
app.get('/api/bookings/:phone', Controllers.GetBookingByPhoneController); 
app.get('/api/details', Controllers.GetAllBookingController);

// ✅ Server test
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running', status: 'ok', timestamp: new Date().toISOString() });
});

// ✅ Login route
app.post('/api/login', async (req, res) => {
  try {
    const { phone, email, password } = req.body;
    
    console.log('📥 Login request body:', req.body);
    console.log('🔍 Parsed values:', { phone, email, password });

    if (!password) {
      console.log('❌ No password provided');
      return res.status(400).json({ message: 'Password is required.' });
    }

    if (!phone && !email) {
      console.log('❌ No phone or email provided');
      return res.status(400).json({ message: 'Phone number or email is required.' });
    }

    // Find user by phone or email
    let user;
    console.log('🔍 Login attempt:', { phone, email });
    
    if (phone) {
      user = await Registration.findOne({ phone });
      console.log('📱 Searching by phone:', phone, 'User found:', !!user);
    } else if (email) {
      user = await Registration.findOne({ email });
      console.log('📧 Searching by email:', email, 'User found:', !!user);
    }

    if (!user) {
      return res.status(404).json({ 
        message: 'No user found with this phone number or email.' 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password. Please try again.' });
    }

    const { password: _, ...safeUser } = user.toObject();
    return res.status(200).json({
      message: 'Login successful!',
      user: safeUser
    });

  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// ✅ 404 fallback
app.use((req, res) => {
  console.log(`404 Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    requested: req.originalUrl,
    available_api_base_paths: [
      '/api/auth',
      '/api/test',
      '/health'
    ]
  });
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

// ✅ Start server
app.listen(PORT, () => {
  figlet('Vipreshana Server', (err, data) => {
    if (err) {
      console.log(`Server started on port ${PORT}`);
    } else {
      console.log(data);
      console.log(`Server is running on port ${PORT}`);
      console.log(`Health check at: http://localhost:${PORT}/health`);
      console.log(`Auth endpoints at: http://localhost:${PORT}/api/auth/`);
    }
  });
});
