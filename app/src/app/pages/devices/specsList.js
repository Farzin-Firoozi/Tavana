import React, { useCallback, useState } from 'react'
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import Header from '~/components/header'
import { Button, Switch, Text, Title, useTheme } from 'react-native-paper'

import Icon from 'react-native-vector-icons/Ionicons'
import { useSelector } from 'react-redux'
import { selectRelays, selectSensors } from '~/store/selectors/device'
import { roundness, spacing } from '~/theme'
import api from '~/api'
import token from '~/utils/token'
import { showMessage } from 'react-native-flash-message'

const SpecsList = () => {
  const route = useRoute()

  const data = route?.params?.data || []
  const type = route.params?.type
  const deviceId = route.params?.deviceId

  const isTypeSensor = type === 'sensor'
  const title = isTypeSensor ? 'Sensors' : 'Relays'

  const renderItem = ({ item }) => {
    if (isTypeSensor) {
      return <SensorItem item={item} deviceId={deviceId} />
    }
    return <RelayItem item={item} deviceId={deviceId} />
  }

  const keyExtractor = useCallback((item, index) => {
    return item?.pk + '-' + index
  }, [])

  return (
    <>
      <Header
        center={{ render: title }}
        right={{ render: <AddNewButton type={type} deviceId={deviceId} /> }}
      />
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.root}
      />
    </>
  )
}

export default SpecsList

const styles = StyleSheet.create({
  addDeviceIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  root: {
    padding: spacing,
  },
  button: {
    padding: spacing,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: roundness,
    marginBottom: spacing / 2,
    justifyContent: 'space-between',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  identifier: {
    marginLeft: spacing / 2,
  },
})

const AddNewButton = ({ type, deviceId }) => {
  const navigation = useNavigation()
  const theme = useTheme()

  const onPress = () => {
    navigation.push('AddNewSpec', { type, deviceId })
  }

  return (
    <TouchableOpacity onPress={onPress} style={styles.addDeviceIcon}>
      <Icon name="add" size={28} color={theme.colors.primary} />
    </TouchableOpacity>
  )
}

const RelayItem = ({ item, deviceId }) => {
  const theme = useTheme()
  const relays = useSelector(selectRelays)

  const [isEnabled, setIsEnabled] = useState(item.enable)

  const currentItem = relays.data?.filter((el) => {
    return +el.pk === item?.relay
  })?.[0]

  const enableDevice = (newValue) => {
    api.devices
      .toggleRelayDevice(deviceId, {
        ...item,
        enable: newValue,
      })
      .then(() => {
        setIsEnabled(!!newValue)
      })
      .catch((err) =>
        showMessage({
          message: err?.response?.data?.error,
          type: 'danger',
          icon: 'auto',
        })
      )
  }

  return (
    <View
      style={[
        styles.button,
        {
          borderColor: theme.colors.generateBlack(0.1),
        },
      ]}
    >
      <View style={styles.row}>
        <Title style={{ color: theme.colors.black }}>
          {currentItem?.uniq_name}
        </Title>

        <View style={[styles.row, styles.identifier]}>
          <Icon
            name="ios-information-circle-outline"
            size={18}
            color={theme.colors.generateBlack(0.7)}
          />
          <Text style={{ color: theme.colors.generateBlack(0.7) }}>
            {item?.pk}
          </Text>
        </View>
      </View>

      <Switch value={isEnabled} onValueChange={enableDevice} />
    </View>
  )
}

const SensorItem = ({ item, deviceId }) => {
  const theme = useTheme()
  const sensors = useSelector(selectSensors)
  const navigation = useNavigation()

  const openSensorDetails = () => {
    navigation.push('SensorData', {
      sensorId: item.pk,
      deviceId: deviceId,
    })
  }

  const currentItem = sensors.data?.filter((el) => {
    return +el.pk === item?.sensor
  })?.[0]

  const openSocketPage = async () => {
    const accessToken = await token.getAccessToken()

    navigation.push('SpecSocket', {
      sensorId: item.pk,
      deviceId: deviceId,
      accessToken,
    })
  }

  return (
    <View style={styles.row}>
      <TouchableOpacity
        onPress={openSensorDetails}
        style={[
          styles.button,
          {
            borderColor: theme.colors.generateBlack(0.1),
          },
        ]}
      >
        <View style={styles.row}>
          <Title style={{ color: theme.colors.black }}>
            {currentItem?.uniq_name}
          </Title>

          <View style={[styles.row, styles.identifier]}>
            <Icon
              name="ios-information-circle-outline"
              size={18}
              color={theme.colors.generateBlack(0.7)}
            />
            <Text style={{ color: theme.colors.generateBlack(0.7) }}>
              {item?.pk}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      {!!item?.mutual_communication?.status && (
        <Button onPress={openSocketPage}>Communicate</Button>
      )}
    </View>
  )
}
