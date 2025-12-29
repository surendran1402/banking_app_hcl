import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTransactions } from '../../store/slices/transactionSlice'
import './Transactions.css'

const Transactions = () => {
  const dispatch = useDispatch()
  const { transactions, loading, error } = useSelector((state) => state.transactions)
  const { account } = useSelector((state) => state.account)

  useEffect(() => {
    dispatch(fetchTransactions())
  }, [dispatch])

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  return (
    <div className="container">
      <h1>Transaction History</h1>
      <div className="card">
        {loading ? (
          <div className="loading">Loading transactions...</div>
        ) : error ? (
          <div className="error-message">{error.message || 'Failed to load transactions'}</div>
        ) : transactions.length > 0 ? (
          <div className="transactions-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>From Account</th>
                  <th>To Account</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => {
                  const isOutgoing = transaction.fromAccount === account?.accountNumber
                  return (
                    <tr key={transaction.id}>
                      <td>{formatDate(transaction.timestamp)}</td>
                      <td>{transaction.fromAccount}</td>
                      <td>{transaction.toAccount}</td>
                      <td className={isOutgoing ? 'amount-outgoing' : 'amount-incoming'}>
                        {isOutgoing ? '-' : '+'}₹{transaction.amount?.toFixed(2)}
                      </td>
                      <td>
                        <span className={`status status-${transaction.status?.toLowerCase()}`}>
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-transactions">
            <p>No transactions found.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Transactions


