<template>
    <div class="dashboard-container">
      <h1>Dashboard pracownika</h1>
      <div v-if="loading" class="loading">Ładowanie...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else>
        <h2>Witaj, Pracowniku!</h2>
        
        <section class="section">
          <h3>Aktualnie wypożyczone książki</h3>
          <ul>
            <li v-for="book in dashboardData.rented_books" :key="book.id">
              {{ book.book_copy__book__title }} - Wypożyczył: {{ book.user__username }} (Termin zwrotu: {{ formatDate(book.due_date) }})
            </li>
          </ul>
        </section>
        
        <section class="section">
          <h3>Klienci</h3>
          <ul>
            <li v-for="customer in dashboardData.customers" :key="customer.id">
              {{ customer.username }} - {{ customer.email }}
            </li>
          </ul>
        </section>
        
        <section class="section">
          <h3>Statystyki</h3>
          <p>Łączna liczba wypożyczeń: {{ dashboardData.total_rentals }}</p>
        </section>
        
        <section class="section">
          <h3>Najczęściej wypożyczane książki</h3>
          <ul>
            <li v-for="(book, index) in dashboardData.most_rented_books" :key="index">
              {{ book.book_copy__book__title }} - Wypożyczono {{ book.rental_count }} razy
            </li>
          </ul>
        </section>
        
        <section class="section">
          <h3>Zwroty do zatwierdzenia</h3>
          <ul>
            <li v-for="return_item in dashboardData.returns_to_approve" :key="return_item.id">
              {{ return_item.book_copy__book__title }} - Zwrócił: {{ return_item.user__username }}
            </li>
          </ul>
        </section>
      </div>
    </div>
  </template>
  
  <script>
import authService from '@/helpers/auth'
  
  export default {
    data() {
      return {
        dashboardData: null,
        loading: true,
        error: null,
      }
    },
    async created() {
      try {
        const response = await authService.getDashboardEmployee()
        this.dashboardData = response.data
      } catch (err) {
        this.error = 'Nie udało się pobrać danych dashboardu'
      } finally {
        this.loading = false
      }
    },
    methods: {
      formatDate(dateString) {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString();
      }
    }
  }
  </script>
  
  <style scoped>
  .dashboard-container {
    max-width: 800px;
    margin: 50px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  }
  
  h1, h2 {
    text-align: center;
    color: #333;
  }
  
  .loading {
    text-align: center;
    font-size: 18px;
    color: #555;
  }
  
  .error {
    color: red;
    text-align: center;
    margin-top: 10px;
  }
  
  .section {
    margin-top: 20px;
    padding: 15px;
    background: white;
    border-radius: 5px;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
  }
  
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  li {
    margin-bottom: 10px;
    padding: 10px;
    background: #eef;
    border-radius: 5px;
  }
  
  h3 {
    margin-bottom: 10px;
    color: #444;
  }
  </style>
  