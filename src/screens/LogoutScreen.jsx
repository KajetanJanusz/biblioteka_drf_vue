import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Remove authentication tokens from local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    // You might also want to remove any other user-related data
    localStorage.removeItem('userData');
    
    // Navigate to login page with a logout message
    navigate('/', { state: { message: 'Wylogowano pomyślnie' } });
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <h2 className="text-xl text-gray-800">Wylogowywanie...</h2>
    </div>
  );
};

export default LogoutScreen;