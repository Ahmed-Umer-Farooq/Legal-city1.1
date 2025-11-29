import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LawyerDirectory from '../public/LawyerDirectory.js';

const Directory = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Set return path for back navigation
    localStorage.setItem('returnPath', '/user/lawyer-directory');
    // Mark that user came from dashboard
    localStorage.setItem('navigatedFromDashboard', 'true');
    
    return () => {
      // Clean up when component unmounts
      localStorage.removeItem('navigatedFromDashboard');
    };
  }, []);

  return (
    <div className="min-h-screen">
      <LawyerDirectory />
    </div>
  );
};

export default Directory;