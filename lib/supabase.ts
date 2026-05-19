import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const createUser = async ({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}) => {
  try {
    // 1. Create auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    const user = data.user;
    if (!user) throw new Error("User not created");

    // 2. Create profile row
    const avatarUrl = `https://ui-avatars.com/api/?name=${name}`;

    const { error: profileError } = await supabase.from("profiles").insert({
      id: user.id,
      name,
      email,
      avatar: avatarUrl,
    });

    if (profileError) throw profileError;

    return user;
  } catch (error) {
    console.error("createUser error:", error);
    throw error;
  }
};

export const signIn = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("signIn error:", error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) return null;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) return null;

    return profile;
  } catch (error) {
    console.error("getCurrentUser error:", error);
    throw error;
  }
};

export const getMenu = async ({
  category,
  query,
  limit = 6,
}: {
  category?: string;
  query?: string;
  limit?: number;
}) => {
  let supabaseQuery = supabase.from("menu_items").select("*").limit(limit);

  // Filter by category
  if (category && category !== "all") {
    supabaseQuery = supabaseQuery.eq("category_id", category);
  }

  // Search by name
  if (query) {
    supabaseQuery = supabaseQuery.ilike("name", `%${query}%`);
  }

  const { data, error } = await supabaseQuery;

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getCategories = async () => {
  try {
    const { data, error } = await supabase.from("categories").select("*");

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("getCategories error:", error);
    throw error;
  }
};

// Helper to resolve image URLs
/*export const resolveImageUrl = (image_url?: string) => {
  return useMemo(() => {
    if (!image_url) return null;
    return `${image_url}?project=${process.env.EXPO_PUBLIC_SUPABASE_URL}`;
  }, [image_url]);
};
*/

export const getRestaurants = async () => {
  try {
    const { data, error } = await supabase.from("restaurants").select("*");

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("getRestaurants error:", error);
    throw error;
  }
};

export const createOrder = async ({
  userId,
  restaurantId,
  items,
  total,
}: {
  userId: string;
  restaurantId: string;
  items: {
    id: string;
    quantity: number;
    price: number;
  }[];
  total: number;
}) => {
  try {
    // 1. Create the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        restaurant_id: restaurantId,
        total,
        status: "pending",
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Create order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      menu_item_id: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: orderItemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (orderItemsError) throw orderItemsError;

    return order;
  } catch (error) {
    console.error("createOrder error:", error);
    throw error;
  }
};

export const getOrders = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("getOrders error:", error);
    throw error;
  }
};

export const getOrderDetails = async (orderId: string) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*, restaurants(*), items(*)")
      .eq("id", orderId)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("getOrderDetails error:", error);
    throw error;
  }
};

export const getProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("getProfile error:", error);
    throw error;
  }
};
