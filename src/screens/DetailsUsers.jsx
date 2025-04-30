// src/screens/DetailUsers.jsx
import React, { useState, useEffect } from 'react';
import { userApi } from '../services/apiServices';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/DetailsUsers.css'

const DetailUsers = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    imię: '',
    nazwisko: '',
    adres_email: '',
    numer_telefonu: '',
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (userId) fetchUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const resp = await userApi.getUserDetails(userId);
      setUserDetails({
        imię: resp.data.first_name || '',
        nazwisko: resp.data.last_name || '',
        adres_email: resp.data.email || '',
        numer_telefonu: resp.data.phone || '',
      });
    } catch (err) {
      alert(err.response?.data?.detail || 'Błąd pobierania danych');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setUserDetails((prev) => ({ ...prev, [field]: value }));
  };

  const saveChanges = async () => {
    setLoading(true);
    try {
      await userApi.editUser(userId, {
        first_name: userDetails.imię,
        last_name: userDetails.nazwisko,
        email: userDetails.adres_email,
        phone: userDetails.numer_telefonu,
      });
      alert('Użytkownik zapisany');
      setEditing(false);
      fetchUserDetails();
    } catch (err) {
      alert(err.response?.data?.detail || 'Błąd zapisu');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async () => {
    if (window.confirm('Czy na pewno usunąć użytkownika?')) {
      setLoading(true);
      try {
        await userApi.deleteUser(userId);
        alert('Użytkownik usunięty');
        navigate(-1);
      } catch (err) {
        alert(err.response?.data?.detail || 'Błąd usuwania');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span>Ładowanie…</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="mr-4 text-2xl">
          ←
        </button>
        <h1 className="text-2xl font-bold">Szczegóły użytkownika</h1>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg shadow p-6 max-w-lg mx-auto">
        <h2 className="text-lg font-semibold mb-4">Informacje o użytkowniku</h2>

        <div className="space-y-4">
          {['imię', 'nazwisko', 'adres_email', 'numer_telefonu'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.replace('_', ' ')}
              </label>
              <input
                type="text"
                disabled={!editing}
                value={userDetails[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                className={`w-full border rounded px-3 py-2 ${
                  editing ? 'bg-white' : 'bg-gray-100'
                }`}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex space-x-4">
          {editing ? (
            <button
              onClick={saveChanges}
              className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Zapisz
            </button>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Edytuj
            </button>
          )}
          <button
            onClick={deleteUser}
            className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            Usuń
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailUsers;
