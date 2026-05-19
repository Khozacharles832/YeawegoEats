import { CustomButtonProps } from "@/type";
import cn from "clsx";
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

const CustomButton = ({
    onPress,
    title="Click Me",
    style,
    textStyle,
    leftIcon,
    isLoading = false
}: CustomButtonProps) => {
    return (
        <TouchableOpacity className={cn('custom-btn', style)} onPress={onPress} activeOpacity={0.88}>
            {leftIcon}

            <View className="flex-center flex-row">
                {isLoading ? (
                    <ActivityIndicator size="small" color="white" />
                ): (
                    <Text className={cn('text-black paragraph-bold', textStyle)}>
                        {title}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    )
}
export default CustomButton
