import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import { SOCKET_API_URL } from '~/config'
import { ActivityIndicator, TextInput, useTheme } from 'react-native-paper'
import Header from '~/components/header'

import Icon from 'react-native-vector-icons/Ionicons'
import { spacing } from '~/theme'
import { showMessage } from 'react-native-flash-message'

const SpecSocket = () => {
  const route = useRoute()
  const theme = useTheme()

  const [data, setData] = useState([])

  const [isConnected, setIsConnected] = useState(-1)

  const deviceId = route.params?.deviceId
  const sensorId = route.params?.sensorId
  const accessToken = route.params?.accessToken

  const [messageText, setMessageText] = useState('')

  var ws = useRef(
    new WebSocket(
      `${SOCKET_API_URL}/ws/test/${deviceId}/${sensorId}/?token=${accessToken}`
    )
  ).current

  useEffect(() => {
    const serverMessagesList = []
    ws.onopen = () => {
      setIsConnected(true)
      console.log('Connected to the server')
      // setServerState('Connected to the server')
    }
    ws.onclose = (e) => {
      console.log('Disconnected. Check internet or server.')
      setIsConnected(false)
    }
    ws.onerror = (e) => {
      showMessage({ message: e.message, type: 'danger' })
      console.log(e.message)
    }
    ws.onmessage = (e) => {
      console.log(e.data)
      serverMessagesList.push(JSON.parse(e.data))
      setData([...serverMessagesList])
    }
  }, [])

  const submitMessage = () => {
    ws.send(JSON.stringify({ message: messageText }))
    setMessageText('')
  }

  const renderMessageItem = useCallback(({ item }) => {
    return <Text>{item?.message}</Text>
  }, [])

  const keyExtractor = useCallback((item, index) => {
    return 'message' + index
  }, [])

  return (
    <>
      <Header
        center={{ render: 'Communication' }}
        right={{ render: <Status status={isConnected} /> }}
      />
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderMessageItem}
        style={{ flex: 1 }}
        contentContainerStyle={styles.list}
      />
      <View style={styles.row}>
        <TextInput
          value={messageText}
          mode="outlined"
          onChangeText={setMessageText}
          style={styles.input}
          placeholder="Enter your message."
        />

        <TouchableOpacity style={styles.send} onPress={submitMessage}>
          <Icon name="ios-send" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
    </>
  )
}

export default SpecSocket

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing,
  },
  input: {
    flex: 1,
  },
  send: {
    paddingLeft: spacing,
  },
  messages: {
    flex: 1,
  },
  list: {
    padding: spacing,
  },
})

const Status = ({ status }) => {
  const theme = useTheme()

  if (status === -1) {
    return <ActivityIndicator size={10} />
  }
  if (status) {
    return (
      <View
        style={{
          width: 10,
          aspectRatio: 1,
          backgroundColor: theme.colors.green,
          borderRadius: 85,
        }}
      />
    )
  }
  return (
    <View
      style={{
        width: 10,
        aspectRatio: 1,
        backgroundColor: theme.colors.red,
        borderRadius: 85,
      }}
    />
  )
}
