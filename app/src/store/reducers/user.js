import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    isLoggedIn: false,
    user: {},
  },
  reducers: {
    login: (state) => {
      state.isLoggedIn = true
    },
    logout: (state) => {
      state.isLoggedIn = false
      state.user = {}
    },
    setUser: (state, action) => {
      state.user = action.payload
    },
  },
})

// ACTIONS export
export const { login, logout, setUser } = userSlice.actions
export default userSlice.reducer
