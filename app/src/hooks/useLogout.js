import { useDispatch } from 'react-redux'
import { logout } from '~/store/reducers/user'
import token from '~/utils/token'

const useLogout = () => {
  const dispatch = useDispatch()

  const logoutHandler = async () => {
    Promise.all([token.clearAccessToken(), token.clearRefreshToken()]).then(
      () => {
        dispatch(logout())
      }
    )
  }

  return logoutHandler
}

export default useLogout
