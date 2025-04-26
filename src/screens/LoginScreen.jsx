// src/screens/LoginScreen.jsx
import React, { useState } from 'react';
import { login } from '../services/authService';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/LoginScreen.css';
import { BookOpen } from 'lucide-react';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;

  const handleLogin = async () => {
    let newErrors = {};
    if (!username) newErrors.username = 'E-mail jest wymagany';
    if (!password) newErrors.password = 'Hasło jest wymagane';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

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
    <div className="login-card">
      <div className="logo">
        <BookOpen size={40} strokeWidth={2.5} className="logo-icon text-blue-600" />
      </div>
      <h1 className="login-title">Biblioteka</h1>
      <p className="login-subtitle">Zaloguj się do swojego konta</p>

      {message && <div className="text-green-600 text-center mb-4">{message}</div>}

      <div className="form-group">
        <label className="form-label">E-mail</label>
        <input
          type="email"
          value={username}
          onChange={e => {
            setUsername(e.target.value);
            setErrors({ ...errors, username: '' });
          }}
          placeholder="E-mail"
          className={`input ${errors.username ? 'input-error' : ''}`}
        />
        {errors.username && <div className="error-text">{errors.username}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Hasło</label>
        <input
          type="password"
          value={password}
          onChange={e => {
            setPassword(e.target.value);
            setErrors({ ...errors, password: '' });
          }}
          placeholder="Hasło"
          className={`input ${errors.password ? 'input-error' : ''}`}
        />
        {errors.password && <div className="error-text">{errors.password}</div>}
      </div>

      <button
        onClick={handleLogin}
        disabled={isLoading}
        className="login-button"
      >
        {isLoading ? 'Ładowanie…' : 'Zaloguj'}
      </button>

      <div className="register">
        Nie masz jeszcze konta?{' '}
        <button onClick={() => navigate('/register')}>
          <a>Zarejestruj się</a>
        </button>
      </div>
    </div>
  );
};

export default LoginScreen;
