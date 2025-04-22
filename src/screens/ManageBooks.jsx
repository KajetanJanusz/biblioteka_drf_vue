import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookApi } from '../services/apiServices.ts';

const ListBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

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
    <div className="bg-[#f9f7f1] min-h-screen">
      {/* Header */}
      <div className="bg-[#2c3e50] text-[#f9f7f1] p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center">
          <button 
            onClick={toggleMenu} 
            className="p-2 focus:outline-none mr-4"
          >
            <div className="space-y-1">
              <div className="w-6 h-0.5 bg-[#f9f7f1]"></div>
              <div className="w-6 h-0.5 bg-[#f9f7f1]"></div>
              <div className="w-6 h-0.5 bg-[#f9f7f1]"></div>
            </div>
          </button>
          <h1 className="text-2xl font-bold font-serif">Książki</h1>
        </div>
        <button 
          className="bg-[#2c3e50] py-2 px-4 rounded-full text-[#f9f7f1] font-bold shadow-md"
          onClick={() => navigate('/add-book')}
        >
          + Dodaj książkę
        </button>
      </div>

      {/* Side Menu (when open) */}
      {menuOpen && (
        <div className="fixed inset-0 z-20 flex">
          <div 
            className="bg-black bg-opacity-60 flex-grow"
            onClick={toggleMenu}
          ></div>
          <div className="bg-[#f9f7f1] w-4/5 md:w-1/4 shadow-lg">
            <div className="bg-[#2c3e50] p-6">
              <h2 className="text-2xl font-bold text-[#f9f7f1] font-serif">Menu</h2>
            </div>
            <div>
              <button 
                className="w-full py-4 px-6 text-left border-b border-[#e8e0d5] text-[#2c3e50] font-sans hover:bg-gray-100"
                onClick={() => navigateTo('dashboard-employee')}
              >
                Strona główna
              </button>
              <button 
                className="w-full py-4 px-6 text-left border-b border-[#e8e0d5] text-[#2c3e50] font-sans hover:bg-gray-100"
                onClick={() => navigateTo('manage-books')}
              >
                Zarządzaj książkami
              </button>
              <button 
                className="w-full py-4 px-6 text-left border-b border-[#e8e0d5] text-[#2c3e50] font-sans hover:bg-gray-100"
                onClick={() => navigateTo('manage-users')}
              >
                Zarządzaj użytkownikami
              </button>
              <button 
                className="w-full py-4 px-6 text-left border-b border-[#e8e0d5] text-[#2c3e50] font-sans hover:bg-gray-100"
                onClick={() => navigateTo('logout')}
              >
                Wyloguj się
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="p-4 bg-white shadow-sm border-b border-[#e8e0d5]">
        <input
          className="w-full h-11 px-4 border border-[#d1c7b7] rounded-full focus:outline-none focus:ring-2 focus:ring-[#2c3e50]"
          placeholder="Szukaj książek po tytule lub autorze..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Category Filter */}
      <div className="px-4 py-2">
        <h2 className="text-lg font-bold my-3 text-[#2c3e50] font-serif">Kategorie:</h2>
        <div className="flex overflow-x-auto pb-2 hide-scrollbar">
          <button
            className={`px-4 py-2 mx-1 rounded-full border ${
              selectedCategory === null 
                ? 'bg-[#2c3e50] text-white border-[#2c3e50] font-bold' 
                : 'bg-white text-[#2c3e50] border-[#d1c7b7]'
            }`}
            onClick={() => setSelectedCategory(null)}
          >
            Wszystkie
          </button>
          {categories.map(categoryId => (
            <button
              key={`category-${categoryId}`}
              className={`px-4 py-2 mx-1 rounded-full border whitespace-nowrap ${
                selectedCategory === categoryId 
                  ? 'bg-[#2c3e50] text-white border-[#2c3e50] font-bold' 
                  : 'bg-white text-[#2c3e50] border-[#d1c7b7]'
              }`}
              onClick={() => setSelectedCategory(categoryId)}
            >
              {getCategoryName(categoryId)}
            </button>
          ))}
        </div>
      </div>

      {/* Book List */}
      <div className="px-4 py-2">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0066CC]"></div>
          </div>
        ) : (
          <>
            <p className="m-4 text-[#7d6e56] italic">
              Znaleziono {filteredBooks.length} {' '}
              {filteredBooks.length === 1
                ? 'książkę'
                : (filteredBooks.length >= 2 && filteredBooks.length <= 4)
                ? 'książki'
                : 'książek'}
            </p>
            
            {filteredBooks.length === 0 ? (
              <p className="text-center py-10 text-[#7d6e56] italic font-serif">
                Brak wyników dla podanych kryteriów
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredBooks.map((book, index) => {
                  const isAvailable = book.available_copies > 0;
                  
                  return (
                    <div 
                      key={`book-${index}`}
                      className={`bg-white p-4 rounded-lg shadow-md border-l-4 ${
                        isAvailable ? 'border-l-[#2c3e50]' : 'border-l-[#922b21] opacity-70'
                      } cursor-pointer`}
                      onClick={() => navigate(`/book-employee/${book.id}`)}
                    >
                      <h3 className="text-base font-bold text-[#2c3e50] mb-3 text-center font-serif">
                        {book.title}
                      </h3>
                      
                      <div className="bg-[#eee8dc] px-3 py-1.5 rounded-md border border-[#d1c7b7] mx-auto text-center mb-3">
                        <span className="text-xs text-[#7d6e56] font-medium">
                          {getCategoryName(book.category)}
                        </span>
                      </div>
                      
                      <div className={`px-3 py-1.5 rounded-full mx-auto text-center ${
                        isAvailable ? 'bg-[#4caf50]' : 'bg-[#f44336]'
                      }`}>
                        <span className="text-xs text-white font-bold">
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
      </div>
    </div>
  );
};

export default ListBooks;