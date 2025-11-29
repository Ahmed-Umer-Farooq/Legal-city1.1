import React from 'react';
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm';

/**
 * Forgot Password Page Component
 *
 * This page allows users to request a password reset link.
 * Users enter their email address and receive a reset link via email.
 *
 * Features:
 * - Email input with validation
 * - Success state showing confirmation message
 * - Link to return to login page
 * - Consistent styling with other auth pages
 * - Error handling for invalid emails or API failures
 */
const ForgotPassword = ({ onSwitchToLogin }) => {
  return (
    <div className="w-full">
      {/* Render the ForgotPasswordForm component with props */}
      <ForgotPasswordForm onSwitchToLogin={onSwitchToLogin} />
    </div>
  );
};

export default ForgotPassword;