import React from 'react';
import Login from '../../components/auth/Login';
import { useAuth } from '../../context/AuthContext';

/**
 * Login Page Component
 *
 * This page handles user and lawyer login authentication.
 * It supports login via email/password or registration ID for lawyers.
 * Provides options to switch to registration or forgot password flows.
 *
 * Features:
 * - User/Lawyer role selection
 * - Email or Registration ID login for lawyers
 * - Password visibility toggle
 * - Forgot password link
 * - Social login buttons (Google, Facebook) - placeholders for now
 * - Form validation and error handling
 * - Consistent styling with other auth pages
 */
const LoginPage = ({ onSwitchToRegister, onSwitchToForgot, onLoginSuccess }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 lg:p-10 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
        {/* Render the Login component with props */}
        <Login
          onSwitchToRegister={onSwitchToRegister}
          onSwitchToForgot={onSwitchToForgot}
          onLoginSuccess={onLoginSuccess}
        />
      </div>
    </div>
  );
};

export default LoginPage;