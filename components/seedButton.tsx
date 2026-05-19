import seed from "@/lib/seed"; // adjust the path to your seed.ts
import React, { useState } from "react";
import { ActivityIndicator, Alert, Button, View } from "react-native";

const SeedButton = () => {
  const [loading, setLoading] = useState(false);

  const handleSeed = async () => {
    setLoading(true);
    try {
      await seed(); // calls your seeding function
      Alert.alert("Success", "Database seeded successfully!");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to seed the database.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ margin: 20 }}>
      {loading ? (
        <ActivityIndicator size="small" color="#0000ff" />
      ) : (
        <Button title="Seed Database" onPress={handleSeed} />
      )}
    </View>
  );
};

export default SeedButton;

