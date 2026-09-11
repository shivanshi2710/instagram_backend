import api from './axios'

export const authApi = {
  login: (credentials) => api.post('/login', credentials),
  register: (userData) => api.post('/users/', userData),
}
