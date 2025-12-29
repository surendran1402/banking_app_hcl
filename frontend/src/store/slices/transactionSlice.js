import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { userAPI } from '../../services/api'

// Async thunks
export const transferMoney = createAsyncThunk(
  'transactions/transfer',
  async (transferData, { rejectWithValue }) => {
    try {
      const response = await userAPI.transfer(transferData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const fetchTransactions = createAsyncThunk(
  'transactions/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userAPI.getTransactions()
      if (response.data && response.data.success) {
        return response.data
      } else {
        return rejectWithValue({ message: response.data?.message || 'Failed to fetch transactions' })
      }
    } catch (error) {
      console.error('Fetch transactions API error:', error)
      const errorData = error.response?.data || { message: error.message || 'Failed to load transactions' }
      return rejectWithValue(errorData)
    }
  }
)

const initialState = {
  transactions: [],
  loading: false,
  error: null,
}

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Transfer Money
      .addCase(transferMoney.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(transferMoney.fulfilled, (state, action) => {
        state.loading = false
        // Add new transaction to the list
        if (action.payload.data) {
          state.transactions.unshift(action.payload.data)
        }
        state.error = null
      })
      .addCase(transferMoney.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch Transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false
        state.transactions = action.payload.data || []
        state.error = null
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError } = transactionSlice.actions
export default transactionSlice.reducer

