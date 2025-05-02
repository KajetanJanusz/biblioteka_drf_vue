import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../services/apiServices.ts';
import '../styles/ManageUsers.css'

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userApi.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error("Fetch Users Error:", error);
      alert(error.response?.data?.detail || 'Failed to fetch users');
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

  return (
    <div className="bg-[#f9f7f1] min-h-screen">
      {/* Header with Menu Button */}
      <header>
        <div className="header-left">
          <button onClick={toggleMenu} className="menu-button">
            <span />
            <span />
            <span />
          </button>
          <h1>Zarządzanie użytkownikami</h1>
        </div>
        <button 
          className="add-user-btn"
          onClick={() => navigate('/add-user')}
        >
          <span className="icon"></span>
          Dodaj użytkownika
        </button>
      </header>

      {/* Side Menu */}
      {menuOpen && (
        <div className="side-menu-overlay" onClick={toggleMenu}>
        <nav className="side-menu" onClick={e => e.stopPropagation()}>
          {/* <div className="menu-header">
            <h2>Menu</h2>
          </div> */}
          <button onClick={() => navigateTo('dashboard-employee')} className="menu-item">Strona główna</button>
          <button onClick={() => navigateTo('manage-books')} className="menu-item">Książki</button>
          <button onClick={() => navigateTo('manage-users')} className="menu-item">Zarządzaj użytkownikami</button>
          <button onClick={() => navigateTo('logout')} className="menu-item">Wyloguj</button>
        </nav>
      </div>
    )}

      {/* User List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0066CC]"></div>
        </div>
      ) : (
        <div className="p-4">
          {users.map((user) => (
            <div
              key={`user-${user.id}`}
              className="bg-white my-4 p-4 rounded-lg shadow-md border-l-4 border-l-[#2c3e50] cursor-pointer"
              onClick={() => navigate(`/user/${user.id}`)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-gray-800">{user.username}</h3>
                <span className="text-sm text-gray-600">{user.email}</span>
              </div>
              <p className="text-sm text-gray-700">{`${user.first_name} ${user.last_name}`}</p>
              <p className="text-sm text-gray-600">{user.phone || 'No phone available'}</p>
              <p className={`mt-2 text-sm font-bold ${user.is_active ? 'text-green-600' : 'text-red-600'}`}>
                {user.is_active ? 'Active' : 'Inactive'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageUsers;