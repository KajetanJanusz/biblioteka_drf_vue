<template>
    <div class="login-container">
      <div class="login-form">
        <h1>Login</h1>
        <div v-if="error" class="error-message">{{ error }}</div>
        
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="username">Username</label>
            <input 
              type="text" 
              id="username" 
              v-model="username" 
              placeholder="Enter your username"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              v-model="password" 
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button 
            type="submit" 
            class="login-button" 
            :disabled="isLoading"
          >
            {{ isLoading ? 'Logging in...' : 'Login' }}
          </button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { login } from '@/api/authService';
  
  export default {
    name: 'LoginView',
    data() {
      return {
        username: '',
        password: '',
        error: '',
        isLoading: false
      };
    },
    methods: {
      async handleLogin() {
        this.error = '';
        this.isLoading = true;
        
        try {
          await login(this.username, this.password);
          
          this.$router.push('/dashboard/customer/');
        } catch (err) {
          if (err.response) {
            // Handle different error responses
            if (err.response.status === 401) {
              this.error = 'Invalid username or password';
            } else if (err.response.data && err.response.data.detail) {
              this.error = err.response.data.detail;
            } else {
              this.error = 'Login failed. Please try again.';
            }
          } else {
            this.error = 'Network error. Please check your connection.';
          }
        } finally {
          this.isLoading = false;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f5f5f5;
  }
  
  .login-form {
    background-color: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
  }
  
  h1 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #333;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  .login-button {
    width: 100%;
    padding: 0.75rem;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    margin-top: 1rem;
  }
  
  .login-button:hover {
    background-color: #45a049;
  }
  
  .login-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  .error-message {
    background-color: #ffebee;
    color: #d32f2f;
    padding: 0.75rem;
    border-radius: 4px;
    margin-bottom: 1rem;
  }
  </style>