import { Dimensions } from 'react-native'

export const spacing = 16
export const roundness = 8

export const widthScale = (val) => {
  return Dimensions.get('window').width * (val / 100)
}

export const heightScale = (val) => {
  return Dimensions.get('window').height * (val / 100)
}
