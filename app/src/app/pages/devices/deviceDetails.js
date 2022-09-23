import React, { useEffect, useState } from 'react'
import { roundness, spacing } from '~/theme'
import Header from '~/components/header'
import { ScrollView, StyleSheet, View } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import {
  ActivityIndicator,
  Button,
  Caption,
  Title,
  useTheme,
} from 'react-native-paper'
import Icon from 'react-native-vector-icons/Ionicons'
import api from '~/api'

const DeviceDetails = () => {
  const route = useRoute()
  const navigation = useNavigation()
  const theme = useTheme()

  const [deviceRelays, setDeviceRelays] = useState([])
  const [deviceSensors, setDeviceSensors] = useState([])
  const [sensorsLoading, setSensorsLoading] = useState(false)
  const [relaysLoading, setRelaysLoading] = useState(false)

  const fetchDeviceSensors = (deviceId) => {
    setSensorsLoading(true)
    api.devices
      .getDeviceSensors({ device: deviceId })
      .then((res) => {
        setDeviceSensors(res.data)
      })
      .finally(() => setSensorsLoading(false))
  }

  const fetchDeviceRelays = (deviceId) => {
    setRelaysLoading(true)
    api.devices
      .getDeviceRelays({ device: deviceId })
      .then((res) => {
        setDeviceRelays(res.data)
      })
      .finally(() => setRelaysLoading(false))
  }

  useEffect(() => {
    fetchDeviceRelays(route.params?.id)
    fetchDeviceSensors(route.params?.id)
  }, [route.params])

  const openPins = () => {
    navigation.push('Pins', {
      deviceId: route.params?.id,
      deviceRelays,
      deviceSensors,
    })
  }

  const openSensors = () => {
    navigation.push('SpecsList', {
      data: deviceSensors,
      type: 'sensor',
      deviceId: route.params?.id,
    })
  }

  const openRelays = () => {
    navigation.push('SpecsList', {
      data: deviceRelays,
      type: 'relay',
      deviceId: route.params?.id,
    })
  }

  return (
    <>
      <Header center={{ render: 'Device Details' }} />
      <ScrollView contentContainerStyle={styles.root}>
        <View style={styles.row}>
          <View style={styles.item}>
            <TouchableOpacity
              onPress={openSensors}
              style={[styles.button, { backgroundColor: theme.colors.yellow }]}
            >
              <View style={styles.content}>
                <Title style={{ color: theme.colors.staticWhite }}>
                  Sensors
                </Title>
                <Caption
                  style={{ color: theme.colors.generateStaticWhite(0.7) }}
                >
                  {sensorsLoading ? (
                    <ActivityIndicator
                      color={theme.colors.generateStaticWhite(0.7)}
                      size={12}
                    />
                  ) : (
                    deviceSensors?.length + ' Available'
                  )}
                </Caption>
              </View>
              <Icon
                name="analytics-outline"
                size={48}
                color={theme.colors.staticWhite}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />
          <View style={styles.item}>
            <TouchableOpacity
              onPress={openRelays}
              style={[styles.button, { backgroundColor: theme.colors.red }]}
            >
              <View style={styles.content}>
                <Title style={{ color: theme.colors.staticWhite }}>
                  Relays
                </Title>
                <Caption
                  style={{ color: theme.colors.generateStaticWhite(0.7) }}
                >
                  {relaysLoading ? (
                    <ActivityIndicator
                      color={theme.colors.generateStaticWhite(0.7)}
                      size={12}
                    />
                  ) : (
                    deviceRelays?.length + ' Available'
                  )}
                </Caption>
              </View>

              <Icon
                name="flash-outline"
                size={48}
                color={theme.colors.staticWhite}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.rectangle}>
          <TouchableOpacity
            onPress={openPins}
            style={[styles.button, { backgroundColor: theme.colors.purple }]}
          >
            <View style={styles.content}>
              <Title style={{ color: theme.colors.staticWhite }}>Pins</Title>
              <Caption style={{ color: theme.colors.generateStaticWhite(0.7) }}>
                Assign or remove pins
              </Caption>
            </View>

            <Icon
              name="pin-outline"
              size={48}
              color={theme.colors.staticWhite}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* <Button color={theme.colors.red} mode="outlined">
          Delete this device
        </Button> */}
        <Button color={theme.colors.primary} mode="contained">
          Download Binary
        </Button>
      </ScrollView>
    </>
  )
}

export default DeviceDetails

const styles = StyleSheet.create({
  root: {
    padding: spacing,
  },
  divider: {
    width: spacing,
    height: spacing,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    marginBottom: spacing,
  },
  content: {
    flex: 1,
  },
  item: {
    flex: 1,
    aspectRatio: 1,
  },
  rectangle: {
    aspectRatio: 2,
  },
  button: {
    padding: spacing,
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    borderRadius: roundness,
  },
})
