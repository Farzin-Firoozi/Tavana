import axios from 'axios'
import _ from 'lodash'

import { API_URL } from '~/config'
import token from '~/utils/token'
import { authRoutes, startupRoute } from './routes'

const axios_instance = axios.create({
  baseURL: API_URL,
  timeout: 20000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

const whitelist = [startupRoute, authRoutes.register, authRoutes.login]

axios_instance.interceptors.request.use(async (config) => {
  if (whitelist.includes(config.url)) {
    return config
  }

  const accessToken = await token.getAccessToken()
  config.headers['Authorization'] = `Bearer ${accessToken}`

  return config
})

const request = async (method, url, data = {}, config = {}) => {
  const headers = {}

  const request = {
    headers: { ...headers },
    method,
    url,
    ...config,
  }

  if (!_.isEmpty(data) || data instanceof FormData) {
    if (method?.toLowerCase() !== 'get') request.data = data
    else if (method?.toLowerCase() === 'get') request.params = data
  }
  return axios_instance(request)
}

export default {
  delete: (url, data = {}) => request('delete', url, data),
  get: (url, data = {}) => request('get', url, data),
  patch: (url, data = {}) => request('patch', url, data),
  post: (url, data = {}) => {
    return request('post', url, data)
  },
  put: (url, data = {}) => request('put', url, data),
}

export { axios_instance }
