import React, { useCallback, useState } from 'react'

import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons'
import { useSelector } from 'react-redux'
import { Caption, Title, useTheme } from 'react-native-paper'
import { useFocusEffect, useNavigation } from '@react-navigation/native'

import api from '~/api'
import Header from '~/components/header'
import { roundness, spacing } from '~/theme'

import { selectDeviceModels } from '~/store/selectors/device'

const DevicesPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [myDevices, setMyDevices] = useState([])

  const fetchMyDevices = () => {
    setIsLoading(true)
    api.devices
      .myDevices()
      .then((res) => setMyDevices(res.data))
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false))
  }

  useFocusEffect(
    useCallback(() => {
      fetchMyDevices()
    }, [])
  )

  const renderItem = ({ item }) => {
    return <DeviceItem item={item} />
  }

  const keyExtractor = (item, index) => {
    return `${item.pk}-${index}`
  }

  return (
    <>
      <Header
        left={{ render: null }}
        center={{ render: 'Devices' }}
        right={{ render: <AddNewDeviceButton icon /> }}
      />
      <FlatList
        data={myDevices}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListFooterComponent={AddNewDeviceButton}
        contentContainerStyle={styles.root}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchMyDevices} />
        }
      />
    </>
  )
}

export default DevicesPage

const AddNewDeviceButton = ({ icon }) => {
  const navigation = useNavigation()
  const theme = useTheme()

  const onPress = () => {
    navigation.push('AddDevice')
  }

  if (icon) {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.addDeviceIcon,
          {
            backgroundColor: theme.colors.primary,
          },
        ]}
      >
        <Icon name="add" size={24} color={theme.colors.staticWhite} />
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          styles.addDevice,
          {
            borderColor: theme.colors.generateBlack(0.5),
          },
        ]}
      >
        <Title
          style={{
            color: theme.colors.generateBlack(0.5),
          }}
        >
          Add Device
        </Title>
      </View>
    </TouchableOpacity>
  )
}

const DeviceItem = ({ item }) => {
  const navigation = useNavigation()
  const theme = useTheme()
  const deviceModels = useSelector(selectDeviceModels)

  const currentDeviceModel = deviceModels?.data?.filter(
    (device) => +device?.pk === +item?.deviceModel
  )?.[0]

  const onPress = () => {
    navigation.push('DeviceDetails', {
      id: item?.pk,
    })
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          styles.device,
          {
            borderColor: theme.colors.generateBlack(0.2),
          },
        ]}
      >
        <View>
          <Title style={{ color: theme.colors.black }}>{item?.name}</Title>
          <Caption style={{ color: theme.colors.primary }}>
            {currentDeviceModel?.name}
          </Caption>
        </View>
        <Icon
          name="chevron-forward"
          color={theme.colors.generateBlack(0.5)}
          size={24}
        />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  root: {
    padding: spacing,
  },
  device: {
    padding: spacing,
    flex: 1,
    borderRadius: roundness,
    borderWidth: 1,
    marginBottom: spacing,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addDevice: {
    padding: spacing,
    flex: 1,
    borderRadius: roundness,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  addDeviceIcon: {
    borderRadius: 9999,
    height: 36,
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
