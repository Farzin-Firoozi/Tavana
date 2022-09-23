import api from './api.service'
import { authRoutes, deviceRoutes } from './routes'

const auth = {
  login: (data) => api.post(authRoutes.login, data),
  register: (data) => api.post(authRoutes.register, data),
}

const devices = {
  myDevices: () => api.get(deviceRoutes.devices),
  addNew: (data) => api.post(deviceRoutes.devices, data),
  getDeviceModels: () => api.get(deviceRoutes.deviceModels),
  getSensorModels: () => api.get(deviceRoutes.sensors),
  getRelayModels: () => api.get(deviceRoutes.relays),
  getDeviceSensors: (params) => api.get(deviceRoutes.deviceSensors, params),
  getDeviceRelays: (params) => api.get(deviceRoutes.deviceRelays, params),
  addDeviceSensor: (params) => api.post(deviceRoutes.deviceSensors, params),
  addDeviceRelay: (params) => api.post(deviceRoutes.deviceRelays, params),
  getDevicePins: (deviceId) => api.get(deviceRoutes.pins(deviceId)),
  updateDevicePins: (deviceId, params) =>
    api.put(deviceRoutes.pins(deviceId), params),
  getDeviceSensorsData: (deviceId, sensorId) =>
    api.get(deviceRoutes.sensorData(deviceId, sensorId)),
  toggleRelayDevice: (deviceId, params) =>
    api.put(deviceRoutes.deviceRelays + deviceId + '/', params),
  getDeviceToken: (deviceId) => api.get(deviceRoutes.deviceToken(deviceId)),
  getBinaryLink: () => api.get(deviceRoutes.getBinary),
}

export default { auth, devices }
