import api from './axios'

export const postsApi = {
  create: (formData) => api.post('/posts/create-post', formData),
  getMine: () => api.get('/posts/get_all_post_by_user_id'),
  getById: (postId) => api.get(`/posts/get_post_by_post_id/${postId}`),
  update: (postId, formData) => api.patch(`/posts/update_post/${postId}`, formData),
  delete: (postId) => api.delete(`/posts/${postId}`),
}
