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
import { AssetItem } from '../types';

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

  const formatReturn = (value: number | null | undefined) => {
    if (value === null || value === undefined) return 'N/A';
    return (value > 0 ? '+' : '') + value.toFixed(2) + '%';
  };

  const getDetailColor = (value: number | null | undefined) => {
    if (value === null || value === undefined) return '#888';
    return value > 0 ? '#4CAF50' : value < 0 ? '#FF5252' : '#888';
  };

  const getPriceRange = (prices: { date: string; price: number }[], days: number) => {
    if (!prices || prices.length === 0) return { min: 0, max: 0 };
    const now = new Date();
    const pastDate = new Date(now);
    pastDate.setDate(now.getDate() - days);

    const filteredPrices = prices.filter(p => new Date(p.date) >= pastDate);
    if (filteredPrices.length === 0) return { min: 0, max: 0 };

    const values = filteredPrices.map(p => p.price);
    return {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  };

  const volatility = calculateVolatility(item.allPrices ? item.allPrices.map(p => p.price) : []);
  const weeklyRange = getPriceRange(item.allPrices, 7);
  const monthlyRange = getPriceRange(item.allPrices, 30);
  const yearlyRange = getPriceRange(item.allPrices, 365);

  return (
    <SafeAreaView style={styles.detailsPage}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
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
          {weeklyRange.max > 0 && item.rawCurrentPrice && (
            <PriceRangeBar title="Weekly Range" min={weeklyRange.min} max={weeklyRange.max} current={item.rawCurrentPrice} />
          )}
          {monthlyRange.max > 0 && item.rawCurrentPrice && (
            <PriceRangeBar title="Monthly Range" min={monthlyRange.min} max={monthlyRange.max} current={item.rawCurrentPrice} />
          )}
          {yearlyRange.max > 0 && item.rawCurrentPrice && (
            <PriceRangeBar title="Yearly Range" min={yearlyRange.min} max={yearlyRange.max} current={item.rawCurrentPrice} />
          )}
        </View>

        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>RSI (14-day)</Text>
          <Text style={[styles.rsiValue, { color: getColor(item.rsi) }]}>
            {item.rsi}
          </Text>
          <Text style={styles.rsiDescription}>
            {item.rsi !== 'N/A' && (
              (item.rsi < 30) ? 'Oversold' :
              (item.rsi > 70) ? 'Overbought' : 'Neutral'
            )}
          </Text>
        </View>

        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Returns</Text>
          <View style={styles.returnRow}>
            <Text style={styles.returnLabel}>1 Day</Text>
            <Text style={[styles.returnValue, { color: getDetailColor(item.rawOneDayReturn) }]}>
              {formatReturn(item.rawOneDayReturn)}
            </Text>
          </View>
          <View style={styles.returnRow}>
            <Text style={styles.returnLabel}>1 Week</Text>
            <Text style={[styles.returnValue, { color: getDetailColor(item.rawOneWeekReturn) }]}>
              {formatReturn(item.rawOneWeekReturn)}
            </Text>
          </View>
          <View style={styles.returnRow}>
            <Text style={styles.returnLabel}>1 Month</Text>
            <Text style={[styles.returnValue, { color: getDetailColor(item.rawOneMonthReturn) }]}>
              {formatReturn(item.rawOneMonthReturn)}
            </Text>
          </View>
          {item.rawThreeMonthReturn !== undefined && (
            <View style={styles.returnRow}>
              <Text style={styles.returnLabel}>3 Months</Text>
              <Text style={[styles.returnValue, { color: getDetailColor(item.rawThreeMonthReturn) }]}>
                {formatReturn(item.rawThreeMonthReturn)}
              </Text>
            </View>
          )}
          {item.rawSixMonthReturn !== undefined && (
            <View style={styles.returnRow}>
              <Text style={styles.returnLabel}>6 Months</Text>
              <Text style={[styles.returnValue, { color: getDetailColor(item.rawSixMonthReturn) }]}>
                {formatReturn(item.rawSixMonthReturn)}
              </Text>
            </View>
          )}
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
    </SafeAreaView>
  );
}