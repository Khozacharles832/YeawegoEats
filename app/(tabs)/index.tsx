import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useCallback, useMemo } from "react";
import { ImageSourcePropType, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CartButton from "@/components/CartButton";
import { images } from "@/constants";
import useAuthStore from "@/store/auth.store";

type PosterItem = {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  image: ImageSourcePropType;
  tone: string;
};

const posterMenu: PosterItem[] = [
  {
    id: "wings-ribs",
    title: "Wings & Ribs",
    subtitle: "Saucy, smoky plates made for sharing.",
    price: "From R40",
    image: images.chickenWings2,
    tone: "#2C1204",
  },
  {
    id: "burgers",
    title: "Burgers",
    subtitle: "Stacked burgers with chips and bold sauces.",
    price: "From R45",
    image: images.burgerTwo,
    tone: "#3A1408",
  },
  {
    id: "dagwoods",
    title: "Dagwoods",
    subtitle: "Big street-food favorites with proper portions.",
    price: "From R50",
    image: images.dagWood,
    tone: "#241A12",
  },
  {
    id: "fish-chips",
    title: "Fish & Chips",
    subtitle: "Crispy comfort food, hot and ready.",
    price: "From R45",
    image: images.fishNChips,
    tone: "#102A22",
  },
  {
    id: "combo-meals",
    title: "Combo Meals",
    subtitle: "Fast picks for lunch, dinner, and crews.",
    price: "See menu",
    image: images.combo,
    tone: "#2A1E10",
  },
  {
    id: "hot-dogs",
    title: "Hot Dogs",
    subtitle: "Loaded, quick, and easy to collect.",
    price: "From R35",
    image: images.hotDog2,
    tone: "#2A2118",
  },
];

const PosterCard = React.memo(function PosterCard({
  item,
}: {
  item: PosterItem;
}) {
  return (
    <Pressable
      onPress={() => router.push("/search")}
      className="mb-4 flex-row items-center overflow-hidden rounded-[26px] border border-white/10 px-4 py-4"
      style={{ backgroundColor: item.tone }}
    >
      <View className="flex-1 pr-3">
        <Text className="small-bold uppercase text-[#FFB11B]">
          {item.price}
        </Text>
        <Text className="mt-2 text-[25px] leading-7 font-quicksand-bold text-white">
          {item.title}
        </Text>
        <Text className="mt-2 body-medium text-white/65">{item.subtitle}</Text>
      </View>

      <Image
        source={item.image}
        style={{ width: 112, height: 112 }}
        contentFit="contain"
        cachePolicy="memory-disk"
        transition={0}
      />
    </Pressable>
  );
});

export default function Index() {
  const userName = useAuthStore((s) => s.user?.name);

  const header = useMemo(
    () => (
      <View className="pb-5 pt-3">
        <View className="mb-5 flex-row items-center justify-between">
          <View className="flex-1 pr-3">
            <Text className="small-bold uppercase text-[#FFB11B]">
              Yeawego Eats
            </Text>
            <Text className="mt-2 text-[28px] leading-8 font-quicksand-bold text-white">
              {userName ? `Hi ${userName},` : "Welcome,"} what are you craving?
            </Text>
          </View>

          <View className="rounded-full border border-white/10 bg-white/5 p-2">
            <CartButton />
          </View>
        </View>

        <Pressable
          onPress={() => router.push("/search")}
          className="overflow-hidden rounded-[30px] bg-[#FF9A10] px-5 py-5"
          style={{ elevation: 2 }}
        >
          <View className="flex-row items-center">
            <View className="flex-1 pr-4">
              <Text className="small-bold uppercase text-black/65">
                Fast order
              </Text>
              <Text className="mt-2 text-[31px] leading-9 font-quicksand-bold text-black">
                Flame-grilled favorites
              </Text>
              <Text className="mt-2 paragraph-medium text-black/70">
                Browse the full menu and checkout in a few taps.
              </Text>
            </View>

            <Image
              source={images.logo}
              style={{ width: 112, height: 112, borderRadius: 25 }}
              contentFit="contain"
              cachePolicy="memory-disk"
              transition={0}
            />
          </View>
        </Pressable>

        <View className="mt-7 flex-row items-end justify-between">
          <View>
            <Text className="small-bold uppercase text-[#FFB11B]">
              Popular menu
            </Text>
            <Text className="mt-1 text-[24px] leading-7 font-quicksand-bold text-white">
              Trending-Dishes
            </Text>
          </View>

          <Pressable onPress={() => router.push("/search")}>
            <Text className="paragraph-semibold text-[#FFD27A]">See all</Text>
          </Pressable>
        </View>
      </View>
    ),
    [userName],
  );

  const renderItem = useCallback(
    ({ item }: { item: PosterItem }) => <PosterCard item={item} />,
    [],
  );

  return (
    <SafeAreaView className="flex-1 bg-[#090909]">
      <FlashList
        data={posterMenu}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={header}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 120,
        }}
      />
    </SafeAreaView>
  );
}
