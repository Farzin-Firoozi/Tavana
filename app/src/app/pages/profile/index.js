import React, { useState } from 'react'

import { Text, useTheme } from 'react-native-paper'
import Icon from 'react-native-vector-icons/Ionicons'
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native'

import Header from '~/components/header'
import { roundness, spacing } from '~/theme'
import ConfirmModal from '~/components/modals/confirm'
import useLogout from '~/hooks/useLogout'

const ProfilePage = () => {
  const theme = useTheme()
  const [showLogout, setShowLogout] = useState(false)
  const logout = useLogout()

  return (
    <>
      <Header left={{ render: null }} center={{ render: 'Profile' }} />
      <ScrollView contentContainerStyle={styles.root}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: theme.colors.generateBlack(0.1),
            },
          ]}
        >
          <Icon
            name="ios-information-circle-outline"
            size={24}
            color={theme.colors.black}
            style={{ marginRight: spacing / 2 }}
          />
          <Text style={{ color: theme.colors.black }}>Info</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowLogout(true)}
          style={[
            styles.button,
            {
              backgroundColor: theme.colors.red,
            },
          ]}
        >
          <Icon
            name="exit-outline"
            size={24}
            color={theme.colors.staticWhite}
            style={{ marginRight: spacing / 2 }}
          />
          <Text style={{ color: theme.colors.staticWhite }}>Logout</Text>
        </TouchableOpacity>

        <ConfirmModal
          close={() => setShowLogout(false)}
          isOpen={showLogout}
          options={{
            title: 'Are you sure you want to logout?',
            buttons: {
              confirm: {
                text: 'Yes, Logout.',
                color: theme.colors.red,
                textColor: theme.colors.staticWhite,
                onPress: logout,
              },
              cancel: {
                text: 'Discard',
                color: theme.colors.generateBlack(0.5),

                onPress: () => setShowLogout(false),
              },
            },
          }}
        />
      </ScrollView>
    </>
  )
}

export default ProfilePage

const styles = StyleSheet.create({
  root: {
    padding: spacing,
  },
  button: {
    padding: spacing,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: roundness,
    marginBottom: spacing / 2,
  },
})
