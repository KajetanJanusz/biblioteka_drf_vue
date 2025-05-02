import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookApi } from '../services/apiServices.ts';
import '../styles/ManageBooks.css';

const ListBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null); // Dodane brakujące useRef

  useEffect(() => {
    fetchBooks();
  }, []);

  // Obsługa kliknięcia poza menu, aby je zamknąć
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && menuOpen) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await bookApi.getBooks();
      setBooks(response.data.books);
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const navigateTo = (screen) => {
    toggleMenu();
    navigate(`/${screen}`);
  };

  // Extract unique categories
  const categories = books.length > 0
    ? [...new Set(books.map(book => book.category))]
    : [];

  // Get category name (in a real app, you'd map category IDs to names)
  const getCategoryName = (categoryId) => {
    const categoryMap = {
      1: 'Fantastyka naukowa',
      2: 'Fantastyka',
      3: 'Historia',
      4: 'Biografia',
      5: 'Literatura',
      // Add more mappings as needed
    };
    return categoryMap[categoryId] || `Category ${categoryId}`;
  };

  // Filter books based on search and category
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === null || book.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header>
        <div className="header-left">
          <button 
            onClick={toggleMenu} 
            className="menu-button"
          >
            <span />
            <span />
            <span />
          </button>
          <h1>Książki</h1>
        </div>
        <button 
          className="add-book-btn"
          onClick={() => navigate('/add-book')}
        >
          <span className="icon"></span>
          Dodaj Ksiązkę
        </button>
      </header>

      {/* Side Menu */}
      {menuOpen && (
        <div className="overlay" onClick={(e) => {
          // Zatrzymaj propagację zdarzenia kliknięcia tylko na overlay
          if (e.target === e.currentTarget) {
            toggleMenu();
          }
        }}>
          <div
            ref={menuRef}
            className={`menu ${menuOpen ? 'open' : ''}`}
            onClick={(e) => e.stopPropagation()} // Zatrzymaj propagację kliknięć wewnątrz menu
          >
            <div className="menu-header">
              <h2 className="menu-title">Menu</h2>
            </div>
            <nav className="side-menu">
              <button
                onClick={() => {
                  navigate('/dashboard-employee');
                  setMenuOpen(false);
                }}
                className="block w-full text-left menu-item"
              >
                <span className="menu-item-text">Strona główna</span>
              </button>
              <button
                onClick={() => {
                  navigate('/manage-books');
                  setMenuOpen(false);
                }}
                className="block w-full text-left menu-item"
              >
                <span className="menu-item-text">Zarządzaj książkami</span>
              </button>
              <button
                onClick={() => {
                  navigate('/manage-users');
                  setMenuOpen(false);
                }}
                className="block w-full text-left menu-item"
              >
                <span className="menu-item-text">Zarządzaj użytkownikami</span>
              </button>
              <button
                onClick={() => {
                  navigate('/logout');
                  setMenuOpen(false);
                }}
                className="block w-full text-left menu-item"
              >
                <span className="menu-item-text">Wyloguj się</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Szukaj po tytule lub autorze..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Category Filter */}
      <div className="category-container">
        <div className="categories-scroll">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`category-btn ${selectedCategory === null ? 'active' : 'inactive'}`}
          >
            Wszystkie
          </button>
          {categories.map(categoryId => (
            <button
              key={`category-${categoryId}`}
              className={`category-btn ${selectedCategory === categoryId ? 'active' : 'inactive'}`}
              onClick={() => setSelectedCategory(categoryId)}
            >
              {getCategoryName(categoryId)}
            </button>
          ))}
        </div>
      </div>

      {/* Book List */}
      <main className="p-4">
        {loading ? (
          <div className="loading-container">
            <span>Ładowanie…</span>
          </div>
        ) : (
          <>
            <p className="book-count">
              Znaleziono {filteredBooks.length} {' '}
              {filteredBooks.length === 1
                ? 'książkę'
                : (filteredBooks.length >= 2 && filteredBooks.length <= 4)
                ? 'książki'
                : 'książek'}
            </p>
            
            {filteredBooks.length === 0 ? (
              <p className="empty-results">
                Brak wyników dla podanych kryteriów
              </p>
            ) : (
              <div className="books-grid">
                {filteredBooks.map((book, index) => {
                  const isAvailable = book.available_copies > 0;
                  
                  return (
                    <div 
                      key={`book-${index}`}
                      className={`book-card ${isAvailable ? 'available' : 'unavailable'}`}
                      onClick={() => navigate(`/book-employee/${book.id}`)}
                    >
                      <h3 className="book-title">{book.title}</h3>
                      
                      <div className="category-badge">
                        <span>{getCategoryName(book.category)}</span>
                      </div>
                      
                      <div className={`availability-badge ${isAvailable ? 'in-stock' : 'out-of-stock'}`}>
                        <span>
                          {isAvailable
                            ? `${book.available_copies} ${
                                book.available_copies === 1
                                  ? 'Dostępna'
                                  : book.available_copies <= 4
                                  ? 'Dostępne'
                                  : 'Dostępnych'
                              }`
                            : 'Niedostępna'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default ListBooks;