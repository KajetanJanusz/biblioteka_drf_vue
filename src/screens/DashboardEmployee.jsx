import React, { useEffect, useState, useRef } from 'react';
import { dashboardApi } from '../services/apiServices';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const DashboardEmployee = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    // Close menu when clicking outside
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && menuOpen) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          alert('Error: No access token found');
          navigate('/login'); // Use navigate for redirection
          return;
        }

        const response = await dashboardApi.getEmployeeDashboard();
        setData(response.data);
      } catch (error) {
        alert('Error: Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]); // Include navigate in the dependency array

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="main-container">
      {/* Hamburger Menu Button */}
      <div className="header">
        <button onClick={toggleMenu} className="menu-button">
          <div className="menu-icon">
            <div className="menu-bar"></div>
            <div className="menu-bar"></div>
            <div className="menu-bar"></div>
          </div>
        </button>
        <h1 className="header-title">Profil bibliotekarza</h1>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div className="overlay" onClick={toggleMenu}></div>
      )}

      {/* Slide-out Menu */}
      <div
        ref={menuRef}
        className={`menu ${menuOpen ? 'open' : ''}`}
      >
        <div className="menu-header">
          <h2 className="menu-title">Menu</h2>
        </div>
        <nav className="p-4 space-y-2">
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

      {/* Main Content */}
      <div className="container">
        <h2 className="title">Witaj, Bibliotekarzu!</h2>

        <h3 className="section-title">📚 Aktualnie wypożyczone książki:</h3>
        {data.rented_books && data.rented_books.length > 0 ? (
          data.rented_books.map((item) => (
            <div key={item.id.toString()} className="book-item">
              <h4 className="book-title">{item.book_copy__book__title}</h4>
              <p className="book-user">Wypożyczone przez: {item.user__username}</p>
              <p className="book-due-date">Do: {formatDate(item.due_date)}</p>
            </div>
          ))
        ) : (
          <p className="empty-list">Brak aktualnie wypożyczonych książek</p>
        )}

        <h3 className="section-title">👥 Użytkownicy:</h3>
        {data.customers && data.customers.length > 0 ? (
          data.customers.map((customer) => (
            <div key={customer.id.toString()} className="customer-item">
              <h4 className="customer-name">{customer.username}</h4>
              <p className="customer-email">{customer.email}</p>
            </div>
          ))
        ) : (
          <p className="empty-list">Brak użytkowników</p>
        )}

        <h3 className="section-title">📊 Statystyki:</h3>
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-value">{data.total_rentals}</span>
            <span className="stat-label">Suma wypożyczeń</span>
          </div>
        </div>

        <h3 className="section-title">📚 Najczęściej wypożyczone książki:</h3>
        {data.most_rented_books && data.most_rented_books.length > 0 ? (
          data.most_rented_books.map((book, index) => (
            <div key={index} className="popular-book-item">
              <h4 className="popular-book-title">{book.book_copy__book__title}</h4>
              <p className="popular-book-count">Wypożyczone {book.rental_count} razy</p>
            </div>
          ))
        ) : (
          <p className="empty-list">Brak dostępnych danych</p>
        )}

        <h3 className="section-title">🔄 Zwroty do zatwierdzenia:</h3>
        {data.returns_to_approve && data.returns_to_approve.length > 0 ? (
          data.returns_to_approve.map((item, index) => (
            <div
              key={item.id ? item.id.toString() : `rented-${index}`}
              className="book-item"
              onClick={() => { console.log(item); window.location.href = `/returnApprove/${item.id}`; }}
            >
              <div className="return-item">
                <h4 className="return-title">{item.book_copy__book__title}</h4>
                <p className="return-user">Zwracany przez: {item.user__username}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="empty-list">Brak zwrotów do zatwierdzenia</p>
        )}
      </div>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: Georgia, serif;
        }

        .main-container {
          position: relative;
          background-color: #2c3e50;
          min-height: 100vh;
          overflow-x: hidden;
        }

        .header {
          display: flex;
          align-items: center;
          background-color: #2c3e50;
          padding: 16px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .header-title {
          font-size: 22px;
          font-weight: bold;
          color: #f9f7f1;
          margin-left: 16px;
        }

        .menu-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
        }

        .menu-icon {
          width: 24px;
          height: 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
        }

        .menu-bar {
          height: 3px;
          width: 24px;
          background-color: #f9f7f1;
          border-radius: 2px;
          margin: 2px 0;
        }

        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.6);
          z-index: 1;
        }

        .menu {
          position: fixed;
          top: 0;
          left: -70%;
          width: 70%;
          height: 100%;
          background-color: #f9f7f1;
          z-index: 2;
          box-shadow: 2px 0 8px rgba(0,0,0,0.5);
          transition: left 0.3s ease;
          overflow-y: auto;
        }

        .menu.open {
          left: 0;
        }

        .menu-header {
          padding: 24px;
          background-color: #2c3e50;
        }

        .menu-title {
          font-size: 22px;
          font-weight: bold;
          color: #f9f7f1;
        }

        .menu-item {
          display: block;
          width: 100%;
          text-align: left;
          padding: 18px;
          border: none;
          border-bottom: 1px solid #e8e0d5;
          background: none;
          cursor: pointer;
        }

        .menu-item-text {
          font-size: 16px;
          color: #2c3e50;
        }

        .container {
          padding: 16px;
          background-color: #f9f7f1;
          height: calc(100vh - 64px);
          overflow-y: auto;
        }

        .loader-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #f9f7f1;
        }

        .loader {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #0066CC;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 2s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-text {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          padding: 20px;
          color: #922b21;
          text-align: center;
          font-weight: bold;
          background-color: #f9f7f1;
        }

        .title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 16px;
          color: #2c3e50;
        }

        .section-title {
          font-size: 18px;
          font-weight: bold;
          margin-top: 16px;
          margin-bottom: 8px;
          color: #2c3e50;
        }

        .empty-list {
          font-style: italic;
          color: #7d6e56;
          text-align: center;
          padding: 8px;
        }

        .book-item {
          background-color: #fff;
          padding: 16px;
          margin-bottom: 12px;
          border-radius: 8px;
          border-left: 4px solid #2c3e50;
          box-shadow: 0 2px 6px rgba(0,0,0,0.12);
          cursor: pointer;
        }

        .book-title {
          font-size: 16px;
          font-weight: bold;
          color: #2c3e50;
        }

        .book-user {
          font-size: 14px;
          color: #7d6e56;
        }

        .book-due-date {
          font-size: 12px;
          color: #7d6e56;
          margin-top: 4px;
        }

        .customer-item {
          background-color: #fff;
          padding: 16px;
          margin-bottom: 12px;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.12);
        }

        .customer-name {
          font-size: 16px;
          font-weight: bold;
          color: #2c3e50;
        }

        .customer-email {
          font-size: 14px;
          color: #7d6e56;
        }

        .stats-container {
          display: flex;
          background-color: #fff;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 16px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.08);
        }

        .stat-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-value {
          font-size: 22px;
          font-weight: bold;
          color: #2c3e50;
        }

        .stat-label {
          font-size: 13px;
          color: #7d6e56;
          margin-top: 4px;
        }

        .popular-book-item {
          background-color: #fff;
          padding: 16px;
          margin-bottom: 12px;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.12);
        }

        .popular-book-title {
          font-size: 16px;
          font-weight: bold;
          color: #2c3e50;
        }

        .popular-book-count {
          font-size: 14px;
          color: #7d6e56;
        }

        .return-item {
          background-color: transparent;
        }

        .return-title {
          font-size: 16px;
          font-weight: bold;
          color: #2c3e50;
        }

        .return-user {
          font-size: 14px;
          color: #7d6e56;
        }

        @media (min-width: 768px) {
          .menu {
            width: 320px;
            left: -320px;
          }

          .book-item:hover, .customer-item:hover, .popular-book-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
            transition: all 0.3s ease;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardEmployee;