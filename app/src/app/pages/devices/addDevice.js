import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import React, { useState } from 'react'
import Header from '~/components/header'
import api from '~/api'
import { spacing } from '~/theme'
import { HelperText, TextInput, useTheme } from 'react-native-paper'
import Icon from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { selectDeviceModels } from '~/store/selectors/device'

const AddDevicePage = () => {
  const theme = useTheme()
  const navigation = useNavigation()

  const [selectedDevice, setSelectedDevice] = useState(false)

  const [deviceName, setDeviceName] = useState('')

  const isSubmitDisabled = deviceName.length === 0 || !selectedDevice

  const deviceModels = useSelector(selectDeviceModels)
  const handleInputChange = (txt) => {
    setDeviceName(txt)
  }

  const onSubmit = () => {
    api.devices
      .addNew({ name: deviceName, deviceModel: selectedDevice?.pk })
      .then((res) => {
        navigation.goBack()
        console.log(res)
      })
      .catch((err) => console.log(err.response.data))
  }

  const keyExtractor = (item) => {
    return item.pk.toString()
  }

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedDevice(item)
        }}
        style={[styles.item]}
      >
        <Text
          style={{
            color:
              selectedDevice?.pk === item?.pk
                ? theme.colors.black
                : theme.colors.generateBlack(0.5),
          }}
        >
          {item.name}
        </Text>
        <View style={styles.divider} />
        {selectedDevice?.pk === item?.pk && (
          <Icon name="checkbox" size={24} color={theme.colors.primary} />
        )}
      </TouchableOpacity>
    )
  }

  const inputTheme = {
    colors: {
      background: theme.colors.surface,
      placeholder: theme.colors.generateBlack(0.6),
      text: theme.colors.black,
    },
  }

  return (
    <>
      <Header
        center={{ render: 'Add Device' }}
        right={{
          render: (
            <TouchableOpacity
              disabled={isSubmitDisabled}
              onPress={onSubmit}
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
      <View style={styles.root}>
        <TextInput
          mode="outlined"
          label="DeviceName"
          onChangeText={handleInputChange}
          value={deviceName}
          theme={inputTheme}
        />
        <HelperText type="info">Required</HelperText>
      </View>
      <FlatList
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.root}
        data={deviceModels?.data}
      />
    </>
  )
}

export default AddDevicePage

const styles = StyleSheet.create({
  root: {
    padding: spacing,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
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
