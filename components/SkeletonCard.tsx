import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const SkeletonCard = () => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View className="bg-white rounded-2xl p-4 items-center w-full">
      {/* Image */}
      <Animated.View
        style={[animatedStyle, { width: 100, height: 100 }]}
        className="bg-gray-200 rounded-full -mt-10"
      />

      {/* Title */}
      <Animated.View
        style={[animatedStyle, { width: "70%", height: 20 }]}
        className="bg-gray-200 rounded mt-6"
      />

      {/* Price */}
      <Animated.View
        style={[animatedStyle, { width: "50%", height: 15 }]}
        className="bg-gray-200 rounded mt-3"
      />

      {/* Button */}
      <Animated.View
        style={[animatedStyle, { width: "60%", height: 20 }]}
        className="bg-gray-200 rounded mt-4"
      />
    </View>
  );
};

export default SkeletonCard;
