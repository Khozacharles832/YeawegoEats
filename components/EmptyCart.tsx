import { images } from "@/constants";
import { router } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

const EmptyCart = () => {
  return (
    <View className="flex-1 justify-center items-center px-6">
      <Image
        source={images.emptyState}
        className="w-56 h-56"
        resizeMode="contain"
      />

      <Text className="text-xl font-bold text-white mt-6">
        Your cart is empty
      </Text>

      <Text className="text-white/55 text-center mt-2 leading-5">
        Looks like you haven’t added anything yet. Start exploring delicious
        meals.
      </Text>

      <TouchableOpacity
        onPress={() => router.push("/search")}
        className="mt-6 bg-[#FF9A10] px-6 py-4 rounded-full"
      >
        <Text className="text-black font-semibold text-base">Browse Menu</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EmptyCart;
