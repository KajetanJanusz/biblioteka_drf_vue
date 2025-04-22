import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { bookApi } from '../services/apiServices';

const ReturnBook = () => {
  const navigate = useNavigate();
  const { rentalId } = useParams();
  const location = useLocation();
  const notificationId = location.state?.notificationId;
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

  if (!rentalId || !notificationId) {
    return (
      <div style={styles.safeArea}>
        <div style={styles.container}>
          <div style={styles.header}>
            <button onClick={() => navigate(-1)} style={styles.backButton}>
              <span style={styles.backButtonText}>←</span>
            </button>
            <h1 style={styles.headerTitle}>Powrót</h1>
          </div>
          <div style={styles.contentContainer}>
            <p style={styles.errorText}>
              {!rentalId ? 'Rental ID is missing' : 'Notification ID is missing'}
            </p>
            <button style={styles.button} onClick={() => navigate(-1)}>
              <span style={styles.buttonText}>Go Back</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.safeArea}>
        <div style={styles.container}>
          <div style={styles.header}>
            <button onClick={() => navigate(-1)} style={styles.backButton}>
              <span style={styles.backButtonText}>←</span>
            </button>
            <h1 style={styles.headerTitle}>Powrót</h1>
          </div>
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.safeArea}>
      <div style={styles.container}>
        {/* Header with Back Button */}
        <div style={styles.header}>
          <button onClick={() => navigate(-1)} style={styles.backButton}>
            <span style={styles.backButtonText}>←</span>
          </button>
          <h1 style={styles.headerTitle}>Powrót</h1>
        </div>

        <div style={styles.buttonsContainer}>
          <button style={styles.button} onClick={returnBook}>
            <span style={styles.buttonText}>Zwróć książkę</span>
          </button>

          <button style={styles.buttonExtend} onClick={extendRental}>
            <span style={styles.buttonText}>Przedłuż o 7 dni</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Inline styles to replace React Native StyleSheet
const styles = {
  safeArea: {
    flex: 1,
    backgroundColor: '#2c3e50',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    flex: 1,
    backgroundColor: '#f9f7f1',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
    padding: '16px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  },
  headerTitle: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#f9f7f1',
    marginLeft: '16px',
    fontFamily: 'Georgia, serif',
    margin: 0,
  },
  buttonsContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  contentContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  backButton: {
    background: 'none',
    border: 'none',
    padding: '8px',
    cursor: 'pointer',
  },
  backButtonText: {
    fontSize: '24px',
    color: '#f9f7f1',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#2c3e50',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '20px',
    width: '80%',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    border: 'none',
    cursor: 'pointer',
  },
  buttonExtend: {
    backgroundColor: '#27ae60',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '20px',
    width: '80%',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    border: 'none',
    cursor: 'pointer',
  },
  buttonText: {
    color: '#f9f7f1',
    fontSize: '16px',
    fontWeight: 'bold',
    fontFamily: 'Avenir, "Segoe UI", sans-serif',
  },
  loadingContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid rgba(44, 62, 80, 0.2)',
    borderRadius: '50%',
    borderTop: '4px solid #2c3e50',
    animation: 'spin 1s linear infinite',
  },
  errorText: {
    textAlign: 'center',
    margin: '20px 0',
    fontSize: '16px',
    color: '#922b21',
    fontFamily: 'Avenir, "Segoe UI", sans-serif',
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  }
};

export default ReturnBook;