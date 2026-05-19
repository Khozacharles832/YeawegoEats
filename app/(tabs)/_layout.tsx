import { images } from "@/constants";
import useAuthStore from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { TabBarIconProps } from "@/type";
import cn from "clsx";
import { Redirect, Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image, Text, View } from "react-native";

const TabBarIcon = ({ focused, icon, title }: TabBarIconProps) => (
  <View className="tab-icon">
    <Image
      source={icon}
      className="size-7"
      resizeMode="contain"
      tintColor={focused ? "#FE8C00" : "#5D5F6D"}
    />
    <Text
      className={cn(
        "text-sm font-bold",
        focused ? "text-primary" : "text-gray-200",
      )}
    >
      {title}
    </Text>
  </View>
);

export default function TabLayout() {
  const { isAuthenticated } = useAuthStore();
  const totalItems = useCartStore((state) => state.getTotalItems());

  if (!isAuthenticated) return <Redirect href="/sign-in" />;
  return (
    <>
      <StatusBar style="light" />

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
            borderBottomLeftRadius: 50,
            borderBottomRightRadius: 50,
            marginHorizontal: 20,
            height: 80,
            position: "absolute",
            bottom: 40,
            backgroundColor: "#161616",
            borderColor: "rgba(255,255,255,0.08)",
            borderWidth: 1,
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.18,
            shadowRadius: 4,
            elevation: 3,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ focused }) => (
              <TabBarIcon title="Home" icon={images.home} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Search",
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                title="Search"
                icon={images.search}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            title: "Cart",

            tabBarBadge: totalItems || undefined,
            tabBarBadgeStyle: {
              backgroundColor: "#ef4444",
              color: "#fff",
            },
            tabBarIcon: ({ focused }) => (
              <TabBarIcon title="Cart" icon={images.bag} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                title="Profile"
                icon={images.person}
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
