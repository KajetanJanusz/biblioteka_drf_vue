<template>
    <div class="safe-area">
      <div class="container">
        <!-- Header with Menu Button -->
        <div class="header">
          <button @click="toggleMenu" class="menu-button">
            <div class="menu-icon">
              <div class="menu-bar"></div>
              <div class="menu-bar"></div>
              <div class="menu-bar"></div>
            </div>
          </button>
          <h1 class="header-title">Library Books</h1>
        </div>
  
        <!-- Side Menu -->
        <div v-if="menuOpen" class="menu-overlay" @click="toggleMenu">
          <div class="side-menu" @click.stop>
            <h2 class="menu-title">Menu</h2>
            <button class="menu-item" @click="navigateTo('DashboardCustomer')">Dashboard</button>
            <button class="menu-item" @click="navigateTo('ListBooks')">Books</button>
            <button class="menu-item" @click="navigateTo('Logout')">Logout</button>
          </div>
        </div>
  
        <!-- Search Bar -->
        <div class="search-container">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search books by title or author..."
            class="search-input"
          />
        </div>
  
        <!-- Categories -->
        <h2 class="section-title">Categories:</h2>
        <div class="category-list">
          <button 
            v-for="category in [{ id: null, name: 'All' }, ...categories]"
            :key="category.id"
            :class="{ 'selected-category-item': selectedCategory === category.id }"
            @click="selectedCategory = category.id"
          >
            {{ category.name }}
          </button>
        </div>
  
        <!-- Book List -->
        <div v-if="loading" class="loader">Loading...</div>
        <div v-else>
          <p class="results-text">{{ filteredBooks.length }} book(s) found</p>
          <ul class="book-list">
            <li 
              v-for="book in filteredBooks"
              :key="book.id"
              :class="['book-item', !book.available_copies && 'unavailable-book']"
              @click="navigateToBook(book.id)"
            >
              <div class="book-header">
                <h3 class="book-title">{{ book.title }}</h3>
                <span :class="['availability-badge', book.available_copies ? 'available' : 'unavailable']">
                  {{ book.available_copies ? `${book.available_copies} Available` : 'Unavailable' }}
                </span>
              </div>
              <p class="book-author">by {{ book.author }}</p>
              <span class="category-badge">{{ getCategoryName(book.category) }}</span>
              <p class="book-description">{{ book.description }}</p>
            </li>
          </ul>
          <p v-if="filteredBooks.length === 0" class="empty-list">No books match your search criteria</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, computed } from "vue";
  import { useRouter } from "vue-router";
  import authService from '@/helpers/auth'
  
  export default {
    setup() {
      const books = ref([]);
      const loading = ref(true);
      const searchQuery = ref("");
      const selectedCategory = ref(null);
      const menuOpen = ref(false);
      const router = useRouter();
  
      const fetchBooks = async () => {
        try {
          loading.value = true;
          const response = await authService.getBooks();
          books.value = response.data.books;
          console.log(response.data)
        } catch (error) {
          alert(error.response?.data?.detail || "Failed to fetch books");
        } finally {
          loading.value = false;
        }
      };
  
      const toggleMenu = () => {
        menuOpen.value = !menuOpen.value;
      };
  
      const navigateTo = (screen) => {
        toggleMenu();
        router.push({ name: screen });
      };
  
      const navigateToBook = (id) => {
        router.push({ name: 'DetailsBook', params: { id } });
        };
  
      const getCategoryName = (categoryId) => {
        const categoryMap = {
          1: "Science Fiction",
          2: "Fantasy",
          3: "History",
          4: "Biography",
          5: "Literature",
        };
        return categoryMap[categoryId] || `Category ${categoryId}`;
      };
  
      const categories = computed(() =>
        books.value.length > 0
          ? [...new Set(books.value.map((book) => ({ id: book.category, name: getCategoryName(book.category) })))]
          : []
      );
  
      const filteredBooks = computed(() =>
        books.value.filter((book) => {
          const matchesSearch =
            book.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.value.toLowerCase());
          const matchesCategory = selectedCategory.value === null || book.category === selectedCategory.value;
          return matchesSearch && matchesCategory;
        })
      );
  
      onMounted(fetchBooks);
  
      return {
        books,
        loading,
        searchQuery,
        selectedCategory,
        menuOpen,
        fetchBooks,
        toggleMenu,
        navigateTo,
        navigateToBook,
        getCategoryName,
        categories,
        filteredBooks,
      };
    },
  };
  </script>
  
  <style scoped>
  .safe-area {
    padding: 20px;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .menu-button {
    background: none;
    border: none;
    cursor: pointer;
  }
  
  .menu-icon .menu-bar {
    width: 25px;
    height: 3px;
    background: black;
    margin: 3px 0;
  }
  
  .search-container {
    margin-top: 10px;
  }
  
  .search-input {
    width: 100%;
    padding: 8px;
  }
  
  .category-list {
    display: flex;
    overflow-x: auto;
    gap: 10px;
    margin-top: 10px;
  }
  
  .category-list button {
    padding: 5px 10px;
    border: 1px solid black;
    cursor: pointer;
  }
  
  .selected-category-item {
    background-color: #0066cc;
    color: white;
  }
  
  .book-list {
    list-style: none;
    padding: 0;
  }
  
  .book-item {
    border: 1px solid #ccc;
    padding: 10px;
    margin-top: 10px;
  }
  
  .unavailable-book {
    opacity: 0.5;
  }
  
  .availability-badge {
    padding: 5px;
    color: white;
  }
  
  .available {
    background-color: green;
  }
  
  .unavailable {
    background-color: red;
  }
  
  .empty-list {
    color: gray;
    text-align: center;
  }
  </style>
  