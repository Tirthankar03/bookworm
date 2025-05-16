import { Stack, useRouter, useSegments } from "expo-router";
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../store/slices/authSlice';
import SafeScreen from "./SafeScreen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

export default function RootNavigation() {
  const router = useRouter();
  const segments = useSegments();
  const user = useSelector(selectCurrentUser);



  // Check if the user is authenticated and redirect accordingly
  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";
    
    console.log("segments>>>", segments);
    console.log("user>>>", user);
    console.log("inAuthGroup>>>", inAuthGroup);
    
    if (user && inAuthGroup) {
      // If user is signed in and on an auth screen, redirect to tabs
      router.replace("/(tabs)");
    } else if (!user && !inAuthGroup) {
      // If user is not signed in and not on an auth screen, redirect to auth
      router.replace("/(auth)");
    }
  }, [user, segments, router]);

  return (
    <>
      <StatusBar style="dark" />
      <SafeScreen>
        <Stack screenOptions={{
          headerShown: false
        }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </SafeScreen>
    </>
  );
} 