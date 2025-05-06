import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../services/apiServices'; // Upewnij się, że ścieżka jest poprawna
import '../styles/AddUser.css'

const AddUser = () => {
  // Stan formularza zgodny z interfejsem UserData
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    is_employee: false, // Domyślnie nie jest pracownikiem
    is_active: true,    // Domyślnie aktywny
  });
  const [error, setError] = useState(''); // Stan do obsługi błędów

  const navigate = useNavigate();

  // Handler zmian dla inputów tekstowych i checkboxów
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value, // Obsługa checkboxów
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Zapobiegaj przeładowaniu strony
    setError(''); // Resetuj błąd

    // Prosta walidacja wymaganych pól
    if (!form.username || !form.email || !form.password || !form.first_name || !form.last_name) {
      const msg = 'Pola: Nazwa użytkownika, Email, Hasło, Imię i Nazwisko są wymagane!';
      setError(msg);
      alert(msg); // Alert jako fallback
      return;
    }

    try {
      // Dane są już w poprawnym formacie (boolean dla checkboxów)
      const userData = { ...form };

      console.log("Submitting user data:", userData);
      await userApi.addUser(userData); // Wywołanie API z userApi
      alert('Sukces! Użytkownik został dodany pomyślnie.');
      navigate('/manage-users'); // Przekierowanie po sukcesie (sprawdź ścieżkę w App.jsx)
    } catch (err) {
      console.error('Błąd przy dodawaniu użytkownika:', err);
      // Lepsze wyciąganie wiadomości błędu z odpowiedzi API
      const errorMsg = err.response?.data?.detail || err.response?.data?.username?.[0] || err.response?.data?.email?.[0] || 'Nie udało się dodać użytkownika. Spróbuj ponownie.';
      setError(errorMsg);
      alert(`Błąd: ${errorMsg}`); // Alert jako fallback
    }
  };

  return (
    // Używamy fragmentu <>...</>, aby uniknąć dodatkowego diva
    <>
      {/* Nagłówek */}
      {/* <div style={{ display: 'flex', alignItems: 'center', padding: '15px', backgroundColor: '#eee' }}>
        <button onClick={() => navigate(-1)} aria-label="Wróć" style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', marginRight: '15px' }}>
          ←
        </button>
        <h2>Dodaj użytkownika</h2>
      </div> */}
       <div className="min-h-screen bg-gray-100 p-4">
          {/* Przycisk Wstecz */}
          <header className="bg-blue-800 text-white flex items-center p-4">
          <button onClick={() => navigate(-1)} className="mr-4 text-2xl">←</button>
          <h1 className="header-title">Dodaj uzytkownika</h1>
          </header>
          

      {/* Kontener formularza */}
        <form onSubmit={handleSubmit} className="add-user-form">
          {/* Wyświetlanie błędu */}
          {error && <p className="error-message">{error}</p>} {/* Wyświetlanie błędów */}

          <div className="bg-white rounded-lg shadow p-6 max-w-xl mx-auto space-y-4">

          {/* Pole Nazwa użytkownika */}
          <div className="form-group">
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Nazwa uzytkownika"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          {/* Pole Imię */}
          <div className="form-group">
            <input
              type="text"
              id="first_name"
              name="first_name"
              placeholder="Imię"
              value={form.first_name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Pole Nazwisko */}
          <div className="form-group">
            <input
              type="text"
              id="last_name"
              name="last_name"
              placeholder="Nazwisko"
              value={form.last_name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Pole Email */}
          <div className="form-group">
            <input
              type="email" // Użycie typu email dla walidacji przeglądarki
              id="email"
              name="email"
              placeholder="E-mail"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Pole Hasło */}
          <div className="form-group">
            <input
              type="password" // Typ password maskuje wpisywany tekst
              id="password"
              name="password"
              placeholder="Hasło"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Pole Telefon */}
          <div className="form-group">
            <input
              type="tel" // Typ tel może być pomocny na urządzeniach mobilnych
              id="phone"
              name="phone"
              placeholder="Numer telefonu"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          {/* Checkbox Is Employee */}
          <div className="form-group">
            <input
              type="checkbox"
              id="is_employee"
              name="is_employee"
              checked={form.is_employee}
              onChange={handleChange}
            />
            <label htmlFor="is_employee">Jest pracownikiem?</label>
          </div>

          {/* Checkbox Is Active - często nie chcemy dawać tej opcji przy tworzeniu */}
          {/* Możesz to ukryć lub usunąć, jeśli użytkownik ma być zawsze aktywny przy tworzeniu */}
          {/* <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
              style={{ marginRight: '10px' }}
            />
            <label htmlFor="is_active">Jest aktywny?</label>
          </div> */}
           {/* Domyślnie is_active=true jest ustawione w stanie, więc nie potrzeba checkboxa, jeśli zawsze ma być true przy tworzeniu */}


          {/* Przycisk Zapisz */}
          <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Zapisz użytkownika
          </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddUser;