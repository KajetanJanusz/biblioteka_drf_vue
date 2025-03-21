<template>
  <div class="dashboard-container">
    <h1>Dashboard użytkownika</h1>
    <div v-if="loading" class="loading">Ładowanie...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <h2>Witaj, {{ dashboardData.username }}</h2>
      
      <section class="section">
        <h3>Wypożyczone książki</h3>
        <ul>
          <li v-for="book in dashboardData.rented_books" :key="book.id">
            {{ book.book_title }} - {{ book.book_author }} ({{ book.due_date }})
          </li>
        </ul>
      </section>
      
      <section class="section">
        <h3>Historia wypożyczeń</h3>
        <ul>
          <li v-for="book in dashboardData.rented_books_old" :key="book.id">
            {{ book.book_title }} - {{ book.book_author }} (Zwrócono: {{ book.return_date }})
          </li>
        </ul>
      </section>
      
      <section class="section">
        <h3>Powiadomienia</h3>
        <ul>
          <li v-for="notification in dashboardData.notifications" :key="notification.id">
            {{ notification.message }}
          </li>
        </ul>
      </section>
      
      <section class="section">
        <h3>Twoje opinie</h3>
        <ul>
          <li v-for="opinion in dashboardData.opinions" :key="opinion.id">
            {{ opinion.book_title }} - Ocena: {{ opinion.rate }}<br>
            {{ opinion.comment }}
          </li>
        </ul>
      </section>
      
      <section class="section">
        <h3>Rekomendacje AI</h3>
        <ul>
          <li v-for="(recommendation, index) in dashboardData.ai_recommendations" :key="index">
            {{ recommendation }}
          </li>
        </ul>
      </section>
      
      <section class="section">
        <h3>Odznaki</h3>
        <ul>
          <li v-if="dashboardData.badges.first_book">Pierwsza książka wypożyczona</li>
          <li v-if="dashboardData.badges.ten_books">Wypożyczono 10 książek</li>
          <li v-if="dashboardData.badges.twenty_books">Wypożyczono 20 książek</li>
          <li v-if="dashboardData.badges.hundred_books">Wypożyczono 100 książek</li>
          <li v-if="dashboardData.badges.three_categories">Wypożyczono książki z 3 różnych kategorii</li>
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
      const response = await authService.getDashboardCustomer()
      this.dashboardData = response.data
    } catch (err) {
      this.error = 'Błąd podczas pobierania danych'
      console.error(err)
    } finally {
      this.loading = false
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

h1 {
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
