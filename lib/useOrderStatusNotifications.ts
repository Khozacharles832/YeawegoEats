import { getOrders, supabase } from "@/lib/supabase";
import type * as ExpoNotifications from "expo-notifications";
import { useEffect, useRef } from "react";
import { Platform } from "react-native";

const ORDER_STATUS_CHANNEL_ID = "order-status-updates";

let notificationsUnavailableWarningShown = false;
let notificationsPromise: Promise<typeof ExpoNotifications | null> | null =
  null;

const getNotifications = async (): Promise<typeof ExpoNotifications | null> => {
  notificationsPromise ??= import("expo-notifications").catch((error) => {
    if (notificationsUnavailableWarningShown) return null;

    notificationsUnavailableWarningShown = true;

    console.warn(
      "expo-notifications not available. Rebuild app to enable notifications.",
      error,
    );

    return null;
  });

  return notificationsPromise;
};

const STATUS_MESSAGES: Record<string, string> = {
  pending: "Your order has been received.",
  accepted: "Your order has been accepted.",
  preparing: "Your food is being prepared.",
  ready: "Your order is ready.",
  out_for_delivery: "Your order is on the way.",
  delivered: "Your order has been delivered.",
  cancelled: "Your order was cancelled.",
  canceled: "Your order was cancelled.",
};

const formatStatus = (status: string) =>
  status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

const getStatusMessage = (status: string) =>
  STATUS_MESSAGES[status.toLowerCase()] ??
  `Your order status changed to ${formatStatus(status)}.`;

const isGranted = (permission: unknown) =>
  (permission as { status?: string }).status === "granted";

/* =========================
   🔔 Setup notifications
========================= */
export const configureOrderStatusNotifications = async () => {
  const Notifications = await getNotifications();
  if (!Notifications) return;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
};

/* =========================
   🔐 Permission handling
========================= */
const requestNotificationPermission = async () => {
  if (Platform.OS === "web") return false;

  const Notifications = await getNotifications();
  if (!Notifications) return false;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(ORDER_STATUS_CHANNEL_ID, {
      name: "Order status updates",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF9A10",
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    });
  }

  const current = await Notifications.getPermissionsAsync();

  if (isGranted(current)) return true;

  const requested = await Notifications.requestPermissionsAsync();

  return isGranted(requested);
};

/* =========================
   📲 Local notification
========================= */
const notifyOrderStatusChange = async (orderId: string, status: string) => {
  const Notifications = await getNotifications();
  if (!Notifications) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Order update",
      body: getStatusMessage(status),
      data: { orderId, status },
      sound: true,
    },
    trigger:
      Platform.OS === "android" ? { channelId: ORDER_STATUS_CHANNEL_ID } : null,
  });
};

/* =========================
   🧠 Main Hook
========================= */
export const useOrderStatusNotifications = (userId?: string | null) => {
  const statusByOrderIdRef = useRef<Record<string, string>>({});

  useEffect(() => {
    if (!userId) {
      statusByOrderIdRef.current = {};
      return;
    }

    let mounted = true;

    const setup = async () => {
      try {
        const hasPermission = await requestNotificationPermission();

        if (!hasPermission || !mounted) return;

        /* =========================
           🧾 Load initial orders
        ========================= */
        const orders = await getOrders(userId);

        if (!mounted) return;

        statusByOrderIdRef.current = (orders ?? []).reduce<
          Record<string, string>
        >((acc, order) => {
          if (order.id && order.status) {
            acc[order.id] = order.status;
          }
          return acc;
        }, {});
      } catch (err) {
        console.error("Notification setup error:", err);
      }
    };

    setup();

    /* =========================
       🔴 Realtime channel
    ========================= */
    const channel = supabase
      .channel(`order-status-${userId}`)

      /* =========================
         🆕 NEW ORDER (INSERT)
      ========================= */
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "orders",
          filter: `user_id=eq.${userId}`,
        },
        async (payload) => {
          const order = payload.new as {
            id?: string;
            status?: string;
          };

          if (!order.id || !order.status) return;

          statusByOrderIdRef.current[order.id] = order.status;

          try {
            await notifyOrderStatusChange(order.id, order.status);
          } catch (err) {
            console.error("Insert notification error:", err);
          }
        },
      )

      /* =========================
         🔄 STATUS UPDATE
      ========================= */
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `user_id=eq.${userId}`,
        },
        async (payload) => {
          const order = payload.new as {
            id?: string;
            status?: string;
          };

          const orderId = order.id;
          const nextStatus = order.status;

          if (!orderId || !nextStatus) return;

          const previousStatus =
            (
              payload.old as {
                status?: string;
              } | null
            )?.status ?? statusByOrderIdRef.current[orderId];

          statusByOrderIdRef.current[orderId] = nextStatus;

          if (previousStatus && previousStatus !== nextStatus) {
            try {
              await notifyOrderStatusChange(orderId, nextStatus);
            } catch (err) {
              console.error("Update notification error:", err);
            }
          }
        },
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [userId]);
};
