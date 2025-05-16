import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import styles from '../../assets/styles/login.styles'
import { Ionicons } from '@expo/vector-icons'
import { Link, useRouter } from 'expo-router'
import COLORS from '../../constants/colors'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '../../utils/validation'
import { useDispatch } from 'react-redux'
import { login } from '../../store/slices/authSlice'
import { useToast } from '../../hooks/useToast'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const dispatch = useDispatch()
  const { showSuccess, showError } = useToast()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data) => {
    try {
      const response = await dispatch(login(data)).unwrap()
      console.log("response>>>", response)
      showSuccess('Login Successful')
    } catch (error) {
      console.log("error>>>", error)
      // Handle specific error messages from the API
      if (error.message === 'Invalid email or password') {
        showError('Login Failed', 'Invalid email or password')
      } else {
        showError('Error', error.message)
      }
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={styles.scrollViewStyle} contentContainerStyle={styles.container}>
        {/* ILLUSTRATION */}
        <View style={styles.topIllustration}>
          <Image
            source={require("../../assets/images/i.png")}
            style={styles.illustrationImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>

          <View style={styles.formContainer}>
            {/* EMAIL */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.inputContainer}>
                    <Ionicons name="mail-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={value}
                      onChangeText={onChange}
                    />
                  </View>
                )}
              />
              {errors.email && (
                <Text style={[styles.errorText, { color: 'red', marginTop: 5 }]}>{errors.email.message}</Text>
              )}
            </View>

            {/* PASSWORD */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your password"
                      secureTextEntry={!showPassword}
                      value={value}
                      onChangeText={onChange}
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Ionicons
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color={COLORS.primary}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.password && (
                <Text style={[styles.errorText, { color: 'red', marginTop: 5 }]}>{errors.password.message}</Text>
              )}
            </View>

            {/* LOGIN BUTTON */}
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>

            {/* SIGNUP LINK */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account?</Text>
              <Link href="/(auth)/signup" asChild>
                <TouchableOpacity>
                  <Text style={styles.link}>Sign Up</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}