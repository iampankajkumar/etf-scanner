import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  BackHandler
} from 'react-native';
import { styles } from '../styles/appStyles';
import { calculateVolatility } from '../utils/calculations';
import { getColor } from '../utils/ui';
import { PriceRangeBar } from './PriceRangeBar';
import { BannerAd } from './BannerAd';
import { AssetItem } from '../types';
import { formatReturn } from '../utils/data';

interface DetailsPageProps {
  item: AssetItem | null;
  onBack: () => void;
}

export function DetailsPage({ item, onBack }: DetailsPageProps): React.JSX.Element | null {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      onBack();
      return true;
    });
    return () => backHandler.remove();
  }, [onBack]);

  if (!item) return null;

  // Use shared formatReturn from utils/data

  const getDetailColor = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '#888';
    return value > 0 ? '#4CAF50' : value < 0 ? '#FF5252' : '#888';
  };

  // Helper function to parse range data from API
  const parseRangeData = (rangeData: any) => {
    if (!rangeData) return { min: 0, max: 0, current: 0 };
    return {
      min: parseFloat(rangeData.min || '0'),
      max: parseFloat(rangeData.max || '0'),
      current: parseFloat(rangeData.current || '0')
    };
  };

  // Get ranges from the new API data structure
  const weeklyRange = item.priceRangeData?.weeklyRange ? parseRangeData(item.priceRangeData.weeklyRange) : { min: 0, max: 0, current: 0 };
  const monthlyRange = item.priceRangeData?.monthlyRange ? parseRangeData(item.priceRangeData.monthlyRange) : { min: 0, max: 0, current: 0 };
  const yearlyRange = item.priceRangeData?.yearlyRange ? parseRangeData(item.priceRangeData.yearlyRange) : { min: 0, max: 0, current: 0 };
  const twoYearRange = item.priceRangeData?.["2yearlyRange"] ? parseRangeData(item.priceRangeData["2yearlyRange"]) : { min: 0, max: 0, current: 0 };

  const volatility = calculateVolatility(item.allPrices ? item.allPrices.map(p => p.price) : []);

  return (
    <>
      <View style={styles.detailsPage}>
        <StatusBar barStyle="light-content" backgroundColor="#121212" translucent />
        <View style={styles.detailsHeader}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.detailsTitle}>
            {item.ticker.replace('.NS', '')} Details
          </Text>
          <View style={styles.spacer} />
        </View>
        
        <ScrollView
          style={styles.detailsContent}
          contentContainerStyle={styles.detailsContentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Current Price</Text>
            <Text style={styles.priceValue}>₹{item.currentPrice}</Text>
          </View>

          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Price Ranges</Text>
            {weeklyRange.max > 0 && (
              <PriceRangeBar title="Weekly Range" min={weeklyRange.min} max={weeklyRange.max} current={weeklyRange.current} />
            )}
            {monthlyRange.max > 0 && (
              <PriceRangeBar title="Monthly Range" min={monthlyRange.min} max={monthlyRange.max} current={monthlyRange.current} />
            )}
            {yearlyRange.max > 0 && (
              <PriceRangeBar title="Yearly Range" min={yearlyRange.min} max={yearlyRange.max} current={yearlyRange.current} />
            )}
            {twoYearRange.max > 0 && (
              <PriceRangeBar title="2-Year Range" min={twoYearRange.min} max={twoYearRange.max} current={twoYearRange.current} />
            )}
          </View>

          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>RSI Values</Text>
            <View style={styles.returnRow}>
              <Text style={styles.returnLabel}>Daily RSI</Text>
              <Text style={[styles.returnValue, { color: getColor(item.rsiData?.daily) }]}>
                {item.rsiData?.daily ? parseFloat(item.rsiData.daily).toFixed(2) : 'N/A'}
              </Text>
            </View>
            <View style={styles.returnRow}>
              <Text style={styles.returnLabel}>Weekly RSI</Text>
              <Text style={[styles.returnValue, { color: getColor(item.rsiData?.weekly) }]}>
                {item.rsiData?.weekly ? parseFloat(item.rsiData.weekly).toFixed(2) : 'N/A'}
              </Text>
            </View>
            <View style={styles.returnRow}>
              <Text style={styles.returnLabel}>Monthly RSI</Text>
              <Text style={[styles.returnValue, { color: getColor(item.rsiData?.monthly) }]}>
                {item.rsiData?.monthly ? parseFloat(item.rsiData.monthly).toFixed(2) : 'N/A'}
              </Text>
            </View>
          </View>

          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Returns</Text>
            <View style={styles.returnRow}>
              <Text style={styles.returnLabel}>1 Week</Text>
              <Text style={[styles.returnValue, { color: getDetailColor(parseFloat(item.returnsData?.["1week"] || '0')) }]}>
                {item.returnsData?.["1week"] ? `${parseFloat(item.returnsData["1week"]).toFixed(2)}%` : 'N/A'}
              </Text>
            </View>
            <View style={styles.returnRow}>
              <Text style={styles.returnLabel}>1 Month</Text>
              <Text style={[styles.returnValue, { color: getDetailColor(parseFloat(item.returnsData?.["1month"] || '0')) }]}>
                {item.returnsData?.["1month"] ? `${parseFloat(item.returnsData["1month"]).toFixed(2)}%` : 'N/A'}
              </Text>
            </View>
            <View style={styles.returnRow}>
              <Text style={styles.returnLabel}>1 Year</Text>
              <Text style={[styles.returnValue, { color: getDetailColor(parseFloat(item.returnsData?.["1year"] || '0')) }]}>
                {item.returnsData?.["1year"] ? `${parseFloat(item.returnsData["1year"]).toFixed(2)}%` : 'N/A'}
              </Text>
            </View>
            <View style={styles.returnRow}>
              <Text style={styles.returnLabel}>2 Years</Text>
              <Text style={[styles.returnValue, { color: getDetailColor(parseFloat(item.returnsData?.["2year"] || '0')) }]}>
                {item.returnsData?.["2year"] ? `${parseFloat(item.returnsData["2year"]).toFixed(2)}%` : 'N/A'}
              </Text>
            </View>
          </View>

          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Volatility (Annualized)</Text>
            <Text style={styles.volatilityValue}>{volatility}</Text>
          </View>

          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Symbol</Text>
            <Text style={styles.symbolValue}>{item.ticker}</Text>
          </View>
        </ScrollView>
      </View>
      <BannerAd testMode={true} />
    </>
  );
}