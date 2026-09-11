import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'
import ProtectedRoute, { GuestRoute } from './components/auth/ProtectedRoute'
import Layout, { AuthLayout, WideLayout } from './components/layout/Layout'

import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
import CreatePost from './pages/CreatePost'
import UpdatePost from './pages/UpdatePost'
import SearchUsers from './pages/SearchUsers'
import Followers from './pages/Followers'
import Following from './pages/Following'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route
                path="/login"
                element={
                  <GuestRoute>
                    <AuthLayout><Login /></AuthLayout>
                  </GuestRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <GuestRoute>
                    <AuthLayout><Register /></AuthLayout>
                  </GuestRoute>
                }
              />

              <Route
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Home />} />
                <Route path="create" element={<CreatePost />} />
                <Route path="posts/:postId/edit" element={<UpdatePost />} />
              </Route>

              <Route
                element={
                  <ProtectedRoute>
                    <WideLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="search" element={<SearchUsers />} />
                <Route path="profile/edit" element={<EditProfile />} />
                <Route path="profile/:username" element={<Profile />} />
                <Route path="profile/:username/followers" element={<Followers />} />
                <Route path="profile/:username/following" element={<Following />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
