// src/screens/BookDetails.jsx
import React, { useState, useEffect } from 'react';
import { bookApi } from '../services/apiServices';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/BookDetails.css'

const BookDetails = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [bookDetails, setBookDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const resp = await bookApi.getBookDetails(bookId);
        setBookDetails(resp.data);
      } catch (err) {
        alert(err.response?.data?.detail || 'Nie udało się pobrać szczegółów');
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [bookId, navigate]);

  const borrowBook = async () => {
    if (!bookDetails) return;
    setLoading(true);
    try {
      await bookApi.borrowBook(bookId);
      alert(`Wypożyczono książkę "${bookDetails.book.title}"`);
      const resp = await bookApi.getBookDetails(bookId);
      setBookDetails(resp.data);
    } catch (err) {
      alert(err.response?.data?.detail || 'Błąd wypożyczenia');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const getCoverUrl = (isbn) =>
    isbn
      ? `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`
      : 'https://via.placeholder.com/150x220?text=No+Cover';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span>Ładowanie…</span>
      </div>
    );
  }

  if (!bookDetails) {
    return (
      <div className="p-4 text-center">
        <p>Nie znaleziono książki.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Wróć
        </button>
      </div>
    );
  }

  const {
    book,
    opinions,
    available_copies,
    can_add_notifications,
  } = bookDetails;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <header className="bg-blue-800 text-white flex items-center p-4">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 text-2xl"
        >
          ←
        </button>
        <h1 className="text-2xl font-bold">Powrót</h1>
      </div>
      </header>

      {/* Book Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row">
          <img
            src={getCoverUrl(book.isbn)}
            alt="Okładka"
            className="w-40 h-56 object-cover rounded mb-4 md:mb-0 md:mr-6"
          />
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-2">{book.title}</h2>
            <p className="italic text-gray-600 mb-4">{book.author}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">
                {book.category}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm text-white ${
                  available_copies > 0 ? 'bg-green-600' : 'bg-red-600'
                }`}
              >
                {available_copies > 0
                  ? `${available_copies} / ${book.total_copies} dostępnych`
                  : 'Brak dostępnych'}
              </span>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-1">Opis</h3>
              <p className="text-gray-700">{book.description}</p>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-1">Szczegóły publikacji</h3>
              <p>
                <strong>Data wydania:</strong> {formatDate(book.published_date)}
              </p>
              <p>
                <strong>ISBN:</strong> {book.isbn}
              </p>
            </div>

            {can_add_notifications && (
              <button
                onClick={() => alert('Powiadomienie ustawione')}
                className="mb-3 px-4 py-2 bg-yellow-500 text-white rounded"
              >
                Powiadom mnie, gdy dostępna
              </button>
            )}

            <button
              onClick={borrowBook}
              disabled={available_copies === 0}
              className={`px-4 py-2 rounded text-white ${
                available_copies > 0
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {available_copies > 0 ? 'Wypożycz książkę' : 'Niedostępna'}
            </button>
          </div>
        </div>
      </div>

      {/* Opinions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">
          Opinie ({opinions.length})
        </h3>
        {opinions.length > 0 ? (
          <div className="space-y-4">
            {opinions.map((op) => (
              <div key={op.id} className="border-b pb-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={
                          i < op.rate ? 'text-yellow-500' : 'text-gray-300'
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatDate(op.created_at)}
                  </span>
                </div>
                <p className="text-gray-700">{op.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="italic text-gray-600">Brak opinii</p>
        )}
      </div>
    </div>
  );
};

export default BookDetails;