import api from './axios'
import { getCache, setCache, clearCache } from './cache'

const MY_POSTS_KEY = 'myPosts'

export const postsApi = {
  create: async (formData) => {
    const res = await api.post('/posts/create-post', formData)
    clearCache(MY_POSTS_KEY)
    return res
  },
  getMine: async () => {
    const cached = getCache(MY_POSTS_KEY)
    if (cached) return { data: cached }

    const res = await api.get('/posts/get_all_post_by_user_id')
    setCache(MY_POSTS_KEY, res.data, 30)
    return res
  },
  getById: (postId) => api.get(`/posts/get_post_by_post_id/${postId}`),
  update: async (postId, formData) => {
    const res = await api.patch(`/posts/update_post/${postId}`, formData)
    clearCache(MY_POSTS_KEY)
    return res
  },
  delete: async (postId) => {
    const res = await api.delete(`/posts/${postId}`)
    clearCache(MY_POSTS_KEY)
    return res
  },
}
