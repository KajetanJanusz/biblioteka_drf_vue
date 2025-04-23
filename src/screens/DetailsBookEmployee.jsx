import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookApi } from '../services/apiServices';

const BookDetails = () => {
  const [bookDetails, setBookDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const { bookId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookDetails();
  }, [bookId]);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      const response = await bookApi.getBookDetails(bookId);
      setBookDetails(response.data);
    } catch (error) {
      alert(
        error.response?.data?.detail || 'Failed to fetch book details'
      );
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const getCoverUrl = (book) =>
    book?.isbn
      ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`
      : 'https://via.placeholder.com/150x220?text=No+Cover';

  const borrowBook = async () => {
    try {
      // Show loading indicator
      setLoading(true);
      
      // Call the appropriate API method
      await bookApi.borrowBook(bookId);
      
      // Show success notification
      alert(`You've borrowed "${bookDetails.book.title}"`);
      
      // Refresh book data to show updated number of available copies
      fetchBookDetails();
      
    } catch (error) {
      // Handle errors
      alert(
        error.response?.data?.detail || 'Failed to borrow the book'
      );
    } finally {
      // End loading
      setLoading(false);
    }
  };

  // Function to render star rating
  const renderStarRating = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span 
          key={i} 
          className={i <= rating ? "text-yellow-500" : "text-gray-300"}
        >
          ★
        </span>
      );
    }
    return <div className="flex">{stars}</div>;
  };

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-800">
        <div className="bg-white p-4 rounded-lg">
          <div className="flex items-center mb-4">
            <button onClick={() => navigate(-1)} className="mr-4 text-3xl font-bold">
              ←
            </button>
            <h1 className="text-2xl font-bold">Szczegóły książki</h1>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!bookDetails) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-800">
        <div className="bg-white p-8 rounded-lg max-w-md w-full">
          <div className="flex items-center mb-6">
            <button onClick={() => navigate(-1)} className="mr-4 text-3xl font-bold">
              ←
            </button>
            <h1 className="text-2xl font-bold">Szczegóły książki</h1>
          </div>
          <p className="text-red-700 text-lg italic text-center">Książka nieznaleziona</p>
        </div>
      </div>
    );
  }

  const { book, opinions, available_copies, can_add_notifications } = bookDetails;

  return (
    <div className="min-h-screen bg-slate-800">
      <div className="container mx-auto p-4">
        {/* Header with Back Button */}
        <div className="flex items-center bg-slate-800 py-4 text-paper">
          <button onClick={() => navigate(-1)} className="mr-4 text-3xl font-bold text-paper">
            ←
          </button>
          <h1 className="text-2xl font-bold font-serif text-paper">Szczegóły książki</h1>
        </div>

        <div className="overflow-auto">
          {/* Book Information Card */}
          <div className="bg-white m-4 rounded-xl p-5 shadow-lg border-l-4 border-l-slate-800">
            <div className="flex justify-center mb-5">
              <div className="w-36 h-52 bg-amber-50 rounded-lg flex justify-center items-center border border-amber-200 shadow-md">
                <img
                  src={getCoverUrl(book)}
                  alt={book.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-800 text-center mb-2 font-serif">{book.title}</h2>
            <p className="text-lg text-amber-800 text-center mb-5 italic font-serif"> {book.author}</p>
            
            <div className="flex justify-around mb-5 px-2">
              <span className="bg-amber-50 px-4 py-2 rounded-2xl border border-amber-200 min-w-24 text-center">
                <span className="text-sm font-semibold text-amber-800">{book.category}</span>
              </span>
              
              <span className={`px-4 py-2 rounded-2xl min-w-28 text-center ${
                available_copies > 0 ? 'bg-green-600' : 'bg-red-600'
              }`}>
                <span className="text-sm font-bold text-white">
                  {available_copies > 0 
                    ? `${available_copies} z ${book.total_copies} ${
                        available_copies === 1 
                          ? 'Dostępna' 
                          : available_copies >= 2 && available_copies <= 4 
                          ? 'Dostępne' 
                          : 'Dostępnych'
                      }`
                    : 'Niedostępna'}
                </span>
              </span>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-800 mb-3 mt-5 font-serif border-b border-amber-100 pb-2">Opis</h3>
              <p className="text-base text-gray-700 leading-relaxed mb-4">{book.description}</p>
              
              <h3 className="text-xl font-bold text-slate-800 mb-3 mt-5 font-serif border-b border-amber-100 pb-2">Szczegóły publikacji</h3>
              <div className="flex border-b border-amber-100 py-2 mb-3">
                <span className="w-24 text-amber-800 font-semibold">Data wydania:</span>
                <span className="flex-1 text-gray-700">{formatDate(book.published_date)}</span>
              </div>
              <div className="flex border-b border-amber-100 py-2 mb-3">
                <span className="w-24 text-amber-800 font-semibold">ISBN:</span>
                <span className="flex-1 text-gray-700">{book.isbn}</span>
              </div>
            </div>

            {/* Notification button - commented out as in the React Native version */}
            {/*
            {can_add_notifications && (
              <button 
                className="w-full bg-yellow-600 py-3 rounded-3xl mb-4 shadow-lg"
                onClick={() => alert('Powiadomienie', 'Zostaniesz powiadomiony, gdy książka będzie dostępna')}
              >
                <span className="text-white font-bold text-center">
                  Powiadom mnie, gdy będzie dostępna
                </span>
              </button>
            )}
            */}

            {/* Borrow Book Button - commented out as in React Native version */}
            {/*
            <button 
              className={`w-full py-3 rounded-3xl shadow-lg ${
                available_copies === 0 ? 'bg-gray-400' : 'bg-slate-800'
              }`}
              disabled={available_copies === 0}
              onClick={borrowBook}
            >
              <span className="text-white font-bold text-center">
                {available_copies > 0 ? 'Wypożycz książkę' : 'Aktualnie niedostępna'}
              </span>
            </button>
            */}
            
            {/* Edit Book Button - as in the React Native version */}
            <button 
              className="w-full bg-slate-800 py-3 rounded-3xl shadow-lg"
              onClick={() => navigate(`/edit-book/${bookId}`)}
            >
              <span className="text-white font-bold text-center">Edytuj książkę</span>
            </button>
          </div>
          

          {/* Reviews Section */}
          <div className="bg-white m-4 rounded-xl p-5 shadow-lg mb-6 border-l-4 border-l-yellow-600">
            <h3 className="text-xl font-bold text-slate-800 mb-3 mt-5 font-serif border-b border-amber-100 pb-2">
              Opinie ({opinions.length})
            </h3>
            
            {opinions.length > 0 ? (
              <div className="space-y-4">
                {opinions.map((item, index) => (
                  <div key={`opinion-${item.id || index}`} className="border-b border-amber-100 py-4">
                    <div className="flex justify-between items-center mb-2">
                      {renderStarRating(item.rate)}
                      <span className="text-sm italic text-amber-800">{formatDate(item.created_at)}</span>
                    </div>
                    <p className="text-base text-gray-700 leading-relaxed">{item.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-base italic text-amber-800 text-center py-5 font-serif">Brak opinii</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;