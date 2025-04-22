import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookApi } from '../services/apiServices';

const AddBook = () => {
  const [form, setForm] = useState({
    title: '',
    author: '',
    category: '', // Będzie przechowywać ID kategorii
    published_date: '', // Format YYYY-MM-DD
    isbn: '',
    total_copies: '',
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(''); // Lepsze zarządzanie błędami formularza

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(''); // Resetuj błąd przy ładowaniu
      const response = await bookApi.getCategories();
      console.log("Categories response:", response.data);
      // Upewnij się, że response.data jest tablicą kategorii { id: ..., name: ... }
      if (Array.isArray(response.data)) {
         setCategories(response.data);
      } else {
          console.error('Otrzymano nieprawidłowy format kategorii:', response.data);
          setCategories([]); // Ustaw pustą tablicę w razie problemów
          setError('Nie udało się wczytać formatu kategorii.');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Nie udało się pobrać kategorii. Spróbuj ponownie później.');
      alert('Błąd: Nie udało się pobrać kategorii.'); // Alert jako fallback
    } finally {
      setLoading(false);
    }
  };

  // Uogólniony handler dla inputów, selecta, textarea itp.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Zapobiegaj domyślnemu przeładowaniu strony przez formularz HTML
    setError(''); // Resetuj błąd przed wysłaniem

    // Prosta walidacja
    if (!form.title || !form.author || !form.category || !form.isbn || !form.total_copies || !form.published_date) {
      const msg = 'Wszystkie pola muszą być wypełnione!';
      setError(msg);
      alert(msg); // Alert jako fallback
      return;
    }

    // Sprawdzenie czy total_copies jest liczbą
    const totalCopiesInt = parseInt(form.total_copies, 10);
    if (isNaN(totalCopiesInt) || totalCopiesInt <= 0) {
        const msg = 'Liczba egzemplarzy musi być poprawną liczbą dodatnią.';
        setError(msg);
        alert(msg); // Alert jako fallback
        return;
    }

    try {
      const bookData = {
        ...form,
        total_copies: totalCopiesInt,
        // Upewnij się, że `category` wysyłasz jako ID (jeśli API tego oczekuje)
        // Jeśli API oczekuje obiektu kategorii, dostosuj to tutaj.
        // W tym przykładzie zakładam, że API oczekuje ID kategorii.
      };

      console.log("Submitting book data:", bookData);
      await bookApi.addBook(bookData);
      alert('Sukces', 'Książka została dodana pomyślnie!');
      navigate('/manage-books'); // Użyj ścieżki zdefiniowanej w App.jsx
    } catch (err) {
      console.error('Błąd przy dodawaniu książki:', err);
      const errorMsg = err.response?.data?.detail || 'Nie udało się dodać książki. Spróbuj ponownie.';
      setError(errorMsg);
      alert(`Błąd: ${errorMsg}`); // Alert jako fallback
    }
  };

  if (loading) {
    return (
      <div className="add-book-container loading-container">
         <div className="header">
             <button onClick={() => navigate(-1)} className="back-button">←</button>
             <h2>Dodaj książkę</h2>
         </div>
        <p>Ładowanie kategorii...</p> {/* Prosty wskaźnik ładowania */}
      </div>
    );
  }

  return (
    <div className="add-book-container">
       <div className="header">
          {/* Przycisk Wstecz */}
          <button onClick={() => navigate(-1)} className="back-button">←</button>
          <h2>Dodaj książkę</h2>
      </div>

      <form onSubmit={handleSubmit} className="add-book-form">
        {error && <p className="error-message">{error}</p>} {/* Wyświetlanie błędów */}

        <div className="form-group">
          <label htmlFor="title">Tytuł</label>
          <input
            type="text"
            id="title"
            name="title"
            className="form-input"
            placeholder="Wpisz tytuł"
            value={form.title}
            onChange={handleChange}
            required // Dodano atrybut HTML5 dla walidacji
          />
        </div>

        <div className="form-group">
          <label htmlFor="author">Autor</label>
          <input
            type="text"
            id="author"
            name="author"
            className="form-input"
            placeholder="Wpisz autora"
            value={form.author}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Kategoria</label>
          <select
            id="category"
            name="category"
            className="form-select"
            value={form.category} // Powiązanie wartości selecta ze stanem
            onChange={handleChange}
            required
          >
            <option value="" disabled>Wybierz kategorię</option>
            {categories.length > 0 ? (
                 categories.map((category) => (
                   <option key={category.id?.toString()} value={category.id?.toString()}>
                     {category.name}
                   </option>
                 ))
             ) : (
                 <option value="" disabled>Brak dostępnych kategorii</option>
             )}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="published_date">Data publikacji</label>
          <input
            type="date" // Standardowy input daty w HTML5
            id="published_date"
            name="published_date"
            className="form-input"
            value={form.published_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="isbn">ISBN</label>
          <input
            type="text"
            id="isbn"
            name="isbn"
            className="form-input"
            placeholder="Wpisz ISBN"
            value={form.isbn}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="total_copies">Liczba egzemplarzy</label>
          <input
            type="number" // Input dla liczb
            id="total_copies"
            name="total_copies"
            className="form-input"
            placeholder="Wpisz liczbę"
            value={form.total_copies}
            onChange={handleChange}
            min="1" // Walidacja HTML5
            required
          />
        </div>

        <button type="submit" className="submit-button">
          Dodaj książkę
        </button>
      </form>
    </div>
  );
};

export default AddBook;