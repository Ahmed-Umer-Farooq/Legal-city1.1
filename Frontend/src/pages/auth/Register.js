import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../../components/auth/AuthForm';

/**
 * Register Page Component
 *
 * This page handles user and lawyer registration.
 * It uses the AuthForm component to collect registration details
 * and provides options to switch to login or proceed with social registration.
 *
 * Features:
 * - User/Lawyer role selection
 * - Form validation for required fields
 * - Email verification flow after successful registration
 * - Social login buttons (Google, Facebook) - placeholders for now
 * - Consistent styling with other auth pages
 */
const Register = ({ onSwitchToLogin, onRegisterSuccess }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 lg:p-10 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl xl:max-w-4xl 2xl:max-w-5xl">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-6 sm:mb-8">
          <div 
            className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/')}
          >
            <div className="bg-[#0284C7] rounded-full px-4 sm:px-5 py-2 sm:py-2.5 shadow-lg inline-flex">
              <span className="text-white font-bold text-xl sm:text-2xl lg:text-3xl">Legal</span>
            </div>
            <span className="text-[#0284C7] font-bold text-xl sm:text-2xl lg:text-3xl">City</span>
          </div>
          <p className="text-[#0284C7] text-xs sm:text-sm font-semibold tracking-wider uppercase">
            " Legal for the people "
          </p>
        </div>

        {/* Render the AuthForm component with props */}
        <AuthForm
          onSwitchToLogin={onSwitchToLogin}
          onRegisterSuccess={onRegisterSuccess}
        />

        {/* Back to Home Link */}
        <div className="text-center mt-3 sm:mt-4">
          <p className="text-gray-600 text-xs sm:text-sm">
            Just browsing?{' '}
            <button
              onClick={() => navigate('/')}
              type="button"
              className="text-[#0EA5E9] font-medium hover:underline"
            >
              back to home
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;