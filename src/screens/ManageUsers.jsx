import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../services/apiServices.ts';

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
      <div className="bg-[#2c3e50] text-[#f9f7f1] p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center">
          <button onClick={toggleMenu} className="p-2 focus:outline-none mr-4">
            <div className="space-y-1">
              <div className="w-6 h-0.5 bg-[#f9f7f1]"></div>
              <div className="w-6 h-0.5 bg-[#f9f7f1]"></div>
              <div className="w-6 h-0.5 bg-[#f9f7f1]"></div>
            </div>
          </button>
          <h1 className="text-2xl font-bold font-serif">Zarządzanie użytkownikami</h1>
        </div>
        <button 
          className="bg-[#2c3e50] py-2 px-4 rounded-full text-[#f9f7f1] font-bold shadow-md"
          onClick={() => navigate('/add-user')}
        >
          + Dodaj użytkownika
        </button>
      </div>

      {/* Side Menu */}
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
                Zarządzanie książkami
              </button>
              <button 
                className="w-full py-4 px-6 text-left border-b border-[#e8e0d5] text-[#2c3e50] font-sans hover:bg-gray-100"
                onClick={() => navigateTo('manage-users')}
              >
                Zarządzanie użytkownikami
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