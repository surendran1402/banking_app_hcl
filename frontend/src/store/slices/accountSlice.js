import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { userAPI } from '../../services/api'

// Async thunks
export const createAccount = createAsyncThunk(
  'account/create',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userAPI.createAccount()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const fetchAccount = createAsyncThunk(
  'account/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userAPI.getAccount()
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const depositMoney = createAsyncThunk(
  'account/deposit',
  async (amount, { rejectWithValue }) => {
    try {
      const response = await userAPI.deposit({ amount })
      if (response.data && response.data.success) {
        return response.data
      } else {
        return rejectWithValue({ message: response.data?.message || 'Deposit failed' })
      }
    } catch (error) {
      console.error('Deposit API error:', error)
      const errorData = error.response?.data || { message: error.message || 'Failed to deposit money' }
      return rejectWithValue(errorData)
    }
  }
)

const initialState = {
  account: null,
  loading: false,
  error: null,
}

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Account
      .addCase(createAccount.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.loading = false
        state.account = action.payload.data
        state.error = null
      })
      .addCase(createAccount.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch Account
      .addCase(fetchAccount.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAccount.fulfilled, (state, action) => {
        state.loading = false
        state.account = action.payload.data
        state.error = null
      })
      .addCase(fetchAccount.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Deposit Money
      .addCase(depositMoney.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(depositMoney.fulfilled, (state, action) => {
        state.loading = false
        state.account = action.payload.data
        state.error = null
      })
      .addCase(depositMoney.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError } = accountSlice.actions
export default accountSlice.reducer

