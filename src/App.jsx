import { useState, useEffect } from "react"
import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import "./App.css"

import Navbar from "./components/Navbar"
import LandingPage from "./pages/LandingPage"
import SignUp from "./pages/SignUp"
import SignIn from "./pages/SignIn"
import Dashboard from "./pages/Dashboard"
import Documents from "./pages/Documents"
import Profile from "./pages/Profile"
import Analysis from "./pages/Analysis"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"
import NotFound from "./pages/NotFound"

function getStoredAuth() {
  return Boolean(localStorage.getItem("token"))
}

function ProtectedRoute({ isAuthenticated, children }) {
  return isAuthenticated ? children : <Navigate to="/signin" replace />
}

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark"
  })
  const [isAuthenticated, setIsAuthenticated] = useState(getStoredAuth)
  const location = useLocation()

  // Keep auth state in sync if it changes in another tab
  useEffect(() => {
    const handleStorage = () => setIsAuthenticated(getStoredAuth())
    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light")
  }, [darkMode])

  const handleLogout = () => {
    localStorage.removeItem("token")
    setIsAuthenticated(false)
  }

  return (
    <div className={darkMode ? "app dark-mode" : "app"}>

      {location.pathname !== "/analysis" && (
        <Navbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
        />
      )}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/signup"
          element={<SignUp onAuthSuccess={() => setIsAuthenticated(true)} />}
        />
        <Route
          path="/signin"
          element={<SignIn onAuthSuccess={() => setIsAuthenticated(true)} />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/documents"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Documents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analysis"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Analysis />
            </ProtectedRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

    </div>
  )
}

export default App