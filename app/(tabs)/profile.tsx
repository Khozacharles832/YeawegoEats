import { images } from "@/constants";
import useAuthStore from "@/store/auth.store";
import { router } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/* =========================
   🔹 Reusable Row Item
========================= */
const MenuItem = ({ icon, title, onPress }: any) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center justify-between border-b border-white/8 py-4"
  >
    <View className="flex-row items-center gap-3">
      <View className="rounded-full bg-[#FF9A10]/14 p-3">
        <Image source={icon} className="w-5 h-5" tintColor="#FFB11B" />
      </View>
      <Text className="paragraph-semibold text-white">{title}</Text>
    </View>

    <Image
      source={images.arrowRight}
      className="w-4 h-4"
      tintColor="rgba(255,255,255,0.45)"
    />
  </TouchableOpacity>
);

/* =========================
   🏠 Profile Screen
========================= */
export default function Profile() {
  const { user, logout } = useAuthStore();

  return (
    <SafeAreaView className="flex-1 bg-[#090909]">
      <ScrollView
        contentContainerClassName="px-5 pb-32"
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-6 overflow-hidden rounded-[34px] bg-[#161616] px-5 py-6">
          <View className="absolute inset-0 bg-[#FF9A10]/8" />
          <View className="items-center">
            <Image
              source={{ uri: user?.avatar }}
              className="w-24 h-24 rounded-full border-2 border-[#FFB11B]"
            />

            <Text className="mt-3 text-xl font-bold text-white">
              {user?.name || "Guest"}
            </Text>

            <Text className="mt-1 text-white/55">{user?.email}</Text>
          </View>
        </View>

        <View className="flex-row justify-between mt-6 rounded-[28px] border border-white/10 bg-[#161616] p-5">
          <View className="items-center flex-1">
            <Text className="text-lg font-bold text-white">12</Text>
            <Text className="text-white/50 text-sm">Orders</Text>
          </View>

          <View className="items-center flex-1 border-x border-white/10">
            <Text className="text-lg font-bold text-white">5</Text>
            <Text className="text-white/50 text-sm">Favorites</Text>
          </View>

          <View className="items-center flex-1">
            <Text className="text-lg font-bold text-white">2</Text>
            <Text className="text-white/50 text-sm">Addresses</Text>
          </View>
        </View>

        <View className="bg-[#161616] rounded-[28px] border border-white/10 p-5 mt-6">
          <Text className="small-bold uppercase text-[#FFB11B] mb-3">
            Account
          </Text>

          <MenuItem
            icon={images.person}
            title="Edit Profile"
            onPress={() => {}}
          />

          <MenuItem
            icon={images.location}
            title="Addresses"
            onPress={() => router.push("/")}
          />

          <MenuItem
            icon={images.clock}
            title="Order History"
            onPress={() => router.push("/")}
          />

          <MenuItem
            icon={images.star}
            title="Reviews"
            onPress={() => router.push("/")}
          />
        </View>

        <View className="bg-[#161616] rounded-[28px] border border-white/10 p-5 mt-6">
          <Text className="small-bold uppercase text-[#FFB11B] mb-3">
            Payments
          </Text>

          <MenuItem
            icon={images.dollar}
            title="Payment Methods"
            onPress={() => router.push("/")}
          />
        </View>

        <TouchableOpacity
          onPress={logout}
          className="mt-6 rounded-full border border-red-500/40 bg-red-500/15 py-4 items-center"
        >
          <Text className="text-red-200 font-semibold text-base">Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
