import React from 'react';

const PasswordStrengthIndicator = ({ password }) => {
  const getStrength = (pwd) => {
    let strength = 0;
    const checks = {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /\d/.test(pwd),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
    };

    strength = Object.values(checks).filter(Boolean).length;

    return {
      level: strength,
      checks,
      color: strength <= 2 ? 'bg-red-500' : strength <= 3 ? 'bg-yellow-500' : 'bg-green-500',
      text: strength <= 2 ? 'Weak' : strength <= 3 ? 'Medium' : 'Strong'
    };
  };

  const strength = getStrength(password);

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
            style={{ width: `${(strength.level / 5) * 100}%` }}
          ></div>
        </div>
        <span className={`text-xs font-medium ${strength.level <= 2 ? 'text-red-500' : strength.level <= 3 ? 'text-yellow-600' : 'text-green-600'}`}>
          {strength.text}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-1 text-xs">
        <div className={`flex items-center gap-1 ${strength.checks.length ? 'text-green-600' : 'text-gray-400'}`}>
          <span className={strength.checks.length ? '✓' : '○'}></span>
          8+ characters
        </div>
        <div className={`flex items-center gap-1 ${strength.checks.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
          <span className={strength.checks.uppercase ? '✓' : '○'}></span>
          Uppercase
        </div>
        <div className={`flex items-center gap-1 ${strength.checks.lowercase ? 'text-green-600' : 'text-gray-400'}`}>
          <span className={strength.checks.lowercase ? '✓' : '○'}></span>
          Lowercase
        </div>
        <div className={`flex items-center gap-1 ${strength.checks.number ? 'text-green-600' : 'text-gray-400'}`}>
          <span className={strength.checks.number ? '✓' : '○'}></span>
          Number
        </div>
        <div className={`flex items-center gap-1 ${strength.checks.special ? 'text-green-600' : 'text-gray-400'}`}>
          <span className={strength.checks.special ? '✓' : '○'}></span>
          Special char
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
