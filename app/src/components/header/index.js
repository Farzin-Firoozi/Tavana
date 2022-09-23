// @flow

import { useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useTheme } from 'react-native-paper'
import Icon from 'react-native-vector-icons/Feather'

import { spacing } from '~/theme'

type HeaderProps = {
  left: {
    render: React.ReactNode | String | undefined,
    onPress: () => void,
  },
  center: {
    render: React.ReactNode | String | undefined,
  },
  right: {
    render: React.ReactNode | String | undefined,
    onPress: () => void,
  },
}

const Header = (props: HeaderProps) => {
  const {
    left = { onPress: () => {}, render: 'back' },
    right = { onPress: () => {}, render: 'empty' },
    center = { render: '' },
  } = props

  const theme = useTheme()
  const navigation = useNavigation()

  const renderSideItem = (
    render: React.ReactNode | String | undefined,
    onPress
  ) => {
    if (render === 'empty') {
      return <View style={styles.sideButton} />
    }

    if (render === 'back') {
      return (
        <TouchableOpacity
          style={styles.sideButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-left" size={28} color={theme.colors.primary} />
        </TouchableOpacity>
      )
    }

    return render
  }

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: theme.colors.surface,
          shadowColor: theme.colors.black,
        },
      ]}
    >
      {renderSideItem(left.render, left.onPress)}
      {!!center.render && (
        <Text style={[styles.center, { color: theme.colors.black }]}>
          {center.render}
        </Text>
      )}
      {renderSideItem(right.render, right.onPress)}
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
  root: {
    padding: spacing,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 56,
    shadowOffset: {
      width: 0,
      height: 0.5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 8,
  },
  center: {
    fontSize: 20,
    fontWeight: '500',
  },
  sideButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
