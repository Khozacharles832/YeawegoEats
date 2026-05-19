import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { signIn } from "@/lib/supabase";
import * as Sentry from "@sentry/react-native";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, View } from "react-native";

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const submit = async () => {
    const { email, password } = form;

    if (!email || !password)
      return Alert.alert(
        "Error",
        "Please enter valid email address & password.",
      );

    setIsSubmitting(true);

    try {
      await signIn({ email, password });

      router.replace("/");
    } catch (error: any) {
      Alert.alert("Error", error.message);
      Sentry.captureEvent(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <View className="mx-5 mt-16 gap-6 rounded-[30px] border border-white/10 bg-[#161616] p-5">
      <View>
        <Text className="small-bold uppercase text-[#FFB11B]">Welcome back</Text>
        <Text className="mt-1 text-[26px] leading-8 font-quicksand-bold text-white">
          Sign in to order
        </Text>
      </View>

      <CustomInput
        placeholder="Enter your email"
        value={form.email}
        onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
        label="Email"
        keyboardType="email-address"
      />

      <CustomInput
        placeholder="Enter your password"
        value={form.password}
        onChangeText={(text) =>
          setForm((prev) => ({ ...prev, password: text }))
        }
        label="Password"
        secureTextEntry={true}
      />

      <CustomButton title="Sign In" isLoading={isSubmitting} onPress={submit} />

      <View className="flex justify-center mt-2 flex-row gap-2">
        <Text className="base-regular text-white/55">
          Do not have an account?
        </Text>
        <Link href="/(auth)/sign-up" className="base-bold text-[#FFB11B]">
          Sign up
        </Link>
      </View>
    </View>
  );
};
export default SignIn;
