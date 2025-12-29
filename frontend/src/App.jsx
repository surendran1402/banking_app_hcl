import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Dashboard from './components/dashboard/Dashboard'
import Account from './components/account/Account'
import Transfer from './components/transfer/Transfer'
import Transactions from './components/transactions/Transactions'
import AdminDashboard from './components/admin/AdminDashboard'
import Layout from './components/layout/Layout'
import './App.css'

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
      
      {/* Protected Routes */}
      <Route
        path="/"
        element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}
      >
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="account" element={<Account />} />
        <Route path="transfer" element={<Transfer />} />
        <Route path="transactions" element={<Transactions />} />
        {user?.role === 'ADMIN' && (
          <Route path="admin" element={<AdminDashboard />} />
        )}
      </Route>
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
    </Routes>
  )
}

export default App


