<template>
    <div class="container">
      <div class="header">
        <button @click="goBack" class="back-button">←</button>
        <h1 class="header-title">Book Details</h1>
      </div>
  
      <div v-if="loading" class="loader">
        <p>Loading...</p>
      </div>
  
      <div v-else-if="!bookDetails" class="error-message">
        <p>Book not found</p>
      </div>
  
      <div v-else class="book-details">
        <div class="book-card">
          <div class="book-image">
            <span class="book-initial">{{ bookDetails.book.title.charAt(0) }}</span>
          </div>
  
          <h2 class="book-title">{{ bookDetails.book.title }}</h2>
          <p class="book-author">by {{ bookDetails.book.author }}</p>
  
          <div class="book-meta">
            <span class="category-badge">{{ bookDetails.book.category }}</span>
            <span
              class="availability-badge"
              :class="{ available: bookDetails.available_copies > 0, unavailable: bookDetails.available_copies === 0 }"
            >
              {{ bookDetails.available_copies > 0 ? `${bookDetails.available_copies} of ${bookDetails.book.total_copies} Available` : 'Unavailable' }}
            </span>
          </div>
  
          <div class="book-info">
            <h3>Description</h3>
            <p>{{ bookDetails.book.description }}</p>
  
            <h3>Publication Details</h3>
            <p><strong>Published:</strong> {{ formatDate(bookDetails.book.published_date) }}</p>
            <p><strong>ISBN:</strong> {{ bookDetails.book.isbn }}</p>
          </div>
  
          <button
            v-if="bookDetails.can_add_notifications"
            class="notification-button"
            @click="notifyUser"
          >
            Notify me when available
          </button>
  
          <button
            :disabled="bookDetails.available_copies === 0"
            class="borrow-button"
            :class="{ disabled: bookDetails.available_copies === 0 }"
            @click="borrowBook"
          >
            {{ bookDetails.available_copies > 0 ? 'Borrow Book' : 'Currently Unavailable' }}
          </button>
        </div>
  
        <div class="reviews">
          <h3>Reviews ({{ bookDetails.opinions.length }})</h3>
          <div v-if="bookDetails.opinions.length > 0">
            <div v-for="opinion in bookDetails.opinions" :key="opinion.id" class="opinion">
              <div class="opinion-header">
                <span class="stars">{{ renderStarRating(opinion.rate) }}</span>
                <span class="opinion-date">{{ formatDate(opinion.created_at) }}</span>
              </div>
              <p class="opinion-comment">{{ opinion.comment }}</p>
            </div>
          </div>
          <p v-else class="no-reviews">No reviews yet</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import authService from '@/helpers/auth'
  
  export default {
    setup() {
      const route = useRoute()
      const router = useRouter()
      const bookDetails = ref(null)
      const loading = ref(true)
      const bookId = route.params.id
  
      const fetchBookDetails = async () => {
        try {
          loading.value = true
          const response = await authService.getBookDetail(bookId)
          bookDetails.value = response.data
        } catch (error) {
          console.error(error)
        } finally {
          loading.value = false
        }
      }
  
      const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        return new Date(dateString).toLocaleDateString()
      }
  
      const renderStarRating = (rating) => {
        return '★'.repeat(rating) + '☆'.repeat(5 - rating)
      }
  
      const goBack = () => {
        router.go(-1)
      }
  
      const notifyUser = () => {
        alert('You will be notified when this book becomes available')
      }
  
      const borrowBook = () => {
        alert(`You've borrowed "${bookDetails.value.book.title}"`)
      }
  
      onMounted(fetchBookDetails)
  
      return {
        bookDetails,
        loading,
        formatDate,
        renderStarRating,
        goBack,
        notifyUser,
        borrowBook,
      }
    },
  }
  </script>
  
  <style scoped>
  .container {
    max-width: 600px;
    margin: auto;
    padding: 16px;
    background: #f5f5f5;
  }
  
  .header {
    display: flex;
    align-items: center;
    padding: 16px;
    background: #1e88e5;
    color: white;
  }
  
  .back-button {
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
  }
  
  .header-title {
    margin-left: 16px;
    font-size: 20px;
  }
  
  .book-card {
    background: white;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    margin-top: 16px;
  }
  
  .book-image {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 120px;
    height: 180px;
    background: #e0e0e0;
    border-radius: 8px;
    font-size: 48px;
    color: #1e88e5;
    margin: auto;
  }
  
  .book-title {
    text-align: center;
    font-size: 24px;
    font-weight: bold;
  }
  
  .book-author {
    text-align: center;
    font-size: 16px;
    color: #666;
  }
  
  .book-meta {
    display: flex;
    justify-content: space-between;
    margin: 16px 0;
  }
  
  .category-badge {
    background: #e0e0e0;
    padding: 4px 8px;
    border-radius: 12px;
  }
  
  .availability-badge {
    padding: 4px 8px;
    border-radius: 12px;
  }
  
  .available {
    background: #4caf50;
    color: white;
  }
  
  .unavailable {
    background: #f44336;
    color: white;
  }
  
  .book-info h3 {
    margin-top: 16px;
    font-size: 18px;
  }
  
  .book-info p {
    margin: 4px 0;
  }
  
  .notification-button,
  .borrow-button {
    display: block;
    width: 100%;
    padding: 12px;
    border-radius: 24px;
    margin-top: 16px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    color: white;
    cursor: pointer;
  }
  
  .notification-button {
    background: #ff9800;
  }
  
  .borrow-button {
    background: #1e88e5;
  }
  
  .borrow-button.disabled {
    background: #b0bec5;
    cursor: not-allowed;
  }
  
  .reviews {
    background: white;
    padding: 16px;
    border-radius: 8px;
    margin-top: 16px;
  }
  
  .opinion {
    border-bottom: 1px solid #eee;
    padding: 8px 0;
  }
  
  .opinion-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
  }
  
  .stars {
    color: #ffc107;
  }
  
  .opinion-date {
    font-size: 14px;
    color: #999;
  }
  
  .opinion-comment {
    font-size: 16px;
  }
  
  .no-reviews {
    font-size: 16px;
    font-style: italic;
    text-align: center;
    padding: 16px 0;
  }
  
  .loader {
    text-align: center;
    margin-top: 50px;
  }
  
  .error-message {
    text-align: center;
    color: #f44336;
    margin-top: 50px;
  }
  </style>
  