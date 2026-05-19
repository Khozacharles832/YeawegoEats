import { FlashList } from "@shopify/flash-list";
import React, { useCallback, useMemo } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CartItem from "@/components/CartItem";
import CheckoutModal from "@/components/CheckoutModel";
import CustomButton from "@/components/CustomButton";
import CustomHeader from "@/components/CustomHeader";
import EmptyCart from "@/components/EmptyCart";

import { useCartStore } from "@/store/cart.store";
import { useCheckoutStore } from "@/store/checkout.store";

import cn from "clsx";

/* =========================
   💳 Payment Row
========================= */
const PaymentInfoStripe = React.memo(function PaymentInfoStripe({
  label,
  value,
  labelStyle,
  valueStyle,
}: any) {
  return (
    <View className="flex-between flex-row my-1">
      <Text className={cn("paragraph-medium text-white/55", labelStyle)}>
        {label}
      </Text>
      <Text className={cn("paragraph-bold text-white", valueStyle)}>
        {value}
      </Text>
    </View>
  );
});

/* =========================
   🛒 Cart Screen
========================= */
const Cart = () => {
  // ✅ granular subscriptions (prevents unnecessary re-renders)
  const items = useCartStore((s) => s.items);
  const totalItems = useCartStore((s) => s.getTotalItems());
  const totalPrice = useCartStore((s) => s.getTotalPrice());

  const openCheckout = useCheckoutStore((s) => s.openCheckout);

  /* =========================
     📌 Header (stable)
  ========================= */
  const header = useMemo(() => {
    return <CustomHeader title="Your Cart" />;
  }, []);

  /* =========================
     📌 Empty state (stable)
  ========================= */
  const empty = useMemo(() => {
    return <EmptyCart />;
  }, []);

  /* =========================
     📌 Footer (memoized)
  ========================= */
  const footer = useMemo(() => {
    if (totalItems === 0) return null;

    return (
      <View className="gap-5">
        <View className="mt-6 rounded-[28px] border border-white/10 bg-[#161616] p-5">
          <Text className="h3-bold text-white mb-5">Payment Summary</Text>

          <PaymentInfoStripe
            label={`Total Items (${totalItems})`}
            value={`R${totalPrice.toFixed(2)}`}
          />
          <PaymentInfoStripe label="Delivery Fee" value="R0.00" />
          <PaymentInfoStripe
            label="Discount"
            value="- R0.00"
            valueStyle="!text-[#6EE7B7]"
          />

          <View className="border-t border-white/10 my-2" />

          <PaymentInfoStripe
            label="Total"
            value={`R${totalPrice.toFixed(2)}`}
            labelStyle="base-bold !text-white"
            valueStyle="base-bold !text-white !text-right"
          />
        </View>

        <CustomButton title="Proceed to Checkout" onPress={openCheckout} />
      </View>
    );
  }, [totalItems, totalPrice, openCheckout]);

  /* =========================
     🎯 Render Item (stable)
  ========================= */
  const renderItem = useCallback(({ item }: any) => <CartItem item={item} />, []);

  return (
    <SafeAreaView className="bg-[#090909] flex-1">
      <FlashList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        estimatedItemSize={110} // 🔥 important for FlashList perf
        contentContainerStyle={{
          paddingBottom: 120,
          paddingHorizontal: 20,
          paddingTop: 20,
        }}
        ListHeaderComponent={header}
        ListEmptyComponent={empty}
        ListFooterComponent={footer}
        showsVerticalScrollIndicator={false}
      />

      <CheckoutModal />
    </SafeAreaView>
  );
};

export default Cart;
