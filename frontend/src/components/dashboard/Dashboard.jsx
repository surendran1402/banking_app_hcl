import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAccount } from '../../store/slices/accountSlice'
import { fetchTransactions } from '../../store/slices/transactionSlice'
import { Link } from 'react-router-dom'
import './Dashboard.css'

const Dashboard = () => {
  const dispatch = useDispatch()
  const { account, loading: accountLoading } = useSelector((state) => state.account)
  const { transactions, loading: transactionsLoading } = useSelector((state) => state.transactions)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(fetchAccount())
    dispatch(fetchTransactions())
  }, [dispatch])

  const recentTransactions = transactions.slice(0, 5)

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {user?.name || 'User'}!</h1>
          <p className="dashboard-subtitle">Here's your account overview</p>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Account Balance Card */}
        <div className="dashboard-card balance-card">
          <div className="card-header">
            <div className="card-icon balance-icon">💰</div>
            <h3>Account Balance</h3>
          </div>
          {accountLoading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : account ? (
            <>
              <div className="balance-display">
                <div className="balance-amount">₹{account.balance?.toFixed(2) || '0.00'}</div>
                <div className="balance-label">Available Balance</div>
              </div>
              <div className="account-number-display">
                <span className="account-label">Account Number</span>
                <span className="account-number">{account.accountNumber}</span>
              </div>
              <Link to="/account" className="card-link">
                View Account Details →
              </Link>
            </>
          ) : (
            <div className="no-account-state">
              <p>No account found</p>
              <Link to="/account" className="btn-primary">
                Create Account
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions Card */}
        <div className="dashboard-card actions-card">
          <div className="card-header">
            <div className="card-icon actions-icon">⚡</div>
            <h3>Quick Actions</h3>
          </div>
          <div className="quick-actions">
            <Link to="/account" className="action-btn deposit-btn">
              <span className="action-icon">+</span>
              <div className="action-content">
                <div className="action-title">Deposit</div>
                <div className="action-subtitle">Add money to account</div>
              </div>
            </Link>
            <Link to="/transfer" className="action-btn transfer-btn">
              <span className="action-icon">⇄</span>
              <div className="action-content">
                <div className="action-title">Transfer</div>
                <div className="action-subtitle">Send money to others</div>
              </div>
            </Link>
            <Link to="/transactions" className="action-btn transactions-btn">
              <span className="action-icon">📊</span>
              <div className="action-content">
                <div className="action-title">Transactions</div>
                <div className="action-subtitle">View transaction history</div>
              </div>
            </Link>
            {user?.role === 'ADMIN' && (
              <Link to="/admin" className="action-btn admin-btn">
                <span className="action-icon">👑</span>
                <div className="action-content">
                  <div className="action-title">Admin Panel</div>
                  <div className="action-subtitle">Manage system</div>
                </div>
              </Link>
            )}
          </div>
        </div>

        {/* Recent Transactions Card */}
        <div className="dashboard-card transactions-card">
          <div className="card-header">
            <div className="card-icon transactions-icon">📋</div>
            <h3>Recent Transactions</h3>
          </div>
          {transactionsLoading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : recentTransactions.length > 0 ? (
            <>
              <ul className="transaction-list">
                {recentTransactions.map((transaction) => (
                  <li key={transaction.id} className="transaction-item">
                    <div className="transaction-info">
                      <div className="transaction-type">
                        {transaction.fromAccount === account?.accountNumber ? (
                          <span className="transaction-badge outgoing">Outgoing</span>
                        ) : (
                          <span className="transaction-badge incoming">Incoming</span>
                        )}
                        <span className="transaction-account">
                          {transaction.fromAccount === account?.accountNumber
                            ? `To: ${transaction.toAccount.slice(-4)}`
                            : `From: ${transaction.fromAccount.slice(-4)}`}
                        </span>
                      </div>
                      <div className="transaction-date">{formatDate(transaction.timestamp)}</div>
                    </div>
                    <div className="transaction-amount-wrapper">
                      <div className={`transaction-amount ${transaction.fromAccount === account?.accountNumber ? 'negative' : 'positive'}`}>
                        {transaction.fromAccount === account?.accountNumber ? '-' : '+'}₹{transaction.amount?.toFixed(2)}
                      </div>
                      <span className={`status-badge status-${transaction.status?.toLowerCase()}`}>
                        {transaction.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <Link to="/transactions" className="card-link">
                View All Transactions →
              </Link>
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p>No transactions yet</p>
              <Link to="/transfer" className="btn-primary">Make Your First Transfer</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
