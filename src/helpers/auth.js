import apiClient from './api'

export default {
  async login(credentials) {
    return apiClient.post('token/', credentials)
      .then(response => {
        const { access, refresh } = response.data
        // Zapisz tokeny w localStorage
        localStorage.setItem('accessToken', access)
        localStorage.setItem('refresh_token', refresh)
        return response
      })
  },
  
  logout() {
    // Usuń tokeny z localStorage
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  },
  
  getUser() {
    return apiClient.get('/user/') // Endpoint do pobrania danych użytkownika
  },

  getDashboardCustomer() {
    return apiClient.get('/dashboard/customer/')
  },

  getDashboardEmployee() {
    return apiClient.get('/dashboard/employee/')
  },
  
  // Sprawdzenie czy użytkownik jest zalogowany
  isAuthenticated() {
    return !!localStorage.getItem('accessToken')
  }
}