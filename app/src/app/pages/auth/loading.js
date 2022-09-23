// @flow

import React, { useEffect } from 'react'
import { View, Image, StyleSheet } from 'react-native'

import { useDispatch } from 'react-redux'
import { ActivityIndicator, Button, Text, useTheme } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import api from '~/api'
import { spacing } from '~/theme'
import Logo from '~/assets/images/logo.png'
import {
  updateDeviceModels,
  updateRelayModels,
  updateSensorModels,
} from '~/store/reducers/device'
import useLogout from '~/hooks/useLogout'

const LoadingScreen = ({ isLoading, hasError }) => {
  const insets = useSafeAreaInsets()
  const theme = useTheme()
  const logout = useLogout()
  const dispatch = useDispatch()

  const fetchDeviceModels = () => {
    api.devices
      .getDeviceModels()
      .then((res) => {
        dispatch(
          updateDeviceModels({
            data: res.data,
            isLoading: false,
            hasError: false,
          })
        )
      })
      .catch(() => {
        updateDeviceModels({
          data: [],
          isLoading: false,
          hasError: true,
        })
      })
  }

  const fetchSensors = () => {
    api.devices
      .getSensorModels()
      .then((res) => {
        dispatch(
          updateSensorModels({
            data: res.data,
            isLoading: false,
            hasError: false,
          })
        )
      })
      .catch(() => {
        updateSensorModels({
          data: [],
          isLoading: false,
          hasError: true,
        })
      })
  }

  const fetchRelays = () => {
    api.devices
      .getRelayModels()
      .then((res) => {
        dispatch(
          updateRelayModels({
            data: res.data,
            isLoading: false,
            hasError: false,
          })
        )
      })
      .catch(() => {
        updateRelayModels({
          data: [],
          isLoading: false,
          hasError: true,
        })
      })
  }

  const fetchStartupData = async () => {
    fetchDeviceModels()
    fetchRelays()
    fetchSensors()
  }

  useEffect(() => {
    fetchStartupData()
  }, [])

  return (
    <View style={styles.root}>
      <Image
        source={{ uri: Image.resolveAssetSource(Logo).uri }}
        style={{ width: 100, height: 100 }}
      />
      <View
        style={[
          styles.loading,
          {
            paddingBottom: insets.bottom + spacing,
          },
        ]}
      >
        {isLoading && (
          <>
            <ActivityIndicator size={24} />
            <Button onPress={logout}>Logout</Button>
          </>
        )}
        {hasError && !isLoading && (
          <>
            <Text style={{ color: theme.colors.black, marginBottom: spacing }}>
              Connection Error
            </Text>
            <Button onPress={fetchStartupData} mode="outlined">
              Try again
            </Button>
          </>
        )}
      </View>
    </View>
  )
}

export default LoadingScreen

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    position: 'relative',
  },
  loading: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
  },
})
