import api from './axios'

export const usersApi = {
  getAll: () => api.get('/users/all_users'),
  getById: (userId) => api.get(`/users/${userId}`),
  getByUsername: (username) => api.get(`/users/username/${username}`),
  update: (data) => api.patch('/users/update_user_by_id', data),
  delete: () => api.delete('/users/delete_user_by_id'),
}
