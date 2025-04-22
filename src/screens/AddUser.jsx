import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../services/apiServices'; // Upewnij się, że ścieżka jest poprawna

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
      <div style={{ display: 'flex', alignItems: 'center', padding: '15px', backgroundColor: '#eee' }}> {/* Przykładowy inline styl dla nagłówka */}
        <button onClick={() => navigate(-1)} aria-label="Wróć" style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', marginRight: '15px' }}>
          ←
        </button>
        <h2>Dodaj użytkownika</h2>
      </div>

      {/* Kontener formularza */}
      <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ccc' }}> {/* Przykładowy inline styl dla kontenera */}
        <form onSubmit={handleSubmit}>
          {/* Wyświetlanie błędu */}
          {error && <p style={{ color: 'red', border: '1px solid red', padding: '10px', marginBottom: '15px' }}>{error}</p>}

          {/* Pole Nazwa użytkownika */}
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="username">Nazwa użytkownika *</label>
            <input
              type="text"
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} // Przykładowe style inline
            />
          </div>

          {/* Pole Imię */}
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="first_name">Imię *</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>

          {/* Pole Nazwisko */}
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="last_name">Nazwisko *</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>

          {/* Pole Email */}
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="email">Email *</label>
            <input
              type="email" // Użycie typu email dla walidacji przeglądarki
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>

          {/* Pole Hasło */}
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="password">Hasło *</label>
            <input
              type="password" // Typ password maskuje wpisywany tekst
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>

          {/* Pole Telefon */}
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="phone">Telefon</label>
            <input
              type="tel" // Typ tel może być pomocny na urządzeniach mobilnych
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>

          {/* Checkbox Is Employee */}
          <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              id="is_employee"
              name="is_employee"
              checked={form.is_employee}
              onChange={handleChange}
              style={{ marginRight: '10px' }}
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
          <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
            Zapisz użytkownika
          </button>
        </form>
      </div>
    </>
  );
};

export default AddUser;