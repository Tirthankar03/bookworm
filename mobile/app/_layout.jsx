import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../store';
import Toast from 'react-native-toast-message';
import RootNavigation from '../components/RootNavigation';
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf"),
  });
  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <RootNavigation />
          <Toast />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}
