// src/screens/BookList.jsx
import React, { useState, useEffect } from 'react';
import { bookApi } from '../services/apiServices';
import { useNavigate } from 'react-router-dom';
import '../styles/ListBook.css'

const categoryMap = {
  1: 'Fantastyka naukowa',
  2: 'Fantastyka',
  3: 'Historia',
  4: 'Biografia',
  5: 'Literatura',
  // ...inne kategorie
};

const BookList = () => {
  const [books, setBooks]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [menuOpen, setMenuOpen]       = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const resp = await bookApi.getBooks();
        setBooks(resp.data.books);
      } catch (err) {
        alert(err.response?.data?.detail || 'Błąd pobierania książek');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleMenu = () => setMenuOpen(o => !o);

  const categories = [...new Set(books.map(b => b.category))];

  const filtered = books.filter(b => {
    const q = searchQuery.toLowerCase();
    const matchText = b.title?.toLowerCase().includes(q) || b.author?.toLowerCase().includes(q);
    const matchCat  = selectedCategory === null || b.category === selectedCategory;
    return matchText && matchCat;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <header className="bg-blue-800 text-white flex items-center p-4">
        <button onClick={toggleMenu} className="mr-4">
          <span className="block w-6 h-0.5 bg-white mb-1" />
          <span className="block w-6 h-0.5 bg-white mb-1" />
          <span className="block w-6 h-0.5 bg-white" />
        </button>
        <h1 className="text-2xl font-bold">Książki</h1>
      </header>

      {/* SIDE MENU */}
      {menuOpen && (
        <div className="fixed inset-0 flex z-10">
          <div
            className="flex-1 bg-black opacity-50"
            onClick={toggleMenu}
          />
          <nav className="w-64 bg-white p-4">
            <h2 className="text-xl mb-4">Menu</h2>
            <button onClick={() => {navigate('/dashboard-customer'); toggleMenu();}} className="block mb-2">Strona główna</button>
            <button onClick={() => {navigate('/books'); toggleMenu();}} className="block mb-2">Książki</button>
            <button onClick={() => {navigate('/logout'); toggleMenu();}} className="block">Wyloguj</button>
          </nav>
        </div>
      )}

      {/* SEARCH */}
      <div className="p-4 bg-white shadow">
        <input
          type="text"
          placeholder="Szukaj po tytule lub autorze..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* CATEGORIES */}
      <div className="px-4 py-2 flex overflow-x-auto gap-2 bg-white shadow">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full ${selectedCategory===null ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Wszystkie
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full ${
              selectedCategory===cat ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            {categoryMap[cat] || `Kat. ${cat}`}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <main className="p-4">
        {loading ? (
          <div className="flex justify-center py-20">
            <span>Ładowanie…</span>
          </div>
        ) : (
          <>
            <p className="mb-4 italic text-gray-600">
              Znaleziono {filtered.length}{' '}
              {filtered.length===1 ? 'książkę'
                : filtered.length>=2 && filtered.length<=4 ? 'książki'
                : 'książek'}
            </p>

            <div className="grid grid-cols-2 gap-4">
              {filtered.length===0 && (
                <p className="col-span-2 text-center italic text-gray-600">
                  Brak wyników
                </p>
              )}
              {filtered.map(book => {
                const available = book.available_copies>0;
                return (
                  <div
                    key={book.id}
                    onClick={() => navigate(`/book/${book.id}`)}
                    className={`p-4 bg-white rounded shadow cursor-pointer ${
                      !available && 'opacity-70 border-l-4 border-red-600'
                    }`}
                  >
                    <h3 className="font-bold mb-2 text-center">{book.title}</h3>
                    <div className="text-sm text-center mb-2">
                      {categoryMap[book.category] || `Kat. ${book.category}`}
                    </div>
                    <div className={`inline-block px-2 py-1 text-xs text-white rounded ${
                      available ? 'bg-green-600' : 'bg-red-600'
                    }`}>
                      {available
                        ? `${book.available_copies} ${book.available_copies===1?'dostępna':'dostępnych'}`
                        : 'niedostępna'}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default BookList;
