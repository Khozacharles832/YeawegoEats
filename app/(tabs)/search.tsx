import CartButton from "@/components/CartButton";
import MenuCard from "@/components/MenuCard";
import { getCategories, getMenu } from "@/lib/supabase";
import useAppwrite from "@/lib/useAppwrite";
import { Category, MenuItem } from "@/type";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FlashList } from "@shopify/flash-list";

import Filter from "@/components/Filter";
import SearchBar from "@/components/SearchBar";
import SkeletonCard from "@/components/SkeletonCard";

const Search = () => {
  const { category, query } = useLocalSearchParams<{
    query: string;
    category: string;
  }>();

  const { data, refetch, loading } = useAppwrite<
    MenuItem[],
    { category?: string; query?: string; limit: number }
  >({
    fn: getMenu,
    params: { category, query, limit: 6 },
  });

  const { data: categories } = useAppwrite<Category[]>({
    fn: getCategories,
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      refetch({ category, query, limit: 6 });
    }, 300);

    return () => clearTimeout(timeout);
  }, [category, query, refetch]);

  const renderItem = useCallback(
    ({ item, index }) => {
      const isLeft = index % 2 === 0;

      return (
        <View
          style={{
            flex: 1,
            marginLeft: isLeft ? 0 : 6,
            marginRight: isLeft ? 6 : 0,
            marginBottom: 16,
          }}
        >
          {loading ? <SkeletonCard /> : <MenuCard item={item} />}
        </View>
      );
    },
    [loading],
  );

  const ListHeader = useMemo(() => {
    return (
      <View className="gap-5 pb-8 pt-5">
        <View className="flex-between flex-row w-full">
          <View className="flex-1">
            <Text className="small-bold uppercase text-[#FFB11B]">
              Browse menu
            </Text>

            <Text className="mt-1 text-[28px] leading-8 font-quicksand-bold text-white">
              Find your flame-grilled favorite
            </Text>
          </View>

          <View className="rounded-full border border-white/10 bg-white/5 p-2">
            <CartButton />
          </View>
        </View>

        <SearchBar />
        <Filter categories={categories ?? []} />
      </View>
    );
  }, [categories]);

  const Empty = useMemo(() => {
    if (loading) return null;

    return (
      <View className="mt-10 rounded-[26px] border border-white/10 bg-[#161616] px-5 py-8">
        <Text className="text-center paragraph-semibold text-white">
          No results found
        </Text>
        <Text className="mt-2 text-center body-medium text-white/55">
          Try a different category or search term.
        </Text>
      </View>
    );
  }, [loading]);

  const listData = useMemo(() => {
    return loading ? Array(6).fill(null) : (data ?? []);
  }, [loading, data]);

  return (
    <SafeAreaView className="bg-[#090909] flex-1">
      <FlashList
        data={listData}
        renderItem={renderItem}
        keyExtractor={(item, index) => (loading ? index.toString() : item.$id)}
        estimatedItemSize={180} // 🔥 VERY important
        numColumns={2}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 120,
        }}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={Empty}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        drawDistance={500}
      />
    </SafeAreaView>
  );
};

export default Search;
