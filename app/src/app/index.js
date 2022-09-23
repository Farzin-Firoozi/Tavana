import React, { useEffect } from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { lightColors } from '../theme/colors'

import DevicesPage from '~/app/pages/devices'
import LoginPage from './pages/auth/login'
import RegisterPage from './pages/auth/register'

import { axios_instance } from '../api/api.service'
import Tabbar from '~/components/tabBar'
import { useSelector } from 'react-redux'
import FlashMessage from 'react-native-flash-message'
// import LoadingScreen from './pages/auth/loading'

import { authRoutes } from '~/api/routes'

import useLogout from '~/hooks/useLogout'
import { selectUserLoggedIn } from '~/store/selectors/user'
import token from '~/utils/token'
import StartingPage from './pages/auth/start'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import ProfilePage from './pages/profile'
import AddDevicePage from './pages/devices/addDevice'
import DeviceDetails from './pages/devices/deviceDetails'
import SpecsList from './pages/devices/specsList'
import AddNewSpec from './pages/devices/addNewSpec'
import {
  selectDeviceModels,
  selectRelays,
  selectSensors,
} from '~/store/selectors/device'
import LoadingScreen from './pages/auth/loading'
import SensorData from './pages/devices/sensorData'
import PinsScreen from './pages/devices/pins'
import SpecSocket from './pages/devices/specSocket'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

let isRefreshing = false

const retryFailedRequest = async (error, onCompleteFailure) => {
  const config = error.config
  console.log('got err')
  if (error.response && error.response.status === 401 && !config._retry) {
    config._retry = true
    try {
      if (!isRefreshing) {
        const refreshToken = await token.getRefreshToken()

        isRefreshing = true

        const newResponse = await axios_instance.post(
          authRoutes.refreshToken,
          {
            refresh: refreshToken || 'some random dummy string',
          },
          {
            _retry: true,
          }
        )

        console.log('------------------ refresh -----------------')
        console.log(newResponse.data)

        await token.setAccessToken(newResponse.data.access)
        isRefreshing = false
        return axios_instance(config)
      }
      return Promise.reject(error)
    } catch (_err) {
      onCompleteFailure()
      return Promise.reject(_err)
    }
  }

  return Promise.reject(error)
}

function App() {
  const logout = useLogout()

  const isLoggedIn = useSelector(selectUserLoggedIn)

  const deviceRelays = useSelector(selectRelays)
  const deviceSensors = useSelector(selectSensors)
  const deviceModels = useSelector(selectDeviceModels)

  const isLoading =
    deviceModels.isLoading || deviceSensors.isLoading || deviceRelays.isLoading

  const hasError =
    deviceModels.hasError || deviceSensors.hasError || deviceRelays.hasError

  useEffect(() => {
    FlashMessage.setColorTheme({
      success: lightColors.green,
      warning: lightColors.orange,
      info: lightColors.generateBlack(0.8),
      danger: lightColors.red,
    })

    axios_instance.interceptors.response.use(
      (response) => {
        return response
      },
      async (error) => retryFailedRequest(error, logout)
    )

    axios_instance.interceptors.response.use(
      (response) => {
        return response
      },
      async (error) => {
        if (error.response.status === 401) {
          console.log('Ignore error')
          return Promise.reject(error)
        }

        // if (error?.response?.data?.detail) {
        //   console.log('inside')
        //   showMessage({
        //     message: error?.response?.data?.detail,
        //     type: 'danger',
        //     icon: 'auto',
        //   })
        // } else {
        //   Object.keys(error?.response?.data).forEach((key) => {
        //     console.log(key, error?.response?.data?.[key]?.[0])
        //     showMessage({
        //       message: 'ridi',
        //       // description: error?.response?.data?.[key]?.[0],
        //       description: 'pish',
        //       type: 'danger',
        //       icon: 'auto',
        //     })
        //   })
        // }

        return Promise.reject(error)
      }
    )
  }, [isLoggedIn])

  if (!isLoggedIn) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Starting" component={StartingPage} />
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Register" component={RegisterPage} />
      </Stack.Navigator>
    )
  }

  if (isLoading || hasError) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Loading">
          {() => <LoadingScreen isLoading={isLoading} hasError={hasError} />}
        </Stack.Screen>
      </Stack.Navigator>
    )
  }

  return (
    <>
      <Tab.Navigator
        safeAreaInsets={{ top: 0 }}
        tabBar={(props) => <Tabbar {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tab.Screen name="DevicesTab" component={DevicesStack} />
        <Tab.Screen name="ProfileTab" component={ProfilePage} />
      </Tab.Navigator>
    </>
  )
}

export default App

const DevicesStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Devices" component={DevicesPage} />
      <Stack.Screen name="AddDevice" component={AddDevicePage} />
      <Stack.Screen name="DeviceDetails" component={DeviceDetails} />
      <Stack.Screen name="SpecsList" component={SpecsList} />
      <Stack.Screen name="SpecSocket" component={SpecSocket} />
      <Stack.Screen name="AddNewSpec" component={AddNewSpec} />
      <Stack.Screen name="SensorData" component={SensorData} />
      <Stack.Screen name="Pins" component={PinsScreen} />
    </Stack.Navigator>
  )
}
