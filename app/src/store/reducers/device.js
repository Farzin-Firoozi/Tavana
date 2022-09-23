import { createSlice } from '@reduxjs/toolkit'

export const deviceSlice = createSlice({
  name: 'device',
  initialState: {
    models: {
      data: [],
      isLoading: true,
      hasError: false,
    },
    sensors: {
      data: [],
      isLoading: true,
      hasError: false,
    },
    relays: {
      data: [],
      isLoading: true,
      hasError: false,
    },
  },
  reducers: {
    updateDeviceModels: (state, action) => {
      state.models = action.payload
    },
    updateSensorModels: (state, action) => {
      state.sensors = action.payload
    },
    updateRelayModels: (state, action) => {
      state.relays = action.payload
    },
  },
})

// ACTIONS export
export const { updateDeviceModels, updateRelayModels, updateSensorModels } =
  deviceSlice.actions
export default deviceSlice.reducer
