// src/screens/EditBook.jsx
import React, { useState, useEffect } from 'react';
import { bookApi } from '../services/apiServices';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/EditBook.css'

const EditBook = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    author: '',
    category: '',
    description: '',
    published_date: '',
    isbn: '',
    total_copies: '',
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const cats = await bookApi.getCategories().then(r => r.data);
        setCategories(cats);
        const detail = await bookApi.getBookDetails(bookId).then(r => r.data);
        const b = detail.book;
        // Ustalenie categoryId
        let categoryId = '';
        if (typeof b.category === 'object') categoryId = String(b.category.id);
        else categoryId = String(b.category);
        setForm({
          title: b.title || '',
          author: b.author || '',
          category: categoryId,
          description: b.description || '',
          published_date: b.published_date || '',
          isbn: b.isbn || '',
          total_copies: String(b.total_copies || ''),
        });
      } catch (err) {
        alert(err.response?.data?.detail || 'Błąd ładowania');
        navigate(-1);
      } finally {
        setLoading(false);
      }
    })();
  }, [bookId, navigate]);

  const handleChange = (name) => (e) =>
    setForm((f) => ({ ...f, [name]: e.target.value }));

  const handleSubmit = async () => {
    const { title, author, category, isbn, total_copies } = form;
    if (!title || !author || !category || !isbn || !total_copies) {
      alert('Wypełnij wszystkie pola');
      return;
    }
    try {
      await bookApi.editBook(bookId, {
        ...form,
        total_copies: parseInt(total_copies, 10),
      });
      alert('Zaktualizowano książkę');
      navigate(`/book-employee/${bookId}`);
    } catch (err) {
      alert(err.response?.data?.detail || 'Błąd aktualizacji');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Usuń tę książkę?')) return;
    try {
      await bookApi.deleteBook(bookId);
      alert('Usunięto książkę');
      navigate('/manage-books');
    } catch (err) {
      alert(err.response?.data?.detail || 'Błąd usuwania');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span>Ładowanie…</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Nagłówek */}
      <header className="bg-blue-800 text-white flex items-center p-4">

        <button onClick={() => navigate(-1)} className="mr-4 text-2xl">
          ←
        </button>
        <h1 className="header-title">Edytuj książkę</h1>

      </header>

      {/* Formularz */}
      <div className="bg-white rounded-lg shadow p-6 max-w-xl mx-auto space-y-4">
        <input
          type="text"
          placeholder="Tytuł"
          value={form.title}
          onChange={handleChange('title')}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Autor"
          value={form.author}
          onChange={handleChange('author')}
          className="w-full border rounded px-3 py-2"
        />
        <select
          value={form.category}
          onChange={handleChange('category')}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Wybierz kategorię</option>
          {categories.map((cat) => (
            <option key={cat.id} value={String(cat.id)}>
              {cat.name}
            </option>
          ))}
        </select>
        <textarea
          placeholder="Opis"
          value={form.description}
          onChange={handleChange('description')}
          className="w-full border rounded px-3 py-2 h-24"
        />
        <input
          type="date"
          value={form.published_date}
          onChange={handleChange('published_date')}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="ISBN"
          value={form.isbn}
          onChange={handleChange('isbn')}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="number"
          placeholder="Liczba egzemplarzy"
          value={form.total_copies}
          onChange={handleChange('total_copies')}
          className="w-full border rounded px-3 py-2"
        />

        <div className="flex space-x-4 mt-4">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Zapisz
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            Usuń
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBook;
