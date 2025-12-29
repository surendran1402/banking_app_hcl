import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { transferMoney, clearError } from '../../store/slices/transactionSlice'
import { fetchAccount } from '../../store/slices/accountSlice'
import './Transfer.css'

const Transfer = () => {
  const [formData, setFormData] = useState({
    toAccount: '',
    amount: '',
  })

  const dispatch = useDispatch()
  const { loading, error } = useSelector((state) => state.transactions)
  const { account } = useSelector((state) => state.account)

  useEffect(() => {
    dispatch(fetchAccount())
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await dispatch(transferMoney({
      toAccount: formData.toAccount,
      amount: parseFloat(formData.amount),
    }))
    
    if (transferMoney.fulfilled.match(result)) {
      setFormData({ toAccount: '', amount: '' })
      dispatch(fetchAccount())
    }
  }

  return (
    <div className="container">
      <h1>Transfer Money</h1>
      <div className="card">
        {account ? (
          <div>
            <div className="account-balance">
              <p>Available Balance: <strong>₹{account.balance?.toFixed(2) || '0.00'}</strong></p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="toAccount">To Account Number</label>
                <input
                  type="text"
                  id="toAccount"
                  name="toAccount"
                  value={formData.toAccount}
                  onChange={handleChange}
                  placeholder="Enter account number"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="amount">Amount</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
              {error && (
                <div className="error-message">
                  {error.message || 'Transfer failed. Please try again.'}
                </div>
              )}
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Processing...' : 'Transfer'}
              </button>
            </form>
          </div>
        ) : (
          <div className="no-account">
            <p>Please create an account first to transfer money.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Transfer


