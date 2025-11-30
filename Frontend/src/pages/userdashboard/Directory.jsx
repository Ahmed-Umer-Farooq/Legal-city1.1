import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LawyerDirectory from '../public/LawyerDirectory.js';

const Directory = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('returnPath', '/user/lawyer-directory');
    localStorage.setItem('navigatedFromDashboard', 'true');
  }, []);

  return (
    <div className="min-h-screen">
      <LawyerDirectory />
    </div>
  );
};

export default Directory;