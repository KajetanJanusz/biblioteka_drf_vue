import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { bookApi } from '../services/apiServices';

const ReturnApprove = () => {
  const navigate = useNavigate();
  const { rentalId } = useParams();
  const [loading, setLoading] = useState(false);

  const approveReturn = async () => {
    if (!rentalId) {
      alert('Błąd: Rental ID jest wymagane');
      return;
    }

    setLoading(true);
    try {
      await bookApi.approveReturn(rentalId);
      alert('Sukces! Zwrot został zatwierdzony!');
      navigate(-1);
    } catch (error) {
      console.error('Błąd zatwierdzenia zwrotu:', error.response ? error.response.data : error.message);
      alert('Błąd: Nie udało się zatwierdzić zwrotu');
    } finally {
      setLoading(false);
    }
  };

  if (!rentalId) {
    return (
      <div className="safe-area">
        <div className="container">
          <div className="header">
            <button onClick={() => navigate(-1)} className="back-button">
              ←
            </button>
            <h1 className="header-title">ReturnApprove</h1>
          </div>
          <div className="content-container">
            <p className="error-text">Brak Rental ID</p>
            <button className="button" onClick={() => navigate(-1)}>
              Wróć
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="safe-area">
        <div className="container">
          <div className="header">
            <button onClick={() => navigate(-1)} className="back-button">
              ←
            </button>
            <h1 className="header-title">ReturnApprove</h1>
          </div>
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="safe-area">
      <div className="container">
        {/* Header z przyciskiem Wróć */}
        <div className="header">
          <button onClick={() => navigate(-1)} className="back-button">
            ←
          </button>
          <h1 className="header-title">Zatwierdź Zwrot</h1>
        </div>

        <div className="buttons-container">
          <button className="button" onClick={approveReturn}>
            Zatwierdź zwrót
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnApprove;