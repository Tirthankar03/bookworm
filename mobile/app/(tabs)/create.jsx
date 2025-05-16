import { useState } from "react";
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import styles from "../../assets/styles/create.styles";
import COLORS from "../../constants/colors";
import { useDispatch } from "react-redux";
import { booksAPI } from "../../services/api";
import { useToast } from "../../hooks/useToast";
import { createBookSchema } from "../../utils/validation";
import * as ImagePicker from 'expo-image-picker';
import { Alert } from "react-native"; 
import * as FileSystem from 'expo-file-system';

export default function Create() {
  const [imageBase64, setImageBase64] = useState(null);
  const [image, setImage] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();
  
  const { showSuccess, showError } = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createBookSchema),
    defaultValues: {
      title: "",
      caption: "",
      rating: 0,
    },
  });

  const pickImage = async () => {
    try {
      // request permission if needed
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission Denied", "We need camera roll permissions to upload an image");
          return;
        }
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
        base64: true,
      });
      console.log("result of image picker>>>", result);

      if (!result.canceled) {
        setImage(result.assets[0].uri);

        if (result.assets[0].base64) {
          setImageBase64(result.assets[0].base64);
        } else {
          //otherwise, convert to base64
          const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          setImageBase64(base64);
        }
      }
    } catch (error) {
      console.log("Error picking image:", error);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (!imageBase64) {
        showError("Error", "Please select an image");
        return;
      }

      console.log("data in onSubmit>>>", data);
      const uriParts = image.split(".");
      const fileType = uriParts[uriParts.length - 1];
      const imageType = fileType ? `image/${fileType.toLowerCase()}` : "image/jpeg";
      const imageDataUrl = `data:${imageType};base64,${imageBase64}`;

      const response = await booksAPI.createBook({
        ...data,
        image: imageDataUrl,
      });

      console.log("response in create book>>>", response);
      showSuccess("Book created successfully");
      router.push("/");
    } catch (error) {
      showError("Error", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.scrollViewStyle}>
        <View style={styles.container}>
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.title}>Add New Book</Text>
              <Text style={styles.subtitle}>Share your reading experience</Text>
            </View>

            <View style={styles.form}>
              {/* Title Input */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Book Title</Text>
                <Controller
                  control={control}
                  name="title"
                  render={({ field: { onChange, value } }) => (
                    <View style={styles.inputContainer}>
                      <Ionicons
                        name="book-outline"
                        size={20}
                        color={COLORS.primary}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Enter book title"
                        value={value}
                        onChangeText={onChange}
                      />
                    </View>
                  )}
                />
                {errors.title && (
                  <Text style={{ color: "red", marginTop: 5 }}>
                    {errors.title.message}
                  </Text>
                )}
              </View>

              {/* Caption Input */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Description</Text>
                <Controller
                  control={control}
                  name="caption"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.textArea}
                      placeholder="Write a brief description of the book"
                      multiline
                      value={value}
                      onChangeText={onChange}
                    />
                  )}
                />
                {errors.caption && (
                  <Text style={{ color: "red", marginTop: 5 }}>
                    {errors.caption.message}
                  </Text>
                )}
              </View>

              {/* Rating Input */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Rating</Text>
                <Controller
                  control={control}
                  name="rating"
                  render={({ field: { onChange, value } }) => (
                    <View style={styles.ratingContainer}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity
                          key={star}
                          style={styles.starButton}
                          onPress={() => onChange(star)}
                        >
                          <Ionicons
                            name={star <= value ? "star" : "star-outline"}
                            size={24}
                            color={star <= value ? '#f4b400' : COLORS.textSecondary}
                          />
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                />
                {errors.rating && (
                  <Text style={{ color: "red", marginTop: 5 }}>
                    {errors.rating.message}
                  </Text>
                )}
              </View>

              {/* Image Picker */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Book Cover</Text>
                <TouchableOpacity
                  style={styles.imagePicker}
                  onPress={pickImage}
                >
                  {image ? (
                    <Image
                      source={{ uri: image }}
                      style={styles.previewImage}
                    />
                  ) : (
                    <View style={styles.placeholderContainer}>
                      <Ionicons
                        name="image-outline"
                        size={40}
                        color={COLORS.textSecondary}
                      />
                      <Text style={styles.placeholderText}>
                        Tap to add book cover
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={styles.button}
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color={COLORS.white} />
                ) : (
                  <>
                    <Ionicons
                      name="add-circle-outline"
                      size={20}
                      color={COLORS.white}
                      style={styles.buttonIcon}
                    />
                    <Text style={styles.buttonText}>Add Book</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}