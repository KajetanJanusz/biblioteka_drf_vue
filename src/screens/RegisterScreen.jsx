import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authService';

const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !email || !password) {
      alert('Proszę wypełnić wszystkie wymagane pola');
      return;
    }

    if (password !== confirmPassword) {
      alert('Hasła nie są takie same');
      return;
    }

    setIsLoading(true);
    try {
      await register({ username, email, password, first_name: firstName, last_name: lastName });
      alert('Możesz teraz zalogować się do swojego konta');
      navigate('/');
    } catch (error) {
      alert(error.response?.data?.detail || 'Wystąpił błąd podczas rejestracji');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2c3e50] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-[#f9f7f1] p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold font-serif text-[#2c3e50] mb-2">Rejestracja</h1>
          <p className="text-gray-600 mb-8">Utwórz nowe konto</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Nazwa użytkownika
            </label>
            <input
              id="username"
              name="username"
              type="text"
              className="h-12 w-full px-3 py-2 border border-[#d1c7b7] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e88e5]"
              placeholder="Wybierz nazwę użytkownika"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="h-12 w-full px-3 py-2 border border-[#d1c7b7] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e88e5]"
              placeholder="Podaj adres e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              Imię
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              className="h-12 w-full px-3 py-2 border border-[#d1c7b7] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e88e5]"
              placeholder="Wpisz swoje imię"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Nazwisko
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              className="h-12 w-full px-3 py-2 border border-[#d1c7b7] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e88e5]"
              placeholder="Wpisz swoje nazwisko"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Hasło
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="h-12 w-full px-3 py-2 border border-[#d1c7b7] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e88e5]"
              placeholder="Utwórz hasło"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Powtórz hasło
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className="h-12 w-full px-3 py-2 border border-[#d1c7b7] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e88e5]"
              placeholder="Wpisz ponownie hasło"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="pt-2">
            <button
              onClick={handleRegister}
              disabled={isLoading}
              className="w-full bg-[#1e88e5] py-3 rounded-md text-white font-bold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            >
              {isLoading ? (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                </div>
              ) : (
                'Zarejestruj się'
              )}
            </button>
          </div>
        </div>

        <div className="flex justify-center mt-5">
          <span className="text-gray-600">Masz już konto?</span>
          <button 
            onClick={() => navigate('/')} 
            className="ml-1 text-[#1e88e5] font-bold hover:underline"
          >
            Zaloguj się
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;