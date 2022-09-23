// @flow

import React, { useState } from 'react'

import { Formik } from 'formik'
import { useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { View, StyleSheet, ScrollView } from 'react-native'

import { Button, TextInput, useTheme, HelperText } from 'react-native-paper'

import Header from '~/components/header'

import api from '~/api'
import { spacing, roundness } from '~/theme'
import { RegisterSchema } from '~/utils/validation'
import { login, setUser } from '~/store/reducers/user'
import token from '~/utils/token'

const RegisterPage = () => {
  const theme = useTheme()
  const dispatch = useDispatch()

  const navigation = useNavigation()
  const [isLoading, setIsLoading] = useState(false)

  const goBack = () => {
    navigation.goBack()
  }

  const submitRequest = (values) => {
    if (isLoading) {
      return
    }
    setIsLoading(true)

    api.auth
      .register({
        ...values,

        password2: values.passwordConfirmation,
      })
      .then((res) => {
        Promise.all([
          token.setAccessToken(res?.data?.access),
          token.setRefreshToken(res?.data?.refresh),
        ]).then(() => {
          dispatch(setUser(res?.data?.profile))
          dispatch(login())
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
      <Header center={{ render: 'Register' }} />
      <ScrollView contentContainerStyle={styles.padding}>
        <Formik
          validationSchema={RegisterSchema}
          initialValues={{
            username: '',
            email: '',
            password1: '',
            password2: '',
          }}
          onSubmit={submitRequest}
          validateOnChange
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
                  textContentType="username"
                  label="Username"
                  error={!!(touched.username && errors.username)}
                  onChangeText={handleChange('username')}
                  onBlur={handleBlur('username')}
                  value={values.username}
                  theme={inputTheme}
                  autoCapitalize="characters"
                  autoComplete="username"
                  keyboardType="email-address"
                />
                <HelperText
                  type="error"
                  visible={!!(touched.username && errors.username)}
                >
                  {errors.username}
                </HelperText>

                <TextInput
                  mode="outlined"
                  textContentType="emailAddress"
                  keyboardType="email-address"
                  label="Email"
                  error={touched.email && errors.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  theme={inputTheme}
                />
                <HelperText
                  type="error"
                  visible={!!(touched.email && errors.email)}
                >
                  {errors.email}
                </HelperText>

                <TextInput
                  mode="outlined"
                  label="Password"
                  secureTextEntry
                  error={touched.password1 && errors.password1}
                  onChangeText={handleChange('password1')}
                  onBlur={handleBlur('password1')}
                  value={values.password1}
                  theme={inputTheme}
                />
                <HelperText
                  type="error"
                  visible={!!(touched.password1 && errors.password1)}
                >
                  {errors.password1}
                </HelperText>

                <TextInput
                  mode="outlined"
                  label="Password Confirmation"
                  secureTextEntry
                  error={touched.password2 && errors.password2}
                  onChangeText={handleChange('password2')}
                  onBlur={handleBlur('password2')}
                  value={values.password2}
                  theme={inputTheme}
                />
                <HelperText
                  type="error"
                  visible={!!(touched.password2 && errors.password2)}
                >
                  {errors.password2}
                </HelperText>

                <View style={styles.divider} />

                <Button
                  labelStyle={{ padding: spacing / 2 }}
                  mode="contained"
                  onPress={handleSubmit}
                  loading={isLoading}
                >
                  Register
                </Button>
              </>
            )
          }}
        </Formik>

        <View style={styles.divider} />

        <Button
          labelStyle={{ padding: spacing / 2 }}
          mode="outlined"
          onPress={goBack}
        >
          Login
        </Button>
      </ScrollView>
    </View>
  )
}

export default RegisterPage

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
  text: {
    fontSize: 14,
    marginBottom: spacing / 2,
  },
  btn: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: roundness,
    padding: 3,
  },
})
