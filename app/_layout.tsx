// app/_layout.tsx

import { supabase } from "@/lib/supabase";
import {
  configureOrderStatusNotifications,
  useOrderStatusNotifications,
} from "@/lib/useOrderStatusNotifications";
import useAuthStore from "@/store/auth.store";
import * as Sentry from "@sentry/react-native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import "./global.css";

// Initialize Sentry
Sentry.init({
  dsn: "https://406537274a0259407a02a6c4d5822e09@o4509904456712192.ingest.us.sentry.io/4509904508878848",
  sendDefaultPii: true,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],
});

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();
void configureOrderStatusNotifications();

export default Sentry.wrap(function RootLayout() {
  const { isAuthenticated, isLoading, fetchAuthenticatedUser, user } =
    useAuthStore();
  const userId = user?.id ?? user?.$id ?? null;

  useOrderStatusNotifications(userId);

  const [fontsLoaded] = useFonts({
    "QuickSand-Bold": require("../assets/fonts/Quicksand-Bold.ttf"),
    "QuickSand-Medium": require("../assets/fonts/Quicksand-Medium.ttf"),
    "QuickSand-Regular": require("../assets/fonts/Quicksand-Regular.ttf"),
    "QuickSand-SemiBold": require("../assets/fonts/Quicksand-SemiBold.ttf"),
    "QuickSand-Light": require("../assets/fonts/Quicksand-Light.ttf"),
  });

  // Hide splash screen when fonts are ready
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Handle auth state
  useEffect(() => {
    // Initial auth check
    fetchAuthenticatedUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("AUTH EVENT:", event);

      if (event === "SIGNED_OUT") {
        useAuthStore.setState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
        return;
      }

      if (event === "TOKEN_REFRESHED") {
        if (session?.user) {
          useAuthStore.setState({
            isAuthenticated: true,
            isLoading: false,
          });

          if (!useAuthStore.getState().user) {
            await fetchAuthenticatedUser({ preserveSessionOnError: true });
          }
        }
        return;
      }

      if (session?.user) {
        await fetchAuthenticatedUser();
      } else {
        useAuthStore.setState({
          isLoading: false,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchAuthenticatedUser]);

  // Debug
  useEffect(() => {
    console.log("AUTH STATE:", isAuthenticated);
  }, [isAuthenticated]);

  // Wait until fonts + auth are ready
  if (!fontsLoaded || isLoading) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_left",
      }}
    >
      {isAuthenticated ? (
        <Stack.Screen name="(tabs)" />
      ) : (
        <Stack.Screen name="(auth)" />
      )}
    </Stack>
  );
});
