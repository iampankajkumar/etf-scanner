import React, { useState, useCallback, useRef } from 'react';
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
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { formatSymbol } from './utils/data';
import { TableHeader } from './components/TableHeader';
import { DataRow } from './components/DataRow';
import { DetailsPage } from './components/DetailsPage';
import { AddSymbolModal } from './components/AddSymbolModal';
import { styles } from './styles/appStyles';
import { AssetItem } from './types';
import { useRSI } from './hooks/useRSI';

export default function App(): React.JSX.Element {
  const {
    data,
    status,
    sortConfig,
    loadRSI,
    handleSort,
    addTicker,
    removeTicker,
  } = useRSI();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [showDetailsPage, setShowDetailsPage] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<AssetItem | null>(null);
  const flatListRef = useRef<FlatList<AssetItem>>(null);

  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollX = useRef(new Animated.Value(0)).current;

  const fixedScrollRef = useRef<FlatList<AssetItem>>(null);
  const scrollableScrollRef = useRef<FlatList<AssetItem>>(null);
  const horizontalScrollRef = useRef<ScrollView>(null);

  const isScrolling = useRef({ fixed: false, scrollable: false });

  const handleFixedScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!isScrolling.current.scrollable) {
      isScrolling.current.fixed = true;
      const offsetY = event.nativeEvent.contentOffset.y;
      scrollY.setValue(offsetY);

      scrollableScrollRef.current?.scrollToOffset({
        offset: offsetY,
        animated: false
      });

      requestAnimationFrame(() => {
        isScrolling.current.fixed = false;
      });
    }
  }, [scrollY]);

  const handleScrollableScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!isScrolling.current.scrollable) {
      isScrolling.current.scrollable = true;
      const offsetY = event.nativeEvent.contentOffset.y;
      scrollY.setValue(offsetY);

      fixedScrollRef.current?.scrollToOffset({
        offset: offsetY,
        animated: false
      });

      requestAnimationFrame(() => {
        isScrolling.current.scrollable = false;
      });
    }
  }, [scrollY]);

  const handleHorizontalScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleSymbolPress = (item: AssetItem) => {
    setSelectedItem(item);
    setShowDetailsPage(true);
  };

  const handleBackFromDetails = useCallback(() => {
    setShowDetailsPage(false);
    setSelectedItem(null);
  }, []);

  const addSymbol = (symbol: string) => {
    const formattedSymbol = formatSymbol(symbol);
    addTicker(formattedSymbol);
    setModalVisible(false);
  };

  const deleteSymbol = (symbolToDelete: string) => {
    Alert.alert(
      "Delete Symbol?",
      `Are you sure you want to remove ${symbolToDelete.replace('.NS', '')}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            removeTicker(symbolToDelete);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderFixedRow = ({ item }: { item: AssetItem }) => (
    <DataRow item={item} onDelete={deleteSymbol} onSymbolPress={handleSymbolPress} fixed scrollable={false} />
  );

  const renderScrollableRow = ({ item }: { item: AssetItem }) => (
    <DataRow item={item} onDelete={deleteSymbol} onSymbolPress={handleSymbolPress} scrollable fixed={false} />
  );

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
      <Text style={styles.header}>📊 Nifty ETF Tracker</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ Add Symbol</Text>
      </TouchableOpacity>

      <View style={{ flex: 1 }}>
        <TableHeader sortConfig={sortConfig} onSort={handleSort} scrollX={scrollX} />

        <View style={{ flexDirection: 'row', flex: 1 }}>
          <Animated.FlatList
            ref={fixedScrollRef}
            data={data}
            keyExtractor={(item) => `fixed-${item.ticker}`}
            renderItem={renderFixedRow}
            onScroll={handleFixedScroll}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={status === 'loading'} onRefresh={loadRSI} />
            }
            bounces={false}
          />

          <View style={{ flex: 15 }}>
            <ScrollView
              ref={horizontalScrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              onScroll={handleHorizontalScroll}
              scrollEventThrottle={16}
              bounces={false}
            >
              <Animated.FlatList
                ref={scrollableScrollRef}
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
      </View>
      <AddSymbolModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={addSymbol}
      />
    </SafeAreaView>
  );
}