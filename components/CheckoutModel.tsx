import { createOrder, getRestaurants } from "@/lib/supabase";
import useAuthStore from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { useCheckoutStore } from "@/store/checkout.store";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CheckoutModal() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const { isOpen, closeCheckout, selectedRestaurant, setSelectedRestaurant } =
    useCheckoutStore();

  const { items, getTotalPrice, clearCart } = useCartStore();

  const [loading, setLoading] = useState(false);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loadingRestaurants, setLoadingRestaurants] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const fetchRestaurants = async () => {
      try {
        setLoadingRestaurants(true);
        const data = await getRestaurants();
        setRestaurants(data ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingRestaurants(false);
      }
    };

    fetchRestaurants();
  }, [isOpen]);

  // 🔥 Confirm Order Handler
  const handleConfirmOrder = async () => {
    const currentUser = user as { id?: string; $id?: string } | null;
    const userId = currentUser?.id ?? currentUser?.$id;

    if (!selectedRestaurant || !userId || loading || items.length === 0) return;

    try {
      setLoading(true);

      await createOrder({
        userId,
        restaurantId: selectedRestaurant,
        items,
        total: getTotalPrice(),
      });

      clearCart();
      closeCheckout();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent
      onRequestClose={closeCheckout}
    >
      <View className="flex-1 justify-end bg-black/60">
        <View className="h-[86%] overflow-hidden rounded-t-[30px] bg-[#090909]">
          {/* Header */}
          <View className="flex-row items-center justify-between border-b border-white/10 px-5 py-4">
            <Text className="text-xl font-quicksand-bold text-white">
              Review Order
            </Text>

            <TouchableOpacity onPress={closeCheckout}>
              <Text className="paragraph-semibold text-[#FFB11B]">Close</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: 20,
              paddingBottom: 24,
            }}
          >
            {/* Order Summary */}
            <View className="mb-6 rounded-[24px] border border-white/10 bg-[#161616] p-4">
              {items.map((item) => (
                <View
                  key={item.id}
                  className="mb-2 flex-row items-center justify-between"
                >
                  <Text className="paragraph-medium text-white/75">
                    {item.name} x{item.quantity}
                  </Text>
                  <Text className="paragraph-semibold text-white">
                    R{(item.price * item.quantity).toFixed(2)}
                  </Text>
                </View>
              ))}

              <View className="mt-2 border-t border-white/10 pt-3">
                <Text className="text-right paragraph-bold text-white">
                  Total: R{getTotalPrice().toFixed(2)}
                </Text>
              </View>
            </View>

            {/* Restaurant Selection */}
            <Text className="mb-3 paragraph-semibold text-white">
              Choose Restaurant
            </Text>

            {loadingRestaurants ? (
              <View className="rounded-[22px] border border-white/10 bg-[#161616] py-8">
                <ActivityIndicator size="large" color="#FF9A10" />
              </View>
            ) : (
              restaurants.map((r) => {
                const restaurantId = r.id ?? r.$id;
                const isActive = selectedRestaurant === restaurantId;

                return (
                  <TouchableOpacity
                    key={restaurantId}
                    onPress={() => setSelectedRestaurant(restaurantId)}
                    className={`mb-3 rounded-[22px] border p-4 ${
                      isActive
                        ? "border-[#FF9A10] bg-[#FF9A10]/15"
                        : "border-white/10 bg-[#161616]"
                    }`}
                  >
                    <Text className="paragraph-bold text-white">{r.name}</Text>
                    {!!r.description && (
                      <Text className="mt-1 body-medium text-white/55">
                        {r.description}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>

          {/* Confirm Button */}
          <View
            className="border-t border-white/10 bg-[#090909] px-5 pt-4"
            style={{ paddingBottom: Math.max(insets.bottom, 16) }}
          >
            <TouchableOpacity
              disabled={!selectedRestaurant || !user || loading}
              onPress={handleConfirmOrder}
              className={`rounded-full p-4 ${
                selectedRestaurant && user ? "bg-[#FF9A10]" : "bg-white/15"
              }`}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text className="text-center paragraph-bold text-black">
                  Confirm Order
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
