// API Configuration for both local and production environments
const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

// Production API URL
const PRODUCTION_API_URL = 'https://vipreshana-3.onrender.com';

// Local development API URL
const LOCAL_API_URL = 'http://localhost:5000';

// Choose API URL based on environment
const API_BASE_URL = 'https://vipreshana-3.onrender.com';

// Log the current configuration (for debugging)
if (isDevelopment) {
  console.log('🔧 Development mode - Using local API:', API_BASE_URL);
} else {
  console.log('🚀 Production mode - Using production API:', API_BASE_URL);
}

export default API_BASE_URL; 
