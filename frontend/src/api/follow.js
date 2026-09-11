import api from './axios'

export const followApi = {
  follow: (userId) => api.post(`/follow/${userId}/follow`),
  unfollow: (userId) => api.delete(`/follow/${userId}/unfollow`),
  getFollowers: (userId) => api.get(`/follow/${userId}/followers`),
  getFollowing: (userId) => api.get(`/follow/${userId}/following`),
}
