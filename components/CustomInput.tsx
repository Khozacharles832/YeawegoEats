import { CustomInputProps } from "@/type";
import { Ionicons } from "@expo/vector-icons";
import cn from "clsx";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

const CustomInput = ({
    placeholder = 'Enter text',
    value,
    onChangeText,
    label,
    secureTextEntry = false,
    keyboardType="default"
}: CustomInputProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const isPasswordInput = secureTextEntry;


    return (
        <View className="w-full">
            <Text className="label">{label}</Text>

            <View className="relative">
                <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={isPasswordInput && !isPasswordVisible}
                    keyboardType={keyboardType}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    placeholderTextColor="rgba(255,255,255,0.42)"
                    className={cn(
                        "input",
                        isPasswordInput && "pr-14",
                        isFocused ? "border-[#FF9A10]" : "border-white/10"
                    )}
                />

                {isPasswordInput && (
                    <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityLabel={
                            isPasswordVisible ? "Hide password" : "Show password"
                        }
                        onPress={() => setIsPasswordVisible((visible) => !visible)}
                        className="absolute right-4 top-0 h-full justify-center"
                        hitSlop={10}
                    >
                        <Ionicons
                            name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                            size={22}
                            color="rgba(255,255,255,0.65)"
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )
}
export default CustomInput
