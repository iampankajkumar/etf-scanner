import React from 'react';
import { View } from 'react-native';
import { Text } from './atoms/Text';
import { styles } from '../styles/appStyles';

interface BannerAdProps {
  // Add props for actual ad implementation later
  testMode?: boolean;
}

/**
 * Banner Ad Component
 * This component reserves space for Google AdMob banner ads
 * Replace the placeholder with actual AdMob banner when ready
 */
export function BannerAd({ testMode = true }: BannerAdProps): React.JSX.Element {
  return (
    <View style={styles.bannerAdContainer}>
      {testMode ? (
        // Placeholder for development/testing
        <View style={styles.bannerAdPlaceholder}>
          <Text style={styles.bannerAdText}>Banner Ad Space (320x50)</Text>
        </View>
      ) : (
        // This is where you'll place the actual AdMob banner component
        // Example: <BannerAd unitId="your-ad-unit-id" size={BannerAdSize.BANNER} />
        <View style={styles.bannerAdPlaceholder}>
          <Text style={styles.bannerAdText}>AdMob Banner Here</Text>
        </View>
      )}
    </View>
  );
}