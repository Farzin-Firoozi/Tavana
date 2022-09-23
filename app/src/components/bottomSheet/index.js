// @flow

import React, { forwardRef, useMemo } from 'react'
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet'

import type { bottomsheetProps } from './types.flow'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from 'react-native-paper'

const BottomSheet = forwardRef((props: bottomsheetProps, ref) => {
  // variables
  const theme = useTheme()
  const { snapPoints = ['100%'], children, backdropProps = {} } = props
  const memoSnapPoints = useMemo(() => snapPoints, [])
  const insets = useSafeAreaInsets()

  return (
    <BottomSheetModal
      topInset={insets.top}
      ref={ref}
      backdropComponent={(prps) => (
        <BottomSheetBackdrop
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          {...prps}
          {...backdropProps}
        />
      )}
      backgroundStyle={{ backgroundColor: theme.colors.surface }}
      handleIndicatorStyle={{
        backgroundColor: theme.colors.generateBlack(0.8),
      }}
      {...props}
      snapPoints={memoSnapPoints}
    >
      {children}
    </BottomSheetModal>
  )
})

export default BottomSheet
