import { images } from "@/constants";
import useAuthStore from "@/store/auth.store";
import { Redirect, Slot } from "expo-router";
import React from "react";
import {
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    View,
} from "react-native";

export default function AuthLayout() {
    const { isAuthenticated } = useAuthStore();

    if(isAuthenticated) return <Redirect href="/" />
    
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-[#090909]"
        >
            <ScrollView
                className="bg-[#090909]"
                contentContainerClassName="pb-10"
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="handled"
            >
                <View className="w-full relative overflow-hidden rounded-b-[36px] bg-[#161616]" style={{ height: 330 }}>
                    <ImageBackground source={images.loginGraphic} className="size-full" resizeMode="cover">
                        <View className="size-full bg-black/35 px-6 pb-8 justify-end">
                            <Text className="small-bold uppercase text-[#FFB11B]">Yeawego Eats</Text>
                            <Text className="mt-2 text-[34px] leading-[38px] font-quicksand-bold text-white">
                                Flame-grilled favorites, ready fast
                            </Text>
                        </View>
                    </ImageBackground>
                    <Image source={images.logo} className="self-center size-28 absolute -bottom-10 z-10 rounded-[28px] border-4 border-[#090909]" />
                </View>
                <Slot />
            </ScrollView>
        </KeyboardAvoidingView>
    )
}
