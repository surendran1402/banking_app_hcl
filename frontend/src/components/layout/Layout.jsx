import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../store/slices/authSlice'
import './Layout.css'

const Layout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <Link to="/dashboard">Banking App</Link>
          </div>
          <div className="nav-links">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/account">Account</Link>
            <Link to="/transfer">Transfer</Link>
            <Link to="/transactions">Transactions</Link>
            {user?.role === 'ADMIN' && (
              <Link to="/admin">Admin</Link>
            )}
            <div className="nav-user">
              <div className="nav-user-info">
                <div className="nav-user-name">{user?.name || user?.email}</div>
                <div className="nav-user-role">{user?.role}</div>
              </div>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout

