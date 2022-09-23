import React, { useState } from 'react'
import Header from '~/components/header'
import { Text, TextInput, useTheme } from 'react-native-paper'
import { useNavigation, useRoute } from '@react-navigation/native'
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import { spacing } from '~/theme'
import { useSelector } from 'react-redux'
import { selectRelays, selectSensors } from '~/store/selectors/device'
import Icon from 'react-native-vector-icons/Ionicons'
import api from '~/api'

const AddNewSpec = () => {
  const route = useRoute()
  const type = route.params?.type
  const deviceId = route.params?.deviceId
  const navigation = useNavigation()

  const [timeValue, setTimeValue] = useState('3')

  const [selectedSpec, setSelectedSpec] = useState(null)
  const theme = useTheme()

  const isSensorType = type === 'sensor'
  const title = isSensorType ? 'Add new Sensor' : 'Add new Relay'
  const sensors = useSelector(selectSensors)
  const relays = useSelector(selectRelays)

  const isSubmitDisabled = !selectedSpec

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedSpec(item)
        }}
        style={[styles.item]}
      >
        <Text
          style={{
            color:
              selectedSpec?.pk === item?.pk
                ? theme.colors.black
                : theme.colors.generateBlack(0.5),
          }}
        >
          {item.uniq_name}
        </Text>
        <View style={styles.divider} />
        {selectedSpec?.pk === item?.pk && (
          <Icon name="checkbox" size={24} color={theme.colors.primary} />
        )}
      </TouchableOpacity>
    )
  }

  const keyExtractor = (item) => {
    return item.pk.toString()
  }

  const onRelaySubmit = () => {
    api.devices
      .addDeviceRelay({
        relay: selectedSpec?.pk,
        device: deviceId,
        enable: false,
      })
      .then((res) => {
        navigation.goBack()
        console.log(res)
      })
      .catch((err) => console.log(err.response.data))
  }

  const onSensorSubmit = () => {
    api.devices
      .addDeviceSensor({
        sensor: selectedSpec?.pk,
        device: deviceId,
        enable: false,
        sampleDuration: timeValue,
      })
      .then((res) => {
        navigation.goBack()
        console.log(res)
      })
      .catch((err) => console.log(err.response.data))
  }

  return (
    <>
      <Header
        center={{ render: title }}
        right={{
          render: (
            <TouchableOpacity
              disabled={isSubmitDisabled}
              onPress={isSensorType ? onSensorSubmit : onRelaySubmit}
              style={[styles.addDeviceIcon]}
            >
              <Icon
                name="checkmark"
                size={28}
                color={
                  isSubmitDisabled
                    ? theme.colors.generateBlack(0.5)
                    : theme.colors.primary
                }
              />
            </TouchableOpacity>
          ),
        }}
      />
      <FlatList
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={
          isSensorType && (
            <TextInput
              mode="outlined"
              value={timeValue}
              onChangeText={setTimeValue}
              keyboardType="number-pad"
              label="Sample Rate (s)"
            />
          )
        }
        contentContainerStyle={styles.root}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: 1,
              backgroundColor: theme.colors.generateBlack(0.1),
            }}
          />
        )}
        data={isSensorType ? sensors?.data : relays?.data}
      />
    </>
  )
}

export default AddNewSpec

const styles = StyleSheet.create({
  root: {
    padding: spacing,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing,
  },
  divider: {
    width: spacing / 2,
  },
  addDeviceIcon: {
    borderRadius: 9999,
    height: 36,
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
