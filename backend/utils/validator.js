const validateRegistration = (data) => {
  const errors = {};

  // Name validation: only letters and spaces, at least 2 characters
  if (!data.name || !/^[a-zA-Z\s]{2,}$/.test(data.name.trim())) {
    errors.name = 'Name must contain only letters and spaces, at least 2 characters';
  }

  // Email validation: proper email format
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Valid email address is required';
  }

  // Password validation: at least 8 characters, include uppercase, lowercase, number, and special character
  if (!data.password || data.password.length < 8 ||
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(data.password)) {
    errors.password = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
  }

  if (!['user', 'lawyer'].includes(data.role)) {
    errors.role = 'Role must be user or lawyer';
  }

  // Registration ID validation for lawyers: alphanumeric, specific format
  if (data.role === 'lawyer') {
    if (!data.registration_id || !/^[A-Z]{2}\d{6}$/.test(data.registration_id.trim())) {
      errors.registration_id = 'Registration ID must be in format: 2 letters followed by 6 digits (e.g., AB123456)';
    }
  }

  // Mobile number validation: international format, numbers only
  if (data.mobile_number && !/^\+?\d{10,15}$/.test(data.mobile_number.replace(/\s/g, ''))) {
    errors.mobile_number = 'Mobile number must be 10-15 digits, optionally starting with +';
  }

  // Username validation: alphanumeric and underscores, 3-20 characters
  if (data.username && !/^[a-zA-Z0-9_]{3,20}$/.test(data.username)) {
    errors.username = 'Username must be 3-20 characters, letters, numbers, and underscores only';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

const validateLogin = (data) => {
  const errors = {};

  // Allow login with either email or registration_id
  if ((!data.email || !/\S+@\S+\.\S+/.test(data.email)) && (!data.registration_id || data.registration_id.trim().length === 0)) {
    errors.email = 'Valid email or registration ID is required';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

module.exports = { validateRegistration, validateLogin };
