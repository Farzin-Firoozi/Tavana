import React from 'react'

import { Text, useTheme } from 'react-native-paper'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/Ionicons'
import { spacing } from '~/theme'

const convertRoute = (routeName, focused = false) => {
  switch (routeName) {
    case 'ProfileTab':
      return {
        name: 'Profile',
        icon: focused ? 'person' : 'person-outline',
      }

    case 'DevicesTab':
      return {
        name: 'Devices',
        icon: focused ? 'home' : 'home-outline',
      }

    default:
      return {
        name: '',
        icon: '',
      }
  }
}

function Tabbar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets()
  const theme = useTheme()

  return (
    <View
      style={[
        styles.root,
        {
          height: 56 + Math.max(insets.bottom, spacing),
          backgroundColor: theme.colors.surface,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1,
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key]

          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name

          const isFocused = state.index === index
          const color = isFocused
            ? theme.colors.primary
            : theme.colors.generateBlack(0.5)

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            })

            if (!isFocused && !event.defaultPrevented) {
              // The `merge: true` option makes sure that the params inside the tab screen are preserved
              navigation.navigate({ name: route.name, merge: true })
            }
          }

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            })
          }

          return (
            <TouchableOpacity
              key={label}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Icon
                name={convertRoute(route.name, isFocused).icon}
                size={24}
                color={color}
              />
              <Text
                style={{
                  color,
                  fontSize: 12,
                  marginTop: spacing / 2,
                }}
              >
                {convertRoute(route.name, isFocused).name}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

export default Tabbar

const styles = StyleSheet.create({
  root: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0.5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 8,
    paddingTop: spacing / 2,
  },
})
