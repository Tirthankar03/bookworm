import { View, Text, TouchableOpacity, Image, FlatList, ActivityIndicator, Alert, RefreshControl } from 'react-native'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../store/slices/authSlice'
import { deleteToken } from '../../utils/secureStorage'
import { useRouter } from 'expo-router'
import { useToast } from '../../hooks/useToast'
import COLORS from '../../constants/colors'
import styles from '../../assets/styles/profile.styles'
import { booksAPI } from '../../services/api'
import { Ionicons } from '@expo/vector-icons'
import useFetch from '../../hooks/useFetch'
import { format, isValid } from 'date-fns'

export default function Profile() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { showSuccess, showError } = useToast()
  const user = useSelector((state) => state.auth.user)
  const [refreshing, setRefreshing] = useState(false)

  const getAvatarUrl = (profileImage) => {
    if (!profileImage) return 'https://via.placeholder.com/36';
    return profileImage.replace('/svg', '/png');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return isValid(date) ? format(date, 'MMM d, yyyy') : 'N/A'
  }

  const formatMemberSince = (dateString) => {
    const date = new Date(dateString)
    return isValid(date) ? format(date, 'MMM yyyy') : 'N/A'
  }

  const fetchUserBooks = async () => {
    try {
      const response = await booksAPI.getUserBooks()
      return response
    } catch (error) {
      showError('Error', error.message)
      throw error
    }
  }

  const { data: books, loading, error, refetch } = useFetch(fetchUserBooks)
  console.log("books>>>", books)

  const handleLogout = async () => {
    try {
      await deleteToken()
      dispatch(logout())
      showSuccess('Logged out successfully')
      router.replace('/(auth)')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleDeleteBook = async (bookId) => {
    Alert.alert(
      'Delete Book',
      'Are you sure you want to delete this book?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await booksAPI.deleteBook(bookId)
              showSuccess('Book deleted successfully')
              refetch()
            } catch (error) {
              showError('Error', error.message)
            }
          }
        }
      ]
    )
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  const renderBookItem = ({ item }) => (
    <View style={styles.bookItem}>
      <Image
        source={{ uri: item.image }}
        style={styles.bookImage}
        resizeMode="cover"
      />
      <View style={styles.bookInfo}>
        <View>
          <Text style={styles.bookTitle}>{item.title}</Text>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name={star <= item.rating ? "star" : "star-outline"}
                size={16}
                color={star <= item.rating ? '#f4b400' : COLORS.textSecondary}
                style={{ marginRight: 2 }}
              />
            ))}
          </View>
          <Text style={styles.bookCaption} numberOfLines={2}>
            {item.caption}
          </Text>
          <Text style={styles.bookDate}>
            {formatDate(item.createdAt)}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteBook(item._id)}
        >
          <Ionicons name="trash-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </View>
  )

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="book-outline" size={48} color={COLORS.textSecondary} />
      <Text style={styles.emptyText}>You haven't added any books yet</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/(tabs)/create')}
      >
        <Text style={styles.addButtonText}>Add Your First Book</Text>
      </TouchableOpacity>
    </View>
  )

  if (loading && !books) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    )
  }

  if (error && !books) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: COLORS.error }}>Error: {error.message}</Text>
        <TouchableOpacity
          style={{ marginTop: 16, padding: 8 }}
          onPress={refetch}
        >
          <Text style={{ color: COLORS.primary }}>Try Again</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: getAvatarUrl(user?.profileImage) }}
          style={styles.profileImage}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.username}>{user?.username}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <Text style={styles.memberSince}>
            Member since {formatMemberSince(user?.createdAt)}
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={20} color={COLORS.white} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.booksHeader}>
        <Text style={styles.booksTitle}>My Books</Text>
        <Text style={styles.booksCount}>{books?.length || 0} books</Text>
      </View>

      <FlatList
        data={books}
        renderItem={renderBookItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.booksList}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      />
    </View>
  )
}