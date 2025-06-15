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
import { formatSymbol } from './utils/data';
import { CustomMenu } from './components/molecules';
import { colors } from './theme/colors';
import { TableHeader } from './components/TableHeader';
import { DataRow } from './components/DataRow';
import { DetailsPage } from './components/DetailsPage';
import { BannerAd } from './components/BannerAd';
import { styles } from './styles/appStyles';
import { AssetItem } from './types';
import { useRSI } from './hooks/useRSI';
import { useScrollSync } from './hooks/useScrollSync';
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
    loadRSI,
    handleSort,
  } = useRSI();

  // State for UI components
  const [showDetailsPage, setShowDetailsPage] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<AssetItem | null>(null);
  const [menuVisible, setMenuVisible] = useState<boolean>(false);

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
   * Render a row in the fixed column
   */
  const renderFixedRow = useCallback(({ item }: { item: AssetItem }) => (
    <DataRow 
      item={item} 
      onDelete={() => {}} 
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
      onDelete={() => {}} 
      onSymbolPress={handleSymbolPress} 
      scrollable 
      fixed={false} 
    />
  ), [handleSymbolPress]);

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
              title: 'Settings',
              onPress: () => Alert.alert('Settings', 'Settings page coming soon!'),
            },
            {
              title: 'Dark Mode',
              onPress: () => Alert.alert('Dark Mode', 'Theme settings coming soon!'),
            },
            {
              title: 'About',
              onPress: () => Alert.alert('About', 'RSI Tracker v1.0.0\nBuilt with ❤️ using React Native'),
            },
            {
              title: 'Help',
              onPress: () => Alert.alert('Help', 'Help center coming soon!'),
            },
          ]}
        />

        {/* Error message */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
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
          {status === 'loading' && !isRefreshing && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4CAF50" />
              <Text style={styles.loadingText}>Loading data...</Text>
            </View>
          )}

          {/* Table content */}
          {data.length > 0 && (
            <View style={styles.tableContainer}>
              {/* Fixed column */}
              <Animated.FlatList
                ref={fixedListRef}
                data={data}
                keyExtractor={(item) => item.ticker}
                renderItem={renderFixedRow}
                onScroll={handleFixedScroll}
                scrollEventThrottle={8}
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl 
                    refreshing={isRefreshing} 
                    onRefresh={loadRSI} 
                    colors={['#4CAF50']}
                    tintColor="#4CAF50"
                  />
                }
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

              {/* Scrollable columns */}
              <View style={styles.scrollableColumnsContainer}>
                <ScrollView
                  ref={horizontalScrollRef}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  onScroll={handleHorizontalScroll}
                  scrollEventThrottle={16}
                  bounces={false}
                >
                  <Animated.FlatList
                    ref={scrollableListRef}
                    data={data}
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

          {/* Empty state */}
          {data.length === 0 && status !== 'loading' && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No assets to display.</Text>
            </View>
          )}
        </View>
      </View>
      
      {/* Banner Ad */}
      <BannerAd testMode={true} />
    </SafeAreaView>
  );
}