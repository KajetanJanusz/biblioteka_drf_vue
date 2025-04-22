// src/screens/LoginScreen.jsx
import React, { useState } from 'react';
import { login } from '../services/authService';
import { useNavigate, useLocation } from 'react-router-dom';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;

  const handleLogin = async () => {
    if (!username || !password) {
      alert('Wprowadź nazwę użytkownika i hasło');
      return;
    }
    setIsLoading(true);
    try {
      await login(username, password);
      navigate('/dashboard-customer', { replace: true });
    } catch (err) {
      alert(err.response?.data?.detail || 'Wystąpił błąd podczas logowania');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-2">Biblioteka</h1>
        <p className="text-center text-gray-600 mb-6">Zaloguj się do swojego konta</p>

        {message && (
          <div className="text-green-600 text-center mb-4">
            {message}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input
              type="email"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="E-mail"
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hasło</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Hasło"
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-50"
        >
          {isLoading ? 'Ładowanie…' : 'Zaloguj'}
        </button>

        <div className="text-center mt-4">
          <span>Nie masz jeszcze konta? </span>
          <button
            onClick={() => navigate('/register')}
            className="text-blue-600 font-semibold hover:underline"
          >
            Zarejestruj się
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
