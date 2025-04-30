import React, { useEffect, useState, useRef } from 'react';
import { dashboardApi } from '../services/apiServices';
import { useNavigate } from 'react-router-dom';
import '../styles/DashboardEmployee.css'

const DashboardEmployee = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

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
          navigate('/login');
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
  }, [navigate]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="error-text">
        Błąd ładowania danych
      </div>
    );
  }

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
              onClick={() => navigate(`/return-approve/${item.id}`)}
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
    </div>
  );
};

export default DashboardEmployee;