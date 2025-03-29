<template>
  <div class="dashboard-container">
    <h1>Dashboard użytkownika</h1>
    <div class="menu">
        <li><router-link to="/books">Książki</router-link></li>
        <li @click="logout">Wyloguj</li>
    </div>
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
      this.error = err
      this.$router.push('/dashboard/employee/')
    } finally {
      this.loading = false
    }
  },
  methods: {
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen
    },
    toggleSection(index) {
      this.expanded[index] = !this.expanded[index]
    },
    formatItem(item) {
      if (item.book_title) return `${item.book_title} - ${item.book_author || ''} (${item.due_date || item.return_date || ''})`
      return item.message
    },
    logout() {
      authService.logout()
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Roboto', 'Open Sans', sans-serif;
  color: #333;
}

h1 {
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
  margin-bottom: 30px;
}

h2 {
  color: #2980b9;
  margin-bottom: 20px;
}

h3 {
  color: #3498db;
  margin-bottom: 15px;
  border-left: 3px solid #3498db;
  padding-left: 10px;
}

.section {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 25px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

li:last-child {
  border-bottom: none;
}

.loading {
  text-align: center;
  padding: 30px;
  font-size: 18px;
  color: #7f8c8d;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
}

/* Dodatkowe style dla odznaki */
.section:nth-child(7) li {
  position: relative;
  padding-left: 30px;
}

.section:nth-child(7) li:before {
  content: "🏆";
  position: absolute;
  left: 0;
  top: 10px;
}

/* Style dla powiadomień */
.section:nth-child(4) li {
  background-color: #f9f9f9;
  padding: 12px 15px;
  border-radius: 5px;
  border-left: 3px solid #3498db;
  margin-bottom: 8px;
}

/* Style dla gwiazdek przy opiniach */
.section:nth-child(5) li {
  padding-bottom: 18px;
}

/* Style dla rekomendacji */
.section:nth-child(6) li {
  background-color: #ebf5fb;
  padding: 12px 15px;
  border-radius: 5px;
  border-left: 3px solid #2ecc71;
  margin-bottom: 8px;
}
.menu {
  position: relative;
  display: inline-block;
}

.menu-button {
  background: #0073e6;
  color: white;
  border: none;
  padding: 10px 15px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.menu-button:hover {
  background: #005bb5;
}

.dropdown {
  position: absolute;
  right: 0;
  top: 100%;
  background: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  list-style: none;
  padding: 10px 0;
  margin: 5px 0 0;
  width: 150px;
  z-index: 10;
  animation: fadeIn 0.3s ease-in-out;
}

.dropdown li {
  padding: 10px;
  text-align: center;
  cursor: pointer;
  transition: background 0.3s ease;
}

.dropdown li:hover {
  background: #f1f1f1;
}

.dropdown a {
  text-decoration: none;
  color: black;
  display: block;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsywność */
@media (max-width: 600px) {
  .dropdown {
    width: 100%;
    text-align: left;
  }
}



/* Responsywność */
@media (max-width: 768px) {
  .dashboard-container {
    padding: 10px;
  }
  
  .section {
    padding: 15px;
  }
}
</style>
