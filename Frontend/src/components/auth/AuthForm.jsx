import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../utils/api';

const AuthForm = ({ onSwitchToLogin, onRegisterSuccess }) => {
  const [userType, setUserType] = useState('user');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '', username: '', address: '', city: '', state: '', zipCode: '',
    country: '', mobileNumber: '', email: '', password: '',
    registrationId: '', firm: '', specialty: '', acceptTerms: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validatePassword = (password) => {
    if (!password) return 'Required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/(?=.*[a-z])/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/(?=.*\d)/.test(password)) return 'Password must contain at least one number';
    if (!/(?=.*[^\da-zA-Z])/.test(password)) return 'Password must contain at least one special character';
    return '';
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (name === 'password') {
      const error = validatePassword(value);
      setErrors(prev => ({ ...prev, password: error }));
    } else if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (data) => {
    const newErrors = {};
    if (!data.name.trim()) newErrors.name = 'Required';
    if (!data.username.trim()) newErrors.username = 'Required';
    if (!data.address.trim()) newErrors.address = 'Required';
    if (!data.city.trim()) newErrors.city = 'Required';
    if (!data.state.trim()) newErrors.state = 'Required';
    if (!data.zipCode.trim()) newErrors.zipCode = 'Required';
    if (!data.country.trim()) newErrors.country = 'Required';
    if (!data.mobileNumber.trim()) newErrors.mobileNumber = 'Required';
    if (!data.email.trim()) newErrors.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) newErrors.email = 'Invalid email';
    const passwordError = validatePassword(data.password);
    if (passwordError) newErrors.password = passwordError;
    if (!data.acceptTerms) newErrors.acceptTerms = 'Required';

    if (userType === 'lawyer') {
      if (!data.registrationId.trim()) newErrors.registrationId = 'Required';
      if (!data.firm.trim()) newErrors.firm = 'Required';
      if (!data.specialty.trim()) newErrors.specialty = 'Required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🔥 Button clicked! Current formData (safe):', {
      ...formData,
      password: formData.password ? '***' : '',
    });
    
    const trimmed = {
      ...formData,
      name: formData.name.trim(),
      username: formData.username.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      country: formData.country.trim(),
      zipCode: (formData.zipCode || '').toString().trim(),
      mobileNumber: (formData.mobileNumber || '').toString().trim(),
      email: formData.email.trim().toLowerCase(),
    };

    if (validateForm(trimmed)) {
      setLoading(true);
      try {
        const payload = {
          name: trimmed.name,
          username: trimmed.username,
          email: trimmed.email,
          password: formData.password,
          address: trimmed.address,
          zipCode: trimmed.zipCode,
          zip_code: trimmed.zipCode,
          city: trimmed.city,
          state: trimmed.state,
          country: trimmed.country,
          mobileNumber: trimmed.mobileNumber,
          mobile_number: trimmed.mobileNumber,
        };

        if (userType === 'lawyer') {
          payload.registration_id = formData.registrationId?.trim();
          payload.law_firm = formData.firm?.trim();
          payload.speciality = formData.specialty?.trim();
        }

        console.log('📤 Sending request:', {
          ...payload,
          password: '***',
        });

        await api.post('/auth/register', payload);
        toast.success('Registration successful! Please check your email for verification code.');
        onRegisterSuccess(trimmed.email);
      } catch (error) {
        const data = error?.response?.data;
        if (data?.errors && typeof data.errors === 'object') {
          setErrors(prev => ({ ...prev, ...data.errors }));
        }
        toast.error(data?.message || 'Registration failed. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };



  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Create Account</h2>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="userType"
              checked={userType === 'user'}
              onChange={() => setUserType('user')}
              className="w-4 h-4 text-[#0EA5E9] focus:ring-[#0EA5E9]"
            />
            <span className="text-sm font-medium text-gray-700">User</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="userType"
              checked={userType === 'lawyer'}
              onChange={() => setUserType('lawyer')}
              className="w-4 h-4 text-[#0EA5E9] focus:ring-[#0EA5E9]"
            />
            <span className="text-sm font-medium text-gray-700">Lawyer</span>
          </label>
        </div>
      </div>

      {userType === 'user' && (
        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">Name</label>
                <input id="name" type="text" name="name" value={formData.name} onChange={handleInputChange}
                  className="w-full px-3 py-2.5 text-sm bg-gray-200 border-0 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"/>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-900 mb-2">Username</label>
                <input id="username" type="text" name="username" value={formData.username} onChange={handleInputChange}
                  className="w-full px-3 py-2.5 text-sm bg-gray-200 border-0 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"/>
                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-900 mb-2">Address</label>
              <input id="address" type="text" name="address" value={formData.address} onChange={handleInputChange}
                className="w-full px-3 py-2.5 text-sm bg-gray-200 border-0 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"/>
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-900 mb-2">City</label>
                <input id="city" type="text" name="city" value={formData.city} onChange={handleInputChange}
                  className="w-full px-3 py-2.5 text-sm bg-gray-200 border-0 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"/>
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-900 mb-2">State</label>
                <input id="state" type="text" name="state" value={formData.state} onChange={handleInputChange}
                  className="w-full px-3 py-2.5 text-sm bg-gray-200 border-0 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"/>
                {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-900 mb-2">Zip Code</label>
                <input id="zipCode" type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange}
                  className="w-full px-3 py-2.5 text-sm bg-gray-200 border-0 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"/>
                {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-900 mb-2">Country</label>
                <input id="country" type="text" name="country" value={formData.country} onChange={handleInputChange}
                  className="w-full px-3 py-2.5 text-sm bg-gray-200 border-0 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"/>
                {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-900 mb-2">Mobile Number</label>
              <input id="mobileNumber" type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange}
                className="w-full px-3 py-2.5 text-sm bg-gray-200 border-0 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"/>
              {errors.mobileNumber && <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">Email</label>
              <input id="email" type="email" name="email" value={formData.email} onChange={handleInputChange}
                className="w-full px-3 py-2.5 text-sm bg-gray-200 border-0 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"/>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">Password</label>
              <div className="relative">
                <input
                  id="password" type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange} placeholder="8+ characters"
                  className="w-full px-3 py-2.5 text-sm pr-10 bg-gray-200 border-0 rounded text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"/>
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <div className="flex items-start gap-2">
              <input type="checkbox" id="terms" name="acceptTerms" checked={formData.acceptTerms} onChange={handleInputChange}
                className="w-4 h-4 mt-0.5 text-[#0EA5E9] focus:ring-[#0EA5E9] rounded"/>
              <label htmlFor="terms" className="text-xs text-gray-600 cursor-pointer leading-relaxed">
                Creating an account means you're okay with our Terms of Service, Privacy Policy, and our default Notification Settings.
              </label>
              {errors.acceptTerms && <p className="text-red-500 text-xs mt-1">{errors.acceptTerms}</p>}
            </div>

            <button type="submit" disabled={!formData.acceptTerms || loading}
              className="w-full py-3 bg-[#0EA5E9] hover:bg-[#0284C7] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded text-sm transition-all">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>
      )}

      {userType === 'lawyer' && (
        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="lawyer-name" className="block text-sm font-medium text-gray-900 mb-2">Name</label>
                <input id="lawyer-name" type="text" name="name" value={formData.name} onChange={handleInputChange}
                  className="w-full px-3 py-2.5 text-sm bg-gray-200 border-0 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"/>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="lawyer-username" className="block text-sm font-medium text-gray-900 mb-2">Username</label>
                <input id="lawyer-username" type="text" name="username" value={formData.username} onChange={handleInputChange}
                  className="w-full px-3 py-2.5 text-sm bg-gray-200 border-0 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"/>
                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="lawyer-address" className="block text-sm font-medium text-gray-900 mb-2">Address</label>
              <input id="lawyer-address" type="text" name="address" value={formData.address} onChange={handleInputChange}
                className="w-full px-3 py-2.5 text-sm bg-gray-200 border-0 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"/>
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="lawyer-city" className="block text-sm font-medium text-gray-900 mb-2">City</label>
                <input id="lawyer-city" type="text" name="city" value={formData.city} onChange={handleInputChange}
                  className="w-full px-3 py-2.5 text-sm bg-gray-200 border-0 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"/>
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>
              <div>
                <label htmlFor="lawyer-state" className="block text-sm font-medium text-gray-900 mb-2">State</label>
                <input id="lawyer-state" type="text" name="state" value={formData.state} onChange={handleInputChange}
                  className="w-full px-3 py-2.5 text-sm bg-gray-200 border-0 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"/>
                {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="lawyer-zipCode" className="block text-sm font-medium text-gray-900 mb-2">Zip Code</label>
                <input id="lawyer-zipCode" type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange}
                  className="w-full px-3 py-2.5 text-sm bg-gray-200 border-0 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"/>
                {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
              </div>
              <div>
                <label htmlFor="lawyer-country" className="block text-sm font-medium text-gray-900 mb-2">Country</label>
                <input id="lawyer-country" type="text" name="country" value={formData.country} onChange={handleInputChange}
                  className="w-full px-3 py-2.5 text-sm bg-gray-200 border-0 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"/>
                {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
              </div>
            </div>

            <div className="grid grid-cols-[1fr_1.5fr] gap-4">
              <div>
                <label htmlFor="lawyer-mobileNumber" className="block text-sm font-medium text-gray-900 mb-2">Mobile Number</label>
                <input id="lawyer-mobileNumber" type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange}
                  className="w-full px-3 py-2.5 text-sm bg-gray-200 border-0 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"/>
                {errors.mobileNumber && <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>}
              </div>
              <div>
                <label htmlFor="registrationId" className="block text-sm font-medium text-gray-900 mb-2">Registration ID</label>
                <input id="registrationId" type="text" name="registrationId" value={formData.registrationId} onChange={handleInputChange}
                  className="w-full px-3 py-2.5 text-sm bg-gray-200 border-0 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"/>
                {errors.registrationId && <p className="text-red-500 text-xs mt-1">{errors.registrationId}</p>}
              </div>
            </div>

            <div className="grid grid-cols-[1fr_1.5fr] gap-4">
              <div>
                <label htmlFor="lawyer-email" className="block text-sm font-medium text-gray-900 mb-2">Email</label>
                <input id="lawyer-email" type="email" name="email" value={formData.email} onChange={handleInputChange}
                  className="w-full px-3 py-2.5 text-sm bg-gray-200 border-0 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"/>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="firm" className="block text-sm font-medium text-gray-900 mb-2">Law Firm</label>
                <input id="firm" type="text" name="firm" value={formData.firm} onChange={handleInputChange}
                  className="w-full px-3 py-2.5 text-sm bg-gray-200 border-0 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"/>
                {errors.firm && <p className="text-red-500 text-xs mt-1">{errors.firm}</p>}
              </div>
            </div>

            <div className="grid grid-cols-[1fr_1.5fr] gap-4">
              <div>
                <label htmlFor="lawyer-password" className="block text-sm font-medium text-gray-900 mb-2">Password</label>
                <div className="relative">
                  <input
                    id="lawyer-password" type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange} placeholder="8+ characters"
                    className="w-full px-3 py-2.5 text-sm pr-10 bg-gray-200 border-0 rounded text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"/>
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
              <div>
                <label htmlFor="specialty" className="block text-sm font-medium text-gray-900 mb-2">Specialty</label>
                <input id="specialty" type="text" name="specialty" value={formData.specialty} onChange={handleInputChange}
                  className="w-full px-3 py-2.5 text-sm bg-gray-200 border-0 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"/>
                {errors.specialty && <p className="text-red-500 text-xs mt-1">{errors.specialty}</p>}
              </div>
            </div>
          </div>

            <div className="mt-5 space-y-4">
            <div className="flex items-start gap-2">
              <input type="checkbox" id="terms-lawyer" name="acceptTerms" checked={formData.acceptTerms} onChange={handleInputChange}
                className="w-4 h-4 mt-0.5 text-[#0EA5E9] focus:ring-[#0EA5E9] rounded"/>
              <label htmlFor="terms-lawyer" className="text-xs text-gray-600 cursor-pointer leading-relaxed">
                Creating an account means you're okay with our Terms of Service, Privacy Policy, and our default Notification Settings.
              </label>
              {errors.acceptTerms && <p className="text-red-500 text-xs mt-1">{errors.acceptTerms}</p>}
            </div>

            <button type="submit" disabled={!formData.acceptTerms || loading}
              className="w-full py-3 bg-[#0EA5E9] hover:bg-[#0284C7] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded text-sm transition-all">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>
      )}

      <div className="text-center pt-4">
        <button
          onClick={onSwitchToLogin}
          type="button"
          className="px-8 py-3 border-2 border-gray-300 hover:border-[#0EA5E9] hover:bg-[#0EA5E9] hover:text-white text-gray-700 font-medium rounded-lg transition-all duration-200 text-sm shadow-sm"
        >
          Already a member? Sign in
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
