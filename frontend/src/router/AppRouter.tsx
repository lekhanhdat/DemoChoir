import type { ReactElement } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from '../shell/AppShell'
import LoginPage from '../views/LoginPage'
import SearchAddSongsPage from '../views/SearchAddSongsPage'
import SongBooksPage from '../views/SongBooksPage'
import SongsPage from '../views/SongsPage'
import { isLoggedIn } from '../utils/auth'

function ProtectedRoute({ children }: { children: ReactElement }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default function AppRouter() {
  return (
    <Routes>
      <Route
        path="/login"
        element={isLoggedIn() ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<SearchAddSongsPage />} />
        <Route path="songs" element={<SongsPage />} />
        <Route path="song-books" element={<SongBooksPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
