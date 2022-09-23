import { useNavigation, useRoute } from '@react-navigation/native'
import { Formik } from 'formik'
import React, { useEffect, useMemo, useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { ActivityIndicator, useTheme } from 'react-native-paper'
import DropDown from 'react-native-paper-dropdown'
import { useSelector } from 'react-redux'
import Header from '~/components/header'
import { selectRelays, selectSensors } from '~/store/selectors/device'
import { spacing } from '~/theme'

import Icon from 'react-native-vector-icons/Ionicons'
import { PINS } from '~/config'
import api from '~/api'

const INITIAL_VALUES = {
  D0: false,
  D1: false,
  D2: false,
  D3: false,
  D4: false,
  D5: false,
  D10: false,
  D11: false,
  D12: false,
  D13: false,
}

const PinsScreen = () => {
  const route = useRoute()
  const theme = useTheme()
  const [isLoading, setIsLoading] = useState(false)

  const navigation = useNavigation()
  const [data, setData] = useState({})

  const deviceId = route.params?.deviceId
  const deviceSensors = route?.params?.deviceSensors
  const deviceRelays = route?.params?.deviceRelays

  const sensors = useSelector(selectSensors)
  const relays = useSelector(selectRelays)

  const [showDropDown, setShowDropDown] = useState(INITIAL_VALUES)

  const openDropDown = (name) => {
    setShowDropDown((prev) => ({ ...prev, [name]: true }))
  }

  const hideDropDown = (name) => {
    setShowDropDown((prev) => ({ ...prev, [name]: false }))
  }

  const inputTheme = {
    colors: {
      background: theme.colors.surface,
      placeholder: theme.colors.generateBlack(0.6),
      text: theme.colors.black,
    },
  }

  const sensorsData = deviceSensors.map((sensor) => {
    const name = sensors.data.filter((item) => item.pk === sensor.sensor)[0]
      ?.uniq_name

    return {
      label: name + ' | ' + sensor.pk,
      value: `sensor_${sensor.pk}`,
    }
  })

  const relaysData = deviceRelays.map((relay) => {
    const name = relays.data.filter((item) => item.pk === relay.relay)[0]
      ?.uniq_name
    return {
      label: name + ' | ' + relay.pk,
      value: `relay_${relay.pk}`,
    }
  })

  const emptyData = {
    label: 'Empty',
    value: null,
  }

  const fetchPins = () => {
    setIsLoading(true)
    api.devices
      .getDevicePins(deviceId)
      .then((res) => {
        setData(res.data)
      })
      .finally(() => setIsLoading(false))
  }

  const convertPins = () => {
    let temp = {}

    if (!data.pin) {
      return {}
    }

    Object.keys(data?.pin).forEach((key) => {
      temp[PINS.filter((item) => +item?.id === +key)?.[0]?.name] =
        data?.pin?.[key]
    })

    return temp
  }

  const submitPins = (values) => {
    let temp = {}
    setIsLoading(true)

    Object.keys(values).forEach((key) => {
      temp[PINS.filter((item) => item.name === key)[0].id] = values[key]
    })

    api.devices
      .updateDevicePins(deviceId, { ...data, pin: temp })
      .then(() => {
        navigation.goBack()
      })
      .catch((err) => {
        console.log(err.response)
      })
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    fetchPins()
  }, [])

  const initialData = useMemo(() => convertPins(), [data])

  return (
    <Formik
      initialValues={initialData}
      onSubmit={submitPins}
      enableReinitialize
      validateOnChange
    >
      {({ values, setFieldValue, submitForm }) => {
        return (
          <>
            <Header
              center={{ render: 'Pins' }}
              right={{
                render: (
                  <TouchableOpacity
                    disabled={isLoading}
                    onPress={submitForm}
                    style={[styles.addDeviceIcon]}
                  >
                    {isLoading ? (
                      <ActivityIndicator size={24} />
                    ) : (
                      <Icon
                        name="checkmark"
                        size={28}
                        color={theme.colors.primary}
                      />
                    )}
                  </TouchableOpacity>
                ),
              }}
            />
            <ScrollView contentContainerStyle={styles.root}>
              {Object.keys(INITIAL_VALUES).map((name) => (
                <View key={name} style={styles.wrapper}>
                  <DropDown
                    label={name}
                    mode={'outlined'}
                    visible={showDropDown[name]}
                    showDropDown={() => openDropDown(name)}
                    onDismiss={() => hideDropDown(name)}
                    value={values[name]}
                    setValue={(newVal) => setFieldValue(name, newVal)}
                    list={[emptyData, ...sensorsData, ...relaysData]}
                    theme={{
                      colors: {
                        ...inputTheme.colors,
                        primary: theme.colors.primary,
                      },
                    }}
                  />
                </View>
              ))}
            </ScrollView>
          </>
        )
      }}
    </Formik>
  )
}

export default PinsScreen

const styles = StyleSheet.create({
  root: {
    padding: spacing,
  },
  wrapper: {
    marginBottom: spacing,
  },
})
