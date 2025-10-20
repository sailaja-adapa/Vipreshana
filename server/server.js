const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const figlet = require('figlet');
const bcrypt = require('bcrypt');
const twilio = require('twilio');
require('dotenv').config();

const Configs = require('./configs/Configs');
const connectMongoDB = require('./Databases/ConnectDB');
const Controllers = require('./Controllers/index.controllers');
const { otpRateLimiter, otpVerificationRateLimiter } = require('./middleware/rateLimiter');

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3001;

// ✅ Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

// ✅ Allowed Origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://vipreshana-2.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }
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
  next();
});

// ✅ MongoDB connection
const mongoURI = process.env.MONGO_CONNECTION_STRING || 'mongodb://localhost:27017/vipreshana';
connectMongoDB(Configs.DB_URI);
mongoose.connect(mongoURI)
  .then(() => console.log('✨ MongoDB connected successfully ✨'))
  .catch(err => console.error('❌ MongoDB connection failed:', err));

// ✅ Registration Schema
const registrationSchema = new mongoose.Schema({
  name: String,
  phone: { type: String, required: true, unique: true },
  password: String,
  email: String,
  role: String
}, { collection: 'registrations' });

const Registration = mongoose.models.Registration || mongoose.model('Registration', registrationSchema);

// ✅ Booking Schema
const bookingSchema = new mongoose.Schema({
  name: String,
  phone: String,
  pickupLocation: String,
  dropoffLocation: String,
  vehicleType: String,
  estimatedCost: String,
  accepted_booking: { type: String, default: 'pending' },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});
const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

// ✅ Auth routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
console.log('Auth routes are at /api/auth');

// ✅ Health check
app.get('/', (req, res) => {
  res.json({ message: 'Vipreshana Server is running!' });
});
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ✅ User Profile Routes
app.get('/api/user/profile', Controllers.GetUserProfileController);
app.put('/api/user/profile', Controllers.UpdateUserProfileController);
app.put('/api/user/password', Controllers.UpdateUserPasswordController);

// ✅ OTP Routes
app.post('/api/send-otp', otpRateLimiter, Controllers.SendOTPController);
app.post('/api/verify-otp', otpVerificationRateLimiter, Controllers.VerifyOTPController);

// ✅ Auth Routes
app.post('/api/register', Controllers.UserRegisterController);
app.post('/api/forgot-password', Controllers.ForgotPasswordController);
app.post('/api/reset-password', Controllers.ResetPasswordController);

// ✅ Booking Routes
app.post('/api/bookings', Controllers.BookingController);
app.get('/api/bookings/:phone', Controllers.GetBookingByPhoneController);
app.get('/api/details', Controllers.GetAllBookingController);

// ✅ NEW: Accept booking
app.put('/api/details/:id/accept', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { accepted_booking: 'accepted' },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json({ message: 'Booking accepted successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error accepting booking', error });
  }
});

// ✅ NEW: Update booking status
app.put('/api/details/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json({ message: 'Booking status updated successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error updating status', error });
  }
});

// ✅ NEW: Send delivery message
app.post('/api/details/deliver', async (req, res) => {
  try {
    const { phone, message } = req.body;
    if (!phone || !message)
      return res.status(400).json({ message: 'Phone and message required' });

    await client.messages.create({
      body: message,
      from: twilioPhone,
      to: phone
    });

    res.status(200).json({ message: 'Delivery message sent successfully' });
  } catch (error) {
    console.error('Twilio error:', error);
    res.status(500).json({ message: 'Failed to send delivery message', error });
  }
});

// ✅ NEW: Delete booking after delivery
app.delete('/api/details/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting booking', error });
  }
});

// ✅ Login Route
app.post('/api/login', async (req, res) => {
  try {
    const { phone, email, password } = req.body;
    if (!password) return res.status(400).json({ message: 'Password required' });
    if (!phone && !email) return res.status(400).json({ message: 'Phone or Email required' });

    const user = await Registration.findOne(phone ? { phone } : { email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

    const { password: _, ...safeUser } = user.toObject();
    res.status(200).json({ message: 'Login successful', user: safeUser });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ 404 Fallback
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found', requested: req.originalUrl });
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

// ✅ Start Server
app.listen(PORT, () => {
  figlet('Vipreshana Server', (err, data) => {
    if (err) console.log(`Server started on port ${PORT}`);
    else {
      console.log(data);
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    }
  });
});
