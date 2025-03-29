import apiClient from './api'

export default {
  async login(credentials) {
    return apiClient.post('token/', credentials)
      .then(response => {
        const { access, refresh } = response.data
        localStorage.setItem('accessToken', access)
        localStorage.setItem('refresh_token', refresh)
        return response
      })
  },
  
  logout() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  },
  
  getUsers() {
    return apiClient.get('/users/')
  },

  getBooks() {
    return apiClient.get('/books/')
  },

  getBookDetail( bookId ) {
    return apiClient.get(`/books/details/${bookId}`)
  },
  getDashboardCustomer() {
    return apiClient.get('/dashboard/customer/')
  },

  getDashboardEmployee() {
    return apiClient.get('/dashboard/employee/')
  },
  
  isAuthenticated() {
    return !!localStorage.getItem('accessToken')
  }
}