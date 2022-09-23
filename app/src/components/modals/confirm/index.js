import React, { useEffect, useMemo, useRef } from 'react'

import { useTheme, Button, Title } from 'react-native-paper'
import { StyleSheet, View } from 'react-native'

import { spacing } from '~/theme'
import BottomSheet from '~/components/bottomSheet'

const ConfirmModal = ({
  isOpen,
  close,
  options = {
    title: '',
    buttons: {
      cancel: {
        text: '',
        textColor: '',
        onPress: () => {},
        color: '',
        loading: false,
      },
      confirm: {
        text: '',
        textColor: '',
        onPress: () => {},
        color: '',
        loading: false,
      },
    },
  },
}) => {
  const theme = useTheme()
  const bottomSheetRef = useRef(null)

  const openModal = () => {
    bottomSheetRef?.current?.present()
  }

  useEffect(() => {
    if (isOpen) {
      openModal()
    } else {
      closeModal()
    }
  }, [isOpen])

  const closeModal = () => {
    bottomSheetRef?.current?.dismiss()
  }

  const snapPoints = useMemo(() => [200], [])

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      onChange={(event) => {
        if (event === -1) {
          close()
        }
      }}
    >
      <View style={styles.root}>
        <Title style={{ color: theme.colors.black }}>{options.title}</Title>
        <View style={styles.wrapper}>
          {options.buttons.confirm && (
            <Button
              onPress={options.buttons.confirm.onPress}
              mode="contained"
              labelStyle={{
                padding: spacing / 2,
                color: options.buttons.confirm.textColor,
              }}
              style={styles.btn}
              color={options.buttons.confirm.color}
              loading={options.buttons.confirm.loading}
            >
              {options.buttons.confirm.text}
            </Button>
          )}
          {options.buttons.confirm && options.buttons.cancel && (
            <View style={styles.divider} />
          )}

          {options.buttons.cancel && (
            <Button
              mode="text"
              color={options.buttons.cancel.color}
              labelStyle={{
                padding: spacing / 2,
                color: options.buttons.cancel.textColor,
              }}
              onPress={options.buttons.cancel.onPress}
              loading={options.buttons.cancel.loading}
            >
              {options.buttons.cancel.text}
            </Button>
          )}
        </View>
      </View>
    </BottomSheet>
  )
}

export default ConfirmModal

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: spacing,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing,
  },
  divider: {
    width: spacing,
    flexShrink: 0,
  },
  btn: {
    flex: 1,
  },
})
