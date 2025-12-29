import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createAccount, fetchAccount, depositMoney } from '../../store/slices/accountSlice'
import './Account.css'

const Account = () => {
  const dispatch = useDispatch()
  const { account, loading, error } = useSelector((state) => state.account)
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [depositAmount, setDepositAmount] = useState('')
  const [depositError, setDepositError] = useState('')

  useEffect(() => {
    dispatch(fetchAccount())
  }, [dispatch])

  const handleCreateAccount = () => {
    dispatch(createAccount()).then(() => {
      dispatch(fetchAccount())
    })
  }

  const handleDeposit = async (e) => {
    e.preventDefault()
    setDepositError('')
    
    const amount = parseFloat(depositAmount)
    if (!amount || amount <= 0) {
      setDepositError('Please enter a valid amount greater than 0')
      return
    }

    const result = await dispatch(depositMoney(amount))
    if (depositMoney.fulfilled.match(result)) {
      setShowDepositModal(false)
      setDepositAmount('')
      setDepositError('')
      dispatch(fetchAccount())
    } else {
      const errorMessage = result.payload?.message || result.payload?.error || result.error?.message || 'Failed to deposit money'
      setDepositError(errorMessage)
      console.error('Deposit error:', result.payload || result.error)
    }
  }

  return (
    <div className="account-container">
      <div className="account-header">
        <h1>My Account</h1>
        {account && (
          <button 
            className="btn-deposit"
            onClick={() => setShowDepositModal(true)}
          >
            <span className="icon">+</span>
            Deposit Money
          </button>
        )}
      </div>

      <div className="account-card">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        ) : account ? (
          <div className="account-details">
            <div className="account-balance-section">
              <div className="balance-label">Account Balance</div>
              <div className="balance-amount">₹{account.balance?.toFixed(2) || '0.00'}</div>
            </div>

            <div className="account-info-grid">
              <div className="info-card">
                <div className="info-icon">🏦</div>
                <div className="info-content">
                  <label>Account Number</label>
                  <div className="info-value">{account.accountNumber}</div>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">👤</div>
                <div className="info-content">
                  <label>Account Holder</label>
                  <div className="info-value">{account.userName}</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="no-account">
            <div className="no-account-icon">💳</div>
            <h2>No Account Found</h2>
            <p>Create your account to start banking with us</p>
            <button 
              onClick={handleCreateAccount} 
              className="btn-primary" 
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        )}
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error.message || 'An error occurred'}
          </div>
        )}
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="modal-overlay" onClick={() => setShowDepositModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Deposit Money</h2>
              <button 
                className="modal-close"
                onClick={() => {
                  setShowDepositModal(false)
                  setDepositAmount('')
                  setDepositError('')
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleDeposit} className="deposit-form">
              <div className="form-group">
                <label htmlFor="amount">Amount</label>
                <div className="input-wrapper">
                  <input
                    type="number"
                    id="amount"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="amount-input"
                    autoFocus
                  />
                </div>
                {depositError && <div className="field-error">{depositError}</div>}
              </div>
              <div className="form-actions">
                <button 
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setShowDepositModal(false)
                    setDepositAmount('')
                    setDepositError('')
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Deposit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Account
