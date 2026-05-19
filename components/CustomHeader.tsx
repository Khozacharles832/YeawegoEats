import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { images } from "@/constants";
import { CustomHeaderProps } from "@/type";

const CustomHeader = ({ title }: CustomHeaderProps) => {
    const router = useRouter();

    return (
        <View className="custom-header">
            <TouchableOpacity onPress={() => router.back()} className="rounded-full border border-white/10 bg-white/5 p-3">
                <Image
                    source={images.arrowBack}
                    className="size-5"
                    resizeMode="contain"
                    tintColor="#FFFFFF"
                />
            </TouchableOpacity>

            {title && <Text className="base-semibold text-white">{title}</Text>}

            <View className="rounded-full border border-white/10 bg-white/5 p-3">
                <Image source={images.search} className="size-5" resizeMode="contain" tintColor="#FFB11B" />
            </View>
        </View>
    );
};

export default CustomHeader;
