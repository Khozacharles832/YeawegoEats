import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { createUser } from "@/lib/supabase";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Text, View } from "react-native";

const SignUp = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const submit = async () => {
    const { name, email, password } = form;

    if (!name || !email || !password)
      return Alert.alert(
        "Error",
        "Please enter valid email address & password.",
      );

    setIsSubmitting(true);

    try {
      await createUser({ email, password, name });

      router.replace("/");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="mx-5 mt-16 gap-6 rounded-[30px] border border-white/10 bg-[#161616] p-5">
      <View>
        <Text className="small-bold uppercase text-[#FFB11B]">Create account</Text>
        <Text className="mt-1 text-[26px] leading-8 font-quicksand-bold text-white">
          Start your order
        </Text>
      </View>

      <CustomInput
        placeholder="Enter your full name"
        value={form.name}
        onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
        label="Full name"
      />
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

      <CustomButton title="Sign Up" isLoading={isSubmitting} onPress={submit} />

      <View className="flex justify-center mt-2 flex-row gap-2">
        <Text className="base-regular text-white/55">
          Already have an account?
        </Text>
        <Link href="/sign-in" className="base-bold text-[#FFB11B]">
          Sign In
        </Link>
      </View>
    </View>
  );
};

export default SignUp;
