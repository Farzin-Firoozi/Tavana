export const authRoutes = {
  login: 'rest-auth/login/',
  register: 'rest-auth/registration/',
  refreshToken: 'rest-auth/ token/verify/',
  verifyToken: 'rest-auth/token/refresh/',
}

export const deviceRoutes = {
  devices: 'api/device/',
  deviceModels: 'api/device_models/',
  deviceSensors: `api/sensor_device/`,
  deviceRelays: `api/relay_device/`,
  sensors: 'api/sensor/',
  sensorData: (deviceId, sensorId) =>
    `api/value/sensor/${deviceId}/${sensorId}`,
  relays: 'api/relay/',
  pins: (deviceId) => `api/pin/${deviceId}/`,
}
