// src/screens/DashboardCustomer.jsx
import React, { useEffect, useState } from 'react';
import { dashboardApi } from '../services/apiServices';
import { useNavigate } from 'react-router-dom';
import '../styles/DashboardCustomer.css'

const DashboardCustomer = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          alert('Brak tokena, zaloguj się ponownie');
          navigate('/');
          return;
        }
        const resp = await dashboardApi.getCustomerDashboard();
        setData(resp.data);
      } catch {
        navigate('/dashboard-employee');
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span>Ładowanie…</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-4 text-center italic text-gray-600">
        Błąd ładowania danych
      </div>
    );
  }

  const formatDate = (d) => new Date(d).toLocaleDateString();
  const daysRemaining = (d) => {
    const diff = Math.ceil((new Date(d).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return `${-diff} dni opóźnienia`;
    if (diff === 0) return 'Termin dziś';
    return `${diff} dni`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <header className="bg-blue-800 text-white flex items-center p-4">
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="mr-4 focus:outline-none"
        >
          <span className="block w-6 h-0.5 bg-white mb-1" />
          <span className="block w-6 h-0.5 bg-white mb-1" />
          <span className="block w-6 h-0.5 bg-white" />
        </button>
        <h1 className="text-2xl font-bold text-white">Profil czytelnika</h1>
      </header>

     {/* SIDE MENU */}
{menuOpen && (
  <div className="fixed inset-0 flex z-50">
    {/* Tło przyciemnione */}
    <div
      className="flex-1 bg-black/50"
      onClick={() => setMenuOpen(false)}
    />

    {/* Menu boczne */}
    <nav className="w-64 bg-white p-6 shadow-lg border-l border-gray-200">
      {/* Nagłówek */}
      <div className="text-lg font-semibold text-white bg-blue-700 px-4 py-2 rounded-md mb-6 shadow-sm">
        Menu
      </div>

      {/* Przyciski */}
      <button
        onClick={() => {
          navigate('/dashboard-customer');
          setMenuOpen(false);
        }}
        className="block w-full text-left px-4 py-2 mb-2 rounded-md text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition"
      >
        Strona główna
      </button>
      <button
        onClick={() => {
          navigate('/books');
          setMenuOpen(false);
        }}
        className="block w-full text-left px-4 py-2 mb-2 rounded-md text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition"
      >
        Książki
      </button>
      <button
        onClick={() => {
          navigate('/logout');
          setMenuOpen(false);
        }}
        className="block w-full text-left px-4 py-2 rounded-md text-gray-800 hover:bg-red-50 hover:text-red-600 transition"
      >
        Wyloguj się
      </button>
    </nav>
  </div>
)}


      {/* MAIN CONTENT */}
      <main className="p-4">
        {/* Welcome */}
        <section className="bg-white p-6 mb-4 shadow">
          <h2 className="text-xl">Witaj, {data.username}!</h2>
        </section>

        {/* Achievements */}
        <section className="bg-white p-6 mb-4 shadow">
          <h3 className="text-lg mb-2">🏆 Osiągnięcia</h3>
          <div className="flex flex-wrap gap-2">
            {data.badges.first_book && (
              <span className="px-3 py-1 bg-blue-800 text-white rounded-full">
                Pierwsza książka
              </span>
            )}
            {data.badges.ten_books && (
              <span className="px-3 py-1 bg-blue-800 text-white rounded-full">
                10 książek
              </span>
            )}
            {data.badges.twenty_books && (
              <span className="px-3 py-1 bg-blue-800 text-white rounded-full">
                20 książek
              </span>
            )}
            {data.badges.hundred_books && (
              <span className="px-3 py-1 bg-blue-800 text-white rounded-full">
                100 książek
              </span>
            )}
            {data.badges.three_categories && (
              <span className="px-3 py-1 bg-blue-800 text-white rounded-full">
                3 kategorie
              </span>
            )}
          </div>
        </section>

        {/* Stats */}
        <section className="bg-white p-6 mb-4 shadow flex justify-around">
          <div className="text-center">
            <div className="text-2xl font-bold">{data.all_my_rents}</div>
            <div>Przeczytane</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {data.average_user_rents.toFixed(1)}
            </div>
            <div>Śr. wypożyczeń</div>
          </div>
        </section>

        {/* Favorite Categories */}
        <section className="bg-white p-6 mb-4 shadow">
          <h3 className="text-lg mb-2">📚 Ulubione kategorie</h3>
          <div className="flex overflow-x-auto gap-4">
            {data.books_in_categories.length ? (
              data.books_in_categories.map((c, i) => (
                <div
                  key={i}
                  className="min-w-[140px] p-4 border rounded"
                >
                  <div className="font-bold">
                    {c.book_copy__book__category__name}
                  </div>
                  <div>{c.count} książki</div>
                </div>
              ))
            ) : (
              <div className="italic">Brak ulubionych kategorii</div>
            )}
          </div>
        </section>

        {/* Currently Rented */}
        <section className="mb-4">
          <h3 className="text-lg mb-2">📚 Aktualnie wypożyczone</h3>
          {data.rented_books.length ? (
            data.rented_books.map((b) => (
              <div
                key={b.id}
                className="bg-white p-4 mb-3 rounded shadow border-l-4 border-blue-800 cursor-pointer"
                onClick={() => navigate(`/return-book/${b.rentalId}`)}
              >
                <div className="flex justify-between">
                  <div className="font-bold">{b.book_title}</div>
                </div>
                <div className="text-sm text-gray-600">
                  by {b.book_author}
                </div>
                <div
                  className={
                    'inline-block mt-2 px-2 py-1 text-xs rounded text-white ' +
                    (b.status === 'pending' ? 'bg-yellow-500' : 
                     b.is_extended ? 'bg-gray-600' : 'bg-blue-800')
                  }
                >
                  {b.status === 'pending' ? 'Oczekujący' : 
                   b.is_extended ? 'Przedłużony' : daysRemaining(b.due_date)}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {formatDate(b.rental_date)} – {formatDate(b.due_date)}
                </div>
              </div>
            ))
          ) : (
            <div className="italic">Brak aktualnych wypożyczeń</div>
          )}
        </section>

                {/* Historia wypożyczeń */}
                <section className="bg-white p-6 mb-4 shadow">
          <h3 className="text-lg mb-2">📘 Historia wypożyczania</h3>
          {data.rented_books_old && data.rented_books_old.length > 0 ? (
            data.rented_books_old.map((item, index) => (
              <div 
                key={item.id ? item.id.toString() : `history-${index}`} 
                className="p-4 mb-3 border-b"
              >
                <div className="font-bold">{item.book_title}</div>
                <div className="text-sm text-gray-600">by {item.book_author}</div>
                <div className="text-xs text-gray-600 mt-1">
                  Zwrócone: {formatDate(item.return_date)}
                </div>
              </div>
            ))
          ) : (
            <div className="italic">Brak historii wypożyczania</div>
          )}
        </section>

        {/* Powiadomienia */}
        <section className="bg-white p-6 mb-4 shadow">
          <h3 className="text-lg mb-2">🔔 Powiadomienia</h3>
          {data.notifications && data.notifications.length > 0 ? (
            data.notifications.map((item, index) => (
              <div 
                key={item.id ? item.id.toString() : `notification-${index}`} 
                className="p-4 mb-3 border-b"
              >
                <div className="text-sm">{item.message}</div>
                <div className="text-xs text-gray-600 mt-1">
                  {formatDate(item.created_at?.split('T')[0])}
                </div>
              </div>
            ))
          ) : (
            <div className="italic">Brak powiadomień</div>
          )}
        </section>

        {/* Rekomendacje */}
        <section className="bg-white p-6 mb-4 shadow">
          <h3 className="text-lg mb-2">📚 Polecane</h3>
          {data.ai_recommendations && data.ai_recommendations.length > 0 ? (
            data.ai_recommendations.map((item, index) => (
              <div 
                key={`recommendation-${index}`} 
                className="p-4 mb-3 border-b"
              >
                <div className="text-sm">{item}</div>
              </div>
            ))
          ) : (
            <div className="italic">Brak polecanych</div>
          )}
        </section>

        {/* Oceny */}
        <section className="bg-white p-6 mb-4 shadow">
          <h3 className="text-lg mb-2">⭐ Moje oceny książek</h3>
          {data.opinions && data.opinions.length > 0 ? (
            data.opinions.map((item, index) => (
              <div 
                key={item.id ? item.id.toString() : `review-${index}`} 
                className="p-4 mb-3 border-b"
              >
                <div className="flex justify-between">
                  <div className="font-bold">{item.book_title}</div>
                  <div>
                    {Array(item.rate).fill('⭐').join('')}
                  </div>
                </div>
                <div className="text-sm italic mt-2">"{item.comment}"</div>
                <div className="text-xs text-gray-600 mt-1">
                  {formatDate(item.created_at)}
                </div>
              </div>
            ))
          ) : (
            <div className="italic">Brak ocen</div>
          )}
        </section>
      </main>
    </div>
  );
};

export default DashboardCustomer;