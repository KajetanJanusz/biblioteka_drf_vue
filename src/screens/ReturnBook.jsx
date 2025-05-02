import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { bookApi } from '../services/apiServices';
import '../styles/ReturnBook.css'

const ReturnBook = () => {
  const navigate = useNavigate();
  const { rentalId } = useParams();
  const [loading, setLoading] = useState(false);

  const returnBook = async () => {
    if (!rentalId) {
      alert('Error: Rental ID is missing');
      return;
    }
    
    setLoading(true);
    try {
      await bookApi.returnBook(rentalId);
      alert('Sukces: Zwrot wysłany!');
      navigate(-1);
    } catch (error) {
      console.error('Return error:', error.response ? error.response.data : error.message);
      alert('Error: Failed to submit return request');
    } finally {
      setLoading(false);
    }
  };

  const extendRental = async () => {
    if (!rentalId) {
      alert('Error: Rental ID is missing');
      return;
    }

    setLoading(true);
    try {
      await bookApi.extendRental(rentalId);
      alert('Sukces: Wypożyczenie przedłużone o 7 dni!');
    } catch (error) {
      console.error('Extend rental error:', error.response ? error.response.data : error.message);
      alert('Error: Failed to extend rental');
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
            <h1 className="header-title">Powrót</h1>
          </div>
          <div className="content-container">
            <p style={styles.errorText}>Rental ID is missing</p>
            <button className="button" onClick={() => navigate(-1)}>
              Go Back
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
            <h1 className="header-title">Powrót</h1>
          </div>
          <div className="loading-container">
          <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
        {/* Header z przyciskiem Wróć */}
        <header className="bg-blue-800 text-white flex items-center p-4">
          <button onClick={() => navigate(-1)} className="back-button">
            ←
          </button>
          <h1 className="header-title">Powrót</h1>
          </header>


          <div className="buttons-container">
          <button className="button" onClick={returnBook}>
            Zwróć książkę
          </button>

          <button className="buttonExtend" onClick={extendRental}>
            Przedłuż o 7 dni
          </button>
        </div>
        </div>
  );
};

const styles = {
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
  },
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '24px',
    paddingBottom: '12px',
    borderBottom: '1px solid #e0e0e0',
  },
  backButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '24px',
    padding: '8px',
    marginRight: '8px',
    color: '#1565c0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    transition: 'background-color 0.2s',
  },
  backButtonText: {
    fontSize: '24px',
    lineHeight: '1',
  },
  headerTitle: {
    fontSize: '22px',
    fontWeight: '600',
    margin: '0',
    color: '#333',
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '20px',
  },
  button: {
    backgroundColor: '#1565c0',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    cursor: 'pointer',
    padding: '16px',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  buttonExtend: {
    backgroundColor: '#4caf50',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    cursor: 'pointer',
    padding: '16px',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  buttonText: {
    fontWeight: '500',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '50%',
    borderTop: '4px solid #1565c0',
    animation: 'spin 1s linear infinite',
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '32px 16px',
    gap: '24px',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: '18px',
    textAlign: 'center',
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
};

// Dodanie animacji dla loadera
const spinKeyframes = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

// Dodanie stylu globalnego dla animacji
const addGlobalStyle = (css) => {
  const head = document.head || document.getElementsByTagName('head')[0];
  const style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode(css));
  head.appendChild(style);
};

// Dodanie animacji po renderowaniu komponentu
if (typeof window !== 'undefined') {
  addGlobalStyle(spinKeyframes);
}

export default ReturnBook;