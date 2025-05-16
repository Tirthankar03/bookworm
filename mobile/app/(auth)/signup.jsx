import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native'
import React from 'react'
import styles from '../../assets/styles/signup.styles'
import { Ionicons } from '@expo/vector-icons'
import { Link, useRouter } from 'expo-router'
import COLORS from '../../constants/colors'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema } from '../../utils/validation'
import { useDispatch } from 'react-redux'
import { register } from '../../store/slices/authSlice'
import { useToast } from '../../hooks/useToast'

export default function Signup() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { showSuccess, showError } = useToast()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data) => {
    try {
      const response = await dispatch(register(data)).unwrap()
      console.log("response>>>", response)
      showSuccess('Signup Successful')
    } catch (error) {
      console.log("error in signup>>>", error)
      // Handle specific error messages from the API
      if (error.message === 'User already exists') {
        showError('Signup Failed', 'User already exists')
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
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>BookWorm</Text>
            <Text style={styles.subtitle}>Share your favorite reads</Text>
          </View>

          <View style={styles.formContainer}>
            {/* NAME */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.inputContainer}>
                    <Ionicons name="person-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your full name"
                      autoCapitalize="words"
                      value={value}
                      onChangeText={onChange}
                    />
                  </View>
                )}
              />
              {errors.name && (
                <Text style={[styles.errorText, { color: 'red', marginTop: 5 }]}>{errors.name.message}</Text>
              )}
            </View>

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
                      secureTextEntry
                      value={value}
                      onChangeText={onChange}
                    />
                  </View>
                )}
              />
              {errors.password && (
                <Text style={[styles.errorText, { color: 'red', marginTop: 5 }]}>{errors.password.message}</Text>
              )}
            </View>

            {/* SIGNUP BUTTON */}
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </TouchableOpacity>

            {/* LOGIN LINK */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <Link href="/(auth)" asChild>
                <TouchableOpacity>
                  <Text style={styles.link}>Login</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}