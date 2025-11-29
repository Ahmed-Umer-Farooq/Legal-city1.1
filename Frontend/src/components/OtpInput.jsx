import React, { useState, useRef, useEffect } from 'react';

const OtpInput = ({ length = 6, onComplete, onChange, disabled = false, error = false }) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }

    // Call onChange callback
    if (onChange) {
      onChange(newOtp.join(''));
    }

    // Call onComplete if all digits are filled
    if (newOtp.every(digit => digit !== '') && onComplete) {
      onComplete(newOtp.join(''));
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, length);
    const newOtp = [...otp];

    for (let i = 0; i < pasteData.length; i++) {
      if (!isNaN(pasteData[i])) {
        newOtp[i] = pasteData[i];
      }
    }

    setOtp(newOtp);

    // Focus the next empty input or the last one
    const nextIndex = newOtp.findIndex(digit => digit === '');
    if (nextIndex !== -1) {
      inputRefs.current[nextIndex].focus();
    } else {
      inputRefs.current[length - 1].focus();
    }

    if (onChange) {
      onChange(newOtp.join(''));
    }

    if (newOtp.every(digit => digit !== '') && onComplete) {
      onComplete(newOtp.join(''));
    }
  };

  const clearOtp = () => {
    setOtp(new Array(length).fill(''));
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
    if (onChange) {
      onChange('');
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex space-x-3 md:space-x-4">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            disabled={disabled}
            className={`w-12 h-12 md:w-14 md:h-14 text-center text-2xl font-bold border-2 rounded-lg transition-all duration-200 focus:outline-none ${
              error
                ? 'border-red-500 focus:border-red-500'
                : digit
                ? 'border-[#00a8cc] bg-gray-50 focus:border-[#00a8cc]'
                : 'border-gray-300 focus:border-[#00a8cc]'
            } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
            maxLength={1}
          />
        ))}
      </div>
      {error && (
        <button
          onClick={clearOtp}
          className="text-sm text-red-600 hover:text-red-800 underline"
          disabled={disabled}
        >
          Clear and try again
        </button>
      )}
    </div>
  );
};

export default OtpInput;
