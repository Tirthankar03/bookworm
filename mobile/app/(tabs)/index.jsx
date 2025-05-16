import { View, Text, FlatList, Image, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import styles from '../../assets/styles/home.styles';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { booksAPI } from '../../services/api';
import { format } from 'date-fns';
import Loader from '../../components/Loader';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 3;
  const isFetching = useRef(false);
  const isRefreshing = useRef(false); // Track refresh state separately

  console.log("hasMore>>>", hasMore);
  console.log("page>>>", page);

  const fetchBooks = useCallback(async (pageNum = 1, refresh = false) => {
    console.log('pageNum>>>', pageNum);
    if (!hasMore && !refresh && pageNum !== 1) return;
    if (isFetching.current || (refresh && isRefreshing.current)) return; // Prevent concurrent fetches or refreshes

    isFetching.current = true;
    if (refresh) {
      isRefreshing.current = true;
    }

    try {
      if (refresh) {
        setRefreshing(true);
        setBooks([]);
        setPage(1);
        setHasMore(true);
      } else if (pageNum === 1) {
        setLoading(true);
      }

      const data = await booksAPI.getBooks(pageNum, limit);

      // Validate API response
      if (!data || !Array.isArray(data.books) || typeof data.totalPages !== 'number') {
        throw new Error('Invalid API response');
      }

      setBooks((prevBooks) => {
        if (refresh || pageNum === 1) {
          return data.books;
        }
        const newBooks = data.books.filter(
          (book) => !prevBooks.some((prevBook) => prevBook._id === book._id)
        );
        return [...prevBooks, ...newBooks];
      });

      setHasMore(pageNum < data.totalPages);
      if (!refresh) {
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Error fetching books:', error.message);
      // Optionally show a user-facing error message (e.g., with a toast)
    } finally {
      isFetching.current = false;
      if (refresh) {
        // await sleep(1000); // Ensure refresh spinner shows for at least 1s
        isRefreshing.current = false;
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }, [limit]);

  useEffect(() => {
    fetchBooks(1);
  }, [fetchBooks]);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !loading && !refreshing && !isFetching.current) {
      fetchBooks(page + 1);
    }
  }, [hasMore, loading, refreshing, page, fetchBooks]);

  // Debounce refresh to prevent multiple rapid triggers
  const handleRefresh = useCallback(() => {
    if (!isRefreshing.current && !isFetching.current) {
      fetchBooks(1, true);
    }
  }, [fetchBooks]);
  const getAvatarUrl = (profileImage) => {
    if (!profileImage) return 'https://via.placeholder.com/36';
    return profileImage.replace('/svg', '/png');
  };

  const renderBookCard = ({ item }) => {
    return (
      <View style={styles.bookCard}>
        <View style={styles.bookHeader}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: getAvatarUrl(item.user?.profileImage) }}
              style={styles.avatar}
            />
            <Text style={styles.username}>{item.user?.username}</Text>
          </View>
          <Text style={styles.date}>
            {format(new Date(item.createdAt), 'MMM d, yyyy')}
          </Text>
        </View>

        <View style={styles.bookImageContainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.bookImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.bookDetails}>
          <Text style={styles.bookTitle}>{item.title}</Text>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name={star <= item.rating ? 'star' : 'star-outline'}
                size={16}
                color={star <= item.rating ? '#f4b400' : COLORS.textSecondary}
                style={{ marginRight: 2 }}
              />
            ))}
          </View>
          <Text style={styles.caption}>{item.caption}</Text>
        </View>
      </View>
    );
  };

  const renderFooter = () => {
    if (hasMore && books.length > 0 && loading) {
      return <ActivityIndicator size="small" color={COLORS.primary} />;
    }
    return null;
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="book-outline" size={48} color={COLORS.textSecondary} />
      <Text style={styles.emptyText}>No Books Yet</Text>
      <Text style={styles.emptySubtext}>
        Be the first to share your favorite book!
      </Text>
    </View>
  );

  if (loading && page === 1) return <Loader />;

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        renderItem={renderBookCard}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>BookWorm</Text>
            <Text style={styles.headerSubtitle}>
              Discover great reads from the community
            </Text>
          </View>
        }
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={
        <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      />
    </View>
  );
}