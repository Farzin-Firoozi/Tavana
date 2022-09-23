import React, { useState } from 'react'

import { Formik } from 'formik'
import { useDispatch } from 'react-redux'
import { showMessage } from 'react-native-flash-message'
import { View, StyleSheet, ScrollView } from 'react-native'
import { Button, HelperText, TextInput, useTheme } from 'react-native-paper'

import api from '~/api'
import token from '~/utils/token'
import Header from '~/components/header'

import { spacing } from '~/theme'
import { LoginSchema } from '~/utils/validation'
import { login, setUser } from '~/store/reducers/user'

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const theme = useTheme()
  const dispatch = useDispatch()

  const submitRequest = (values) => {
    if (isLoading) {
      return
    }
    setIsLoading(true)
    api.auth
      .login(values)
      .then((res) => {
        console.log('success')
        Promise.all([
          token.setAccessToken(res?.data?.access_token),
          token.setRefreshToken(res?.data?.refresh_token),
        ]).then(() => {
          dispatch(setUser(res?.data?.user))
          dispatch(login())
        })
      })
      .catch((err) => {
        showMessage({
          message: err?.response?.data?.detail,
          type: 'danger',
          icon: 'auto',
        })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const inputTheme = {
    colors: {
      background: theme.colors.surface,
      placeholder: theme.colors.generateBlack(0.6),
      text: theme.colors.black,
    },
  }

  return (
    <View style={styles.root}>
      <Header center={{ render: 'Login' }} left={{ render: 'empty' }} />
      <ScrollView
        contentContainerStyle={styles.padding}
        keyboardShouldPersistTaps="handled"
      >
        <Formik
          validationSchema={LoginSchema}
          initialValues={{ username: '', password: '' }}
          onSubmit={submitRequest}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => {
            return (
              <>
                <TextInput
                  mode="outlined"
                  label="Username"
                  error={touched.username && errors.username}
                  onChangeText={handleChange('username')}
                  onBlur={handleBlur('username')}
                  value={values.username}
                  theme={inputTheme}
                />
                <HelperText
                  type="error"
                  visible={!!(touched.username && errors.username)}
                >
                  {errors.username}
                </HelperText>

                <TextInput
                  mode="outlined"
                  label="Password"
                  secureTextEntry
                  error={touched.password && errors.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  theme={inputTheme}
                />
                <HelperText
                  type="error"
                  visible={!!(touched.password && errors.password)}
                >
                  {errors.password}
                </HelperText>

                <View style={styles.divider} />

                <Button
                  labelStyle={{ padding: spacing / 2 }}
                  mode="contained"
                  onPress={handleSubmit}
                  loading={isLoading}
                >
                  Login
                </Button>
              </>
            )
          }}
        </Formik>
      </ScrollView>
    </View>
  )
}

export default LoginPage

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  padding: {
    padding: spacing,
  },
  divider: {
    height: spacing,
  },
})
