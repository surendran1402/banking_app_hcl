import { useEffect, useState } from 'react'
import { adminAPI } from '../../services/api'
import './AdminDashboard.css'

const AdminDashboard = () => {
  const [users, setUsers] = useState([])
  const [transactions, setTransactions] = useState([])
  const [fraudTransactions, setFraudTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('users')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [usersRes, transactionsRes, fraudRes] = await Promise.all([
        adminAPI.getUsers(),
        adminAPI.getAllTransactions(),
        adminAPI.getFraudTransactions(),
      ])
      setUsers(usersRes.data.data || [])
      setTransactions(transactionsRes.data.data || [])
      setFraudTransactions(fraudRes.data.data || [])
    } catch (error) {
      console.error('Failed to load admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFraudDecision = async (transactionId, decision) => {
    try {
      await adminAPI.makeFraudDecision(transactionId, decision)
      loadData()
    } catch (error) {
      console.error('Failed to make fraud decision:', error)
      alert(error.response?.data?.message || 'Failed to update fraud decision')
    }
  }

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>
      <div className="admin-tabs">
        <button
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Users ({users.length})
        </button>
        <button
          className={activeTab === 'transactions' ? 'active' : ''}
          onClick={() => setActiveTab('transactions')}
        >
          All Transactions ({transactions.length})
        </button>
        <button
          className={activeTab === 'fraud' ? 'active' : ''}
          onClick={() => setActiveTab('fraud')}
        >
          Fraud Transactions ({fraudTransactions.length})
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            {activeTab === 'users' && (
              <div className="admin-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'transactions' && (
              <div className="admin-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>From</th>
                      <th>To</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Fraud</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id}>
                        <td>{tx.id}</td>
                        <td>{tx.fromAccount}</td>
                        <td>{tx.toAccount}</td>
                        <td>${tx.amount?.toFixed(2)}</td>
                        <td>
                          <span className={`status status-${tx.status?.toLowerCase()}`}>
                            {tx.status}
                          </span>
                        </td>
                        <td>
                          {tx.isFraud ? (
                            <span className="fraud-badge">FRAUD</span>
                          ) : (
                            <span className="safe-badge">SAFE</span>
                          )}
                        </td>
                        <td>{new Date(tx.timestamp).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'fraud' && (
              <div className="admin-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>From</th>
                      <th>To</th>
                      <th>Amount</th>
                      <th>Reason</th>
                      <th>Decision</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fraudTransactions.map((tx) => (
                      <tr key={tx.id}>
                        <td>{tx.id}</td>
                        <td>{tx.fromAccount}</td>
                        <td>{tx.toAccount}</td>
                        <td>${tx.amount?.toFixed(2)}</td>
                        <td>{tx.fraudReason || 'N/A'}</td>
                        <td>{tx.fraudDecision || 'PENDING'}</td>
                        <td>
                          {!tx.fraudDecision && (
                            <div className="fraud-actions">
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => handleFraudDecision(tx.id, 'SAFE')}
                              >
                                Mark Safe
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleFraudDecision(tx.id, 'CONFIRMED_FRAUD')}
                              >
                                Confirm Fraud
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard


