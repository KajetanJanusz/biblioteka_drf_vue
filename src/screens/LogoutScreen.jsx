// src/screens/LogoutScreen.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate logging out by resetting the state and navigating to the login page
    navigate('/login', { state: { message: 'Wylogowano' } });
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <h2 className="text-xl text-gray-800">Wylogowywanie...</h2>
    </div>
  );
};

export default LogoutScreen;
