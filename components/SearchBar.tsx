import { images } from "@/constants";
import { router, useLocalSearchParams, usePathname } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

// debounce hook
const useDebounce = (value: string, delay = 500) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

const Searchbar = () => {
  const pathname = usePathname();
  const params = useLocalSearchParams<{ query?: string }>();

  const [query, setQuery] = useState(params.query ?? "");

  const debouncedQuery = useDebounce(query, 500);

  // sync URL params -> input
  useEffect(() => {
    setQuery(params.query ?? "");
  }, [params.query]);

  // debounce search
  useEffect(() => {
    router.replace({
      pathname: pathname as any,
      params: debouncedQuery.trim() ? { query: debouncedQuery } : {},
    });
  }, [debouncedQuery]);

  const handleSubmit = () => {
    router.replace({
      pathname: pathname as any,
      params: query.trim() ? { query } : {},
    });
  };

  const placeholders = useMemo(
    () => [
      "Search for Burgers 🍔",
      "Search for Kota 🥪",
      "Search for Wings 🍗",
      "Search for Fish & Chips 🐟",
    ],
    [],
  );

  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    if (query) return;

    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [query]);

  return (
    <View className="searchbar px-4 py-3 flex-row items-center">
      <TextInput
        className="flex-1 text-base font-quicksand-medium text-white"
        placeholder={placeholders[placeholderIndex]}
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSubmit}
        placeholderTextColor="rgba(255,255,255,0.48)"
        returnKeyType="search"
      />

      {query.length > 0 && (
        <TouchableOpacity onPress={() => setQuery("")} className="px-2">
          <Text className="text-lg text-white/60">✕</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        className="ml-1 rounded-full bg-[#FF9A10] p-2"
        onPress={handleSubmit}
      >
        <Image
          source={images.search}
          className="w-5 h-5"
          resizeMode="contain"
          tintColor="#090909"
        />
      </TouchableOpacity>
    </View>
  );
};

export default Searchbar;
