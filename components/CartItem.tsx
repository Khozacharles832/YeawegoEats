import React, { memo } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { images } from "@/constants";
//import { getImageSource } from "@/lib/imageResolver";
import { useCartStore } from "@/store/cart.store";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const CartItem = ({ item }: any) => {
  const { increaseQty, decreaseQty, removeItem } = useCartStore();

  /* =========================
     ⚡ Local press animation
  ========================= */
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View className="cart-item">
      <View className="flex flex-row items-center gap-x-3">
        <View className="cart-item__image">
          <Image
            source={{ uri: item.image }}
            className="size-4/5 rounded-[18px]"
            resizeMode="cover"
          />
        </View>

        <View className="flex-1">
          <Text className="base-bold text-white">{item.name}</Text>

          <Text className="paragraph-bold text-[#FFB11B] mt-1">
            R{item.price}
          </Text>

          <View className="flex flex-row items-center gap-x-4 mt-2">
            {/* ➖ decrease */}
            <AnimatedTouchable
              style={animatedStyle}
              onPressIn={() => (scale.value = withSpring(0.9))}
              onPressOut={() => (scale.value = withSpring(1))}
              onPress={() => decreaseQty(item.id, item.customizations)}
              className="cart-item__actions"
            >
              <Image
                source={images.minus}
                className="size-1/2"
                resizeMode="contain"
                tintColor="#FF9C01"
              />
            </AnimatedTouchable>

            <Text className="base-bold text-white">{item.quantity}</Text>

            {/* ➕ increase */}
            <AnimatedTouchable
              style={animatedStyle}
              onPressIn={() => (scale.value = withSpring(0.9))}
              onPressOut={() => (scale.value = withSpring(1))}
              onPress={() => increaseQty(item.id, item.customizations)}
              className="cart-item__actions"
            >
              <Image
                source={images.plus}
                className="size-1/2"
                resizeMode="contain"
                tintColor="#FF9C01"
              />
            </AnimatedTouchable>
          </View>
        </View>

        {/* 🗑 remove with exit animation */}
        <AnimatedTouchable
          onPress={() => removeItem(item.id, item.customizations)}
          className="flex-center rounded-full bg-white/5 p-2"
        >
          <Image
            source={images.trash}
            className="size-5"
            resizeMode="contain"
          />
        </AnimatedTouchable>
      </View>
    </Animated.View>
  );
};

export default memo(CartItem);
