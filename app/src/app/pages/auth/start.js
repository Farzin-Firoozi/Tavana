import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { Button } from 'react-native-paper'
import { spacing } from '~/theme'

import Logo from '~/assets/images/logo.png'
import { useNavigation } from '@react-navigation/native'

const StartingPage = () => {
  const navigation = useNavigation()

  return (
    <View style={styles.root}>
      <View style={styles.center}>
        <Image
          source={{ uri: Image.resolveAssetSource(Logo).uri }}
          style={{ width: 100, height: 100 }}
        />
      </View>

      <View style={styles.row}>
        <Button
          style={styles.button}
          onPress={() => navigation.push('Login')}
          mode="contained"
          labelStyle={styles.buttonText}
        >
          Login
        </Button>
        <View style={styles.divider} />
        <Button
          onPress={() => navigation.push('Register')}
          mode="contained"
          style={styles.button}
          labelStyle={styles.buttonText}
        >
          Register
        </Button>
      </View>
    </View>
  )
}

export default StartingPage

const styles = StyleSheet.create({
  root: {
    padding: spacing,
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    marginBottom: spacing,
  },
  divider: {
    width: spacing,
    flexShrink: 0,
  },
  button: {
    flex: 1,
  },
  buttonText: {
    padding: spacing / 2,
    paddingHorizontal: spacing,
    color: '#fff',
  },
})
