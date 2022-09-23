import React from 'react'

import RNBootSplash from 'react-native-bootsplash'
import FlashMessage from 'react-native-flash-message'

import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { NavigationContainer } from '@react-navigation/native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { View, StatusBar, useColorScheme } from 'react-native'

import {
  useTheme,
  DefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper'

import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context'

import Navigator from '~/app'
import { roundness } from '~/theme'
import store, { persistor } from '~/store'
import { darkColors, lightColors } from '~/theme/colors'

const colorSelector = (mode = 'light') => {
  switch (mode) {
    case 'light':
      return lightColors

    case 'dark':
      return darkColors

    default:
      return {}
  }
}

// eslint-disable-next-line no-undef
if (!__DEV__) {
  console.log = () => {}
}

const App = () => {
  const scheme = useColorScheme()

  return (
    <>
      <SafeAreaProvider>
        <ReduxProvider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <PaperProvider
              theme={{
                ...DefaultTheme,
                roundness: roundness,
                colors: {
                  ...DefaultTheme.colors,
                  error: '#ff0000',
                  ...colorSelector(scheme),
                },
              }}
            >
              <NavigationContainer
                onReady={() => RNBootSplash.hide({ fade: true })}
                theme={{
                  colors: {
                    background: colorSelector(scheme).surface,
                  },
                }}
              >
                <GestureHandlerRootView style={{ flex: 1 }}>
                  <BottomSheetModalProvider>
                    <CustomStatusBar />
                    <Navigator />
                  </BottomSheetModalProvider>
                </GestureHandlerRootView>
              </NavigationContainer>
            </PaperProvider>
          </PersistGate>
        </ReduxProvider>
      </SafeAreaProvider>
      <FlashMessage position="top" floating duration={10000} />
    </>
  )
}

export default App

const CustomStatusBar = () => {
  const insets = useSafeAreaInsets()
  const theme = useTheme()
  const scheme = useColorScheme()
  return (
    <View
      style={{
        backgroundColor: theme.colors.surface,
        height: insets.top,
      }}
    >
      <StatusBar
        barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.surface}
      />
    </View>
  )
}
