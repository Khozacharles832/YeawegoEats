import { images } from '@/constants';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Text, TouchableOpacity } from 'react-native';

interface LocationDisplayProps {
  textStyle?: string;
  containerStyle?: string;
  showIcon?: boolean;
}

export default function LocationDisplay({
  textStyle = 'paragraph-bold text-dark-100',
  containerStyle = 'flex-center flex-row gap-x-1 mt-0.5',
  showIcon = true,
}: LocationDisplayProps) {
  const [locationText, setLocationText] = useState<string>('Fetching...');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationText('Permission denied');
        setLoading(false);
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      let reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const place = reverseGeocode[0];
        const displayName = `${place.street || 'Unknown street'} ${place.name || ''}`.trim();
        setLocationText(displayName);
      } else {
        setLocationText('Unknown location');
      }

      setLoading(false);
    })();
  }, []);

  return (
    <TouchableOpacity className={containerStyle}>
      {loading ? (
        <ActivityIndicator size="small" color="#333" />
      ) : (
        <Text className={textStyle}>{locationText}</Text>
      )}
      {showIcon && <Image source={images.arrowDown} className="size-3" resizeMode="contain" />}
    </TouchableOpacity>
  );
}
