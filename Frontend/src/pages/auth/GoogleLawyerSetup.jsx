import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import Sidebar from '../../components/layout/Sidebar';
import ModernToast from '../../components/ModernToast';

// Simple JWT decode function
const decodeJWT = (token) => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};

const GoogleLawyerSetup = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState('success');
  const [toastMessage, setToastMessage] = useState('Profile updated successfully!');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    registration_id: '',
    law_firm: '',
    speciality: '',
    address: '',
    zip_code: '',
    city: '',
    state: '',
    country: '',
    mobile_number: '',
  });
  const [errors, setErrors] = useState({});


  useEffect(() => {
    const urlToken = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      toast.error('Google login failed. Please try again.');
      navigate('/');
      return;
    }

    // If we have a token in URL, store it and prefill email
    if (urlToken) {
      const decoded = decodeJWT(urlToken);
      if (decoded && decoded.email) {
        localStorage.setItem('token', urlToken);
        setFormData(prev => ({
          ...prev,
          email: decoded.email,
        }));
      } else {
        localStorage.setItem('token', urlToken);
      }
    }

    // Fetch existing profile to prefill remaining fields (for Submit Later or partial data)
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      setFetchingProfile(false);
      return;
    }

    const loadProfile = async () => {
      try {
        setFetchingProfile(true);
        const resp = await api.get('/auth/me');
        const u = resp.data || {};
        setFormData(prev => ({
          ...prev,
          name: prev.name || u.name || '',
          email: prev.email || u.email || '',
          username: prev.username || u.username || '',
          registration_id: prev.registration_id || u.registration_id || '',
          law_firm: prev.law_firm || u.law_firm || '',
          speciality: prev.speciality || u.speciality || '',
          address: prev.address || u.address || '',
          zip_code: prev.zip_code || u.zip_code || '',
          city: prev.city || u.city || '',
          state: prev.state || u.state || '',
          country: prev.country || u.country || '',
          mobile_number: prev.mobile_number || u.mobile_number || '',
        }));
      } catch (e) {
        // Ignore; user may be brand new
      } finally {
        setFetchingProfile(false);
      }
    };

    loadProfile();
  }, [searchParams, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.registration_id.trim()) {
      newErrors.registration_id = 'Bar Registration ID is required';
    }
    
    if (!formData.speciality.trim()) {
      newErrors.speciality = 'Speciality is required';
    }
    
    if (!formData.mobile_number.trim()) {
      newErrors.mobile_number = 'Mobile number is required';
    } else if (!/^\+?[\d\s-()]+$/.test(formData.mobile_number)) {
      newErrors.mobile_number = 'Invalid mobile number format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('No authentication token found. Please login again.');
          navigate('/');
          return;
        }

        const updatedFormData = { ...formData, verified: true };
        const response = await api.put('/auth/me', updatedFormData);
        toast.success('Profile updated and verified successfully!');
        
        const userData = response.data.user || response.data.lawyer || response.data;
        if (userData) {
          login(token, userData);
          // Use backend redirect field from response
          const redirectPath = response.data.redirect || userData.redirect || '/lawyer-dashboard';
          console.log('🚀 GoogleLawyerSetup redirect:', redirectPath);
          navigate(redirectPath);
        } else {
          console.error('No user data in response');
          navigate('/lawyer-dashboard');
        }
      } catch (error) {
        console.error('Profile update error:', error);
        toast.error(error.response?.data?.message || 'Failed to update profile');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmitLater = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await api.post('/auth/submit-later', {});
        const userData = response.data.user || response.data;
        const formattedUserData = {
          ...userData,
          role: userData.role || 'lawyer',
        };
        login(token, formattedUserData);
        toast.info('You can complete your profile later from settings.');
        // Use backend redirect field from response
        const redirectPath = response.data.redirect || userData.redirect || '/lawyer-dashboard';
        console.log('🚀 GoogleLawyerSetup submit later redirect:', redirectPath);
        navigate(redirectPath);
        return;
      }
    } catch (error) {
      console.error('Error updating status on submit later:', error);
    }
    toast.info('You can complete your profile later from settings.');
    navigate('/lawyer-dashboard');
  };

  const handleBackToLogin = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleGoToHome = () => {
    navigate('/');
  };

  if (fetchingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left blue sidebar */}
      <Sidebar isAuthPage={true} />

      {/* Right form area */}
      <main className="flex-1 flex items-start justify-start pt-12 pl-16 pr-16 pb-12 overflow-y-auto">
        <div className="w-full max-w-[620px]">
          <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-[#0284C7] rounded-full px-6 py-3 shadow-lg inline-flex">
              <span className="text-white font-bold text-3xl">Legal</span>
            </div>
            <span className="text-[#0284C7] font-bold text-3xl">City</span>
          </div>
          <p className="text-[#0284C7] text-sm font-semibold tracking-wider uppercase">
            " Legal for the people "
          </p>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Lawyer Profile</h2>
          <p className="text-gray-600 mb-4">
            Please fill in the required information. Your account will be reviewed by our admin team.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-200 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Username *</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-200 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
              />
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
            </div>

            {/* Email (readonly) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                readOnly
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-md text-gray-600 cursor-not-allowed"
              />
            </div>

            {/* Bar Registration ID */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Bar Registration ID *</label>
              <input
                type="text"
                name="registration_id"
                value={formData.registration_id}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-200 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
              />
              {errors.registration_id && <p className="text-red-500 text-xs mt-1">{errors.registration_id}</p>}
            </div>

            {/* Law Firm */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Law Firm</label>
              <input
                type="text"
                name="law_firm"
                value={formData.law_firm}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-200 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
              />
            </div>

            {/* Speciality */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Speciality *</label>
              <select
                name="speciality"
                value={formData.speciality}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-200 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
              >
                <option value="">Select Speciality</option>
                <option value="Criminal Law">Criminal Law</option>
                <option value="Family Law">Family Law</option>
                <option value="Corporate Law">Corporate Law</option>
                <option value="Civil Law">Civil Law</option>
                <option value="Tax Law">Tax Law</option>
                <option value="Property Law">Property Law</option>
                <option value="Labor Law">Labor Law</option>
                <option value="Immigration Law">Immigration Law</option>
              </select>
              {errors.speciality && <p className="text-red-500 text-xs mt-1">{errors.speciality}</p>}
            </div>

            {/* Mobile Number */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Mobile Number *</label>
              <input
                type="tel"
                name="mobile_number"
                value={formData.mobile_number}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-200 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
              />
              {errors.mobile_number && <p className="text-red-500 text-xs mt-1">{errors.mobile_number}</p>}
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-200 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-200 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-200 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
              />
            </div>

            {/* Zip Code */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Zip Code</label>
              <input
                type="text"
                name="zip_code"
                value={formData.zip_code}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-200 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-200 border-0 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={handleContinue}
              disabled={loading}
              className="flex-1 py-3.5 bg-[#0891B2] hover:bg-[#0284C7] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-md transition-colors text-base shadow-md"
            >
              {loading ? 'Saving...' : 'Continue'}
            </button>
            
            <button
              onClick={handleSubmitLater}
              disabled={loading}
              className="flex-1 py-3.5 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700 font-semibold rounded-md transition-colors text-base"
            >
              Submit Later
            </button>
          </div>
        </div>
          </div>
        </div>
      </main>

      {/* Modern Toast Notification */}
      {showToast && (
        <ModernToast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default GoogleLawyerSetup;