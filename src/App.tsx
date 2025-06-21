import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Animated,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Text } from './components/atoms/Text';
import { Entypo } from '@expo/vector-icons';
import { formatSymbol, sortData } from './utils/data';
import { CustomMenu } from './components/molecules';
import { colors } from './theme/colors';
import { TableHeader } from './components/TableHeader';
import { DataRow } from './components/DataRow';
import { DetailsPage } from './components/DetailsPage';
import { BannerAd } from './components/BannerAd';
import { styles } from './styles/appStyles';
import { AssetItem } from './types';
import { useRSI } from './hooks/useRSI';
import { useLivePrice } from './hooks/useLivePrice';
import { useScrollSync } from './hooks/useScrollSync';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LivePriceDebug } from './components/LivePriceDebug';
import db from './db/database';

/**
 * Main application component
 */
export default function App(): React.JSX.Element {
  // Initialize database
  useEffect(() => {
    db.init().catch(err => {
      console.error('Database initialization failed', err);
      Alert.alert('Error', 'Failed to initialize database. Some features may not work properly.');
    });
  }, []);

  // Get RSI data and related functions
  const {
    data,
    status,
    error,
    isRefreshing,
    sortConfig,
    fromCache,
    cacheAge,
    lastUpdated,
    loadRSI,
    refreshRSI,
    handleSort,
  } = useRSI();

  // Get live price data and related functions
  const {
    livePrices,
    isLoading: isLivePriceLoading,
    error: livePriceError,
    refreshLivePrices,
    getLivePriceForSymbol,
  } = useLivePrice();

  // State for UI components
  const [showDetailsPage, setShowDetailsPage] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<AssetItem | null>(null);
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [showDebugPage, setShowDebugPage] = useState<boolean>(false);

  // Merge live price data with main data and apply sorting
  const dataWithLivePrices = React.useMemo(() => {
    const mergedData = data.map(item => {
      const livePrice = getLivePriceForSymbol(item.ticker);
      return {
        ...item,
        livePrice: livePrice?.livePrice || 'N/A',
        changePercent: livePrice?.changePercent || 'N/A',
        rawLivePrice: livePrice?.rawLivePrice || null,
        rawChangePercent: livePrice?.rawChangePercent || null,
      };
    });

    // Apply sorting to the merged data if sorting by live price columns
    if (sortConfig.key === 'livePrice' || sortConfig.key === 'changePercent') {
      return sortData(mergedData, sortConfig.key, sortConfig.direction);
    }

    return mergedData;
  }, [data, getLivePriceForSymbol, sortConfig]);

  // Set up scroll synchronization
  const {
    scrollY,
    scrollX,
    fixedListRef,
    scrollableListRef,
    horizontalScrollRef,
    handleFixedScroll,
    handleScrollableScroll,
    handleHorizontalScroll,
  } = useScrollSync<AssetItem>();

  /**
   * Handle press on a symbol to show details
   */
  const handleSymbolPress = useCallback((item: AssetItem) => {
    setSelectedItem(item);
    setShowDetailsPage(true);
  }, []);

  /**
   * Handle back button press from details page
   */
  const handleBackFromDetails = useCallback(() => {
    setShowDetailsPage(false);
    setSelectedItem(null);
  }, []);

  /**
   * Handle refresh of both RSI data and live prices
   */
  const handleRefreshAll = useCallback(async () => {
    await Promise.all([
      refreshRSI(),
      refreshLivePrices()
    ]);
  }, [refreshRSI, refreshLivePrices]);


  /**
   * Render a row in the fixed column
   */
  const renderFixedRow = useCallback(({ item }: { item: AssetItem }) => (
    <DataRow
      item={item}
      onDelete={() => { }}
      onSymbolPress={handleSymbolPress}
      fixed
      scrollable={false}
    />
  ), [handleSymbolPress]);

  /**
   * Render a row in the scrollable columns
   */
  const renderScrollableRow = useCallback(({ item }: { item: AssetItem }) => (
    <DataRow
      item={item}
      onDelete={() => { }}
      onSymbolPress={handleSymbolPress}
      scrollable
      fixed={false}
    />
  ), [handleSymbolPress]);

  // Show debug page if requested
  if (showDebugPage) {
    return (
      <ErrorBoundary>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <View style={styles.appHeaderContainer}>
              <TouchableOpacity onPress={() => setShowDebugPage(false)} style={styles.backButton}>
                <Text style={styles.backButtonText}>← Back</Text>
              </TouchableOpacity>
            </View>
            <LivePriceDebug />
          </View>
        </SafeAreaView>
      </ErrorBoundary>
    );
  }

  // Show details page if an item is selected
  if (showDetailsPage && selectedItem) {
    return (
      <DetailsPage
        item={selectedItem}
        onBack={handleBackFromDetails}
      />
    );
  }

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="#121212" translucent />

          {/* Header */}
          <View style={styles.appHeaderContainer}>
            <View style={styles.headerLeft}>
              <Image source={require('./assets/icon.png')} style={styles.headerIcon} />
              <Text style={styles.headerTitle}>Nifty ETF Tracker</Text>
            </View>
            <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
              <Entypo name="dots-three-vertical" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          <CustomMenu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            items={[
              {
                title: 'Refresh Data',
                onPress: () => {
                  setMenuVisible(false);
                  handleRefreshAll();
                },
              },
              {
                title: 'Cache Status',
                onPress: () => {
                  setMenuVisible(false);
                  const cacheInfo = fromCache
                    ? `Using cached data from ${cacheAge} hours ago`
                    : 'Using fresh data from API';
                  Alert.alert('Cache Status', cacheInfo);
                },
              },
              {
                title: 'Settings',
                onPress: () => Alert.alert('Settings', 'Settings page coming soon!'),
              },
              {
                title: 'About',
                onPress: () => Alert.alert('About', 'RSI Tracker v1.0.0\nBuilt with ❤️ using React Native\n\n📱 Offline-first design - Data cached for 24 hours'),
              },
              {
                title: 'Help',
                onPress: () => Alert.alert('Help', 'Pull down to refresh data\nData is cached for 24 hours for offline use\nCheck Cache Status for more info'),
              },
              {
                title: 'Debug Live Prices',
                onPress: () => {
                  setMenuVisible(false);
                  setShowDebugPage(true);
                },
              },
            ]}
          />

          {/* Error message */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Live price error message */}
          {livePriceError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Live Price: {livePriceError}</Text>
            </View>
          )}

          {/* Cache status indicator */}
          {fromCache && cacheAge !== undefined && (
            <View style={styles.cacheStatusContainer}>
              <Text style={styles.cacheStatusText}>
                📱 Offline mode - Data from {cacheAge} hours ago
              </Text>
            </View>
          )}

          {/* Main content */}
          <View style={styles.contentContainer}>
            {/* Table header */}
            <TableHeader
              sortConfig={sortConfig}
              onSort={handleSort}
              scrollX={scrollX}
            />
            {/* Loading indicator */}


            {/* Table content */}
            {dataWithLivePrices.length > 0 && (
              <View style={styles.tableContainer}>
                {/* Fixed column */}
                <View style={{ flex: 1, overflow: 'hidden' }}>
                  <Animated.FlatList
                    ref={fixedListRef}
                    data={dataWithLivePrices}
                    keyExtractor={(item) => item.ticker}
                    renderItem={renderFixedRow}
                    onScroll={handleFixedScroll}
                    scrollEventThrottle={8}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={5}
                    updateCellsBatchingPeriod={100}
                    initialNumToRender={10}
                    windowSize={5}
                    legacyImplementation={false}
                    disableVirtualization={false}
                    getItemLayout={(data, index) => ({
                      length: 50, // Approximate row height
                      offset: 50 * index,
                      index,
                    })}
                  />
                </View>
                {/* Scrollable columns */}
                <View style={styles.scrollableColumnsContainer}>
                  <ScrollView
                    ref={horizontalScrollRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleHorizontalScroll}
                    scrollEventThrottle={16}
                    bounces={false}
                    // refreshControl={
                    //     <RefreshControl
                    //       refreshing={isRefreshing || isLivePriceLoading}
                    //       onRefresh={handleRefreshAll}
                    //       colors={['#4CAF50']}
                    //       tintColor="#4CAF50"
                    //     />
                    // }
                  >
                    <Animated.FlatList
                      ref={scrollableListRef}
                      data={dataWithLivePrices}
                      keyExtractor={(item) => item.ticker}
                      renderItem={renderScrollableRow}
                      onScroll={handleScrollableScroll}
                      scrollEventThrottle={8}
                      showsVerticalScrollIndicator={false}
                      bounces={false}
                      removeClippedSubviews={true}
                      maxToRenderPerBatch={5}
                      updateCellsBatchingPeriod={100}
                      initialNumToRender={10}
                      windowSize={5}
                      legacyImplementation={false}
                      disableVirtualization={false}
                      
                      getItemLayout={(data, index) => ({
                        length: 50, // Approximate row height
                        offset: 50 * index,
                        index,
                      })}
                    />
                  </ScrollView>
                </View>
              </View>
            )}
            {/* {status === 'loading' && !isRefreshing && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>Loading data...</Text>
              </View>
            )} */}
            {/* Empty state */}
            {dataWithLivePrices.length === 0 && status !== 'loading' && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No assets to display.</Text>
              </View>
            )}
          </View>
        </View>

        {/* Banner Ad */}
        <BannerAd testMode={true} />
      </SafeAreaView>
    </ErrorBoundary>
  );
}