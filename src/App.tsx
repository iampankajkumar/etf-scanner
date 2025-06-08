import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
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
import { formatSymbol } from './utils/data';
import { TableHeader } from './components/TableHeader';
import { DataRow } from './components/DataRow';
import { DetailsPage } from './components/DetailsPage';
import { styles } from './styles/appStyles';
import { AssetItem } from './types';
import { useRSI } from './hooks/useRSI';
import { useScrollSync } from './hooks/useScrollSync';
import db from './db/database';
import { AddSymbolModal } from './components/AddSymbolModal';

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
    addTicker,
    removeTicker,
  } = useRSI();

  // State for UI components
  const [showDetailsPage, setShowDetailsPage] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<AssetItem | null>(null);
  const [showAddSymbolModal, setShowAddSymbolModal] = useState<boolean>(false);

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
   * Handle adding a new symbol
   */
  const handleAddSymbol = useCallback((symbol: string) => {
    const formattedSymbol = formatSymbol(symbol);
    addTicker(formattedSymbol);
    setShowAddSymbolModal(false);
  }, [addTicker]);

  /**
   * Handle deleting a symbol
   */
  const handleDeleteSymbol = useCallback((symbolToDelete: string) => {
    Alert.alert(
      "Delete Symbol?",
      `Are you sure you want to remove ${symbolToDelete.replace('.NS', '')}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => removeTicker(symbolToDelete),
        },
      ],
      { cancelable: true }
    );
  }, [removeTicker]);

  /**
   * Render a row in the fixed column
   */
  const renderFixedRow = useCallback(({ item }: { item: AssetItem }) => (
    <DataRow 
      item={item} 
      onDelete={handleDeleteSymbol} 
      onSymbolPress={handleSymbolPress} 
      fixed 
      scrollable={false} 
    />
  ), [handleDeleteSymbol, handleSymbolPress]);

  /**
   * Render a row in the scrollable columns
   */
  const renderScrollableRow = useCallback(({ item }: { item: AssetItem }) => (
    <DataRow 
      item={item} 
      onDelete={handleDeleteSymbol} 
      onSymbolPress={handleSymbolPress} 
      scrollable 
      fixed={false} 
    />
  ), [handleDeleteSymbol, handleSymbolPress]);

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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <Image source={require('./assets/icon.png')} style={styles.headerIcon} />
          <Text style={styles.headerTitle}>Nifty ETF Tracker</Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddSymbolModal(true)}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

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
              keyExtractor={(item) => `fixed-${item.ticker}`}
              renderItem={renderFixedRow}
              onScroll={handleFixedScroll}
              scrollEventThrottle={16}
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
                  keyExtractor={(item) => `scrollable-${item.ticker}`}
                  renderItem={renderScrollableRow}
                  onScroll={handleScrollableScroll}
                  scrollEventThrottle={16}
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                />
              </ScrollView>
            </View>
          </View>
        )}

        {/* Empty state */}
        {data.length === 0 && status !== 'loading' && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No assets to display.</Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={() => setShowAddSymbolModal(true)}
            >
              <Text style={styles.emptyButtonText}>Add Symbol</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Add symbol modal */}
      <AddSymbolModal
        visible={showAddSymbolModal}
        onClose={() => setShowAddSymbolModal(false)}
        onAdd={handleAddSymbol}
      />
    </SafeAreaView>
  );
}