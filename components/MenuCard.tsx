import { useCartStore } from "@/store/cart.store";
import { MenuItem } from "@/type";
import { Image } from "expo-image";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const fallbackImage = require("@/assets/images/bacon.png");

const MenuCard = ({ item }: { item: MenuItem }) => {
  const { id, image, image_url, name, price } = item;

  const addItem = useCartStore((state) => state.addItem);

  return (
    <TouchableOpacity className="menu-card" activeOpacity={0.9}>
      {/* Food Image */}
      <View className="items-center -mt-12 mb-2">
        <Image
          source={image || fallbackImage}
          placeholder={fallbackImage}
          transition={300}
          style={{
            width: 100,
            height: 100,
            borderRadius: 100,
          }}
          contentFit="cover"
          cachePolicy="memory-disk"
        />
      </View>

      {/* Food Name */}
      <Text className="text-center base-bold text-white mb-1" numberOfLines={1}>
        {name}
      </Text>

      {/* Price */}
      <Text className="body-regular text-white/55 mb-3 text-center">
        From R{price}
      </Text>

      {/* Add Button */}
      <TouchableOpacity
        onPress={() =>
          addItem({
            id,
            name,
            price,
            image,
            image_url,
          })
        }
        className="bg-[#FF9A10] px-4 py-2 rounded-full self-center"
        activeOpacity={0.8}
      >
        <Text className="paragraph-bold text-black">Add +</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default React.memo(MenuCard);
