import AsyncStorage from '@react-native-async-storage/async-storage'

const ACESS_TOKEN_NAME = 'ACCESS_TOKEN'
const REFRESH_TOKEN_NAME = 'REFRESH_TOKEN'

class Token {
  getRefreshToken() {
    console.log('----- GetRefreshToken -----')
    return AsyncStorage.getItem(REFRESH_TOKEN_NAME)
  }

  getAccessToken() {
    console.log('----- GetAccessToken -----')

    return AsyncStorage.getItem(ACESS_TOKEN_NAME)
  }

  setAccessToken(newToken) {
    console.log('----- SetAccessToken -----')

    return AsyncStorage.setItem(ACESS_TOKEN_NAME, newToken)
  }

  setRefreshToken(newToken) {
    console.log('----- SetRefreshToken -----')

    return AsyncStorage.setItem(REFRESH_TOKEN_NAME, newToken)
  }

  clearAccessToken() {
    console.log('----- ClearAccessToken -----')

    return AsyncStorage.removeItem(ACESS_TOKEN_NAME)
  }

  clearRefreshToken() {
    console.log('----- ClearRefreshToken -----')
    return AsyncStorage.removeItem(REFRESH_TOKEN_NAME)
  }
}

export default new Token()
