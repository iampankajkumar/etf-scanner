import React, { useEffect, useState, useCallback, useRef } from 'react';
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
} from 'react-native';
import { DEFAULT_TICKERS } from './constants/tickers';
import { fetchPriceData } from './api/yahooFinance';
import { calculateRSI } from './utils/calculations';
import { formatSymbol, sortData } from './utils/data';
import { TableHeader } from './components/TableHeader';
import { DataRow } from './components/DataRow';
import { DetailsPage } from './components/DetailsPage';
import { AddSymbolModal } from './components/AddSymbolModal';
import { styles } from './styles/appStyles';

export default function App() {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [tickers, setTickers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [showDetailsPage, setShowDetailsPage] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const flatListRef = useRef(null);

  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollX = useRef(new Animated.Value(0)).current;

  const fixedScrollRef = useRef(null);
  const scrollableScrollRef = useRef(null);
  const horizontalScrollRef = useRef(null);

  const isScrolling = useRef({ fixed: false, scrollable: false });

  const handleFixedScroll = useCallback((event) => {
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

  const handleScrollableScroll = useCallback((event) => {
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

  useEffect(() => {
    setTickers(DEFAULT_TICKERS);
  }, []);

  const loadRSI = useCallback(async () => {
    setRefreshing(true);
    try {
      const result = await Promise.all(
        tickers.map(async (ticker) => {
          const {
            closingPrices,
            currentPrice,
            oneDayReturn,
            oneWeekReturn,
            oneMonthReturn,
            threeMonthReturn,
            sixMonthReturn,
            allPrices
          } = await fetchPriceData(ticker);

          const rsiArray = calculateRSI(closingPrices);
          const rsi = rsiArray.length ? parseFloat(rsiArray[rsiArray.length - 1].toFixed(2)) : 'N/A';

          const formattedOneDayReturn = oneDayReturn !== null
            ? (oneDayReturn > 0 ? '+' : '') + oneDayReturn.toFixed(2) + '%'
            : 'N/A';
          const formattedOneWeekReturn = oneWeekReturn !== null
            ? (oneWeekReturn > 0 ? '+' : '') + oneWeekReturn.toFixed(2) + '%'
            : 'N/A';
          const formattedOneMonthReturn = oneMonthReturn !== null
            ? (oneMonthReturn > 0 ? '+' : '') + oneMonthReturn.toFixed(2) + '%'
            : 'N/A';

          return {
            ticker,
            rsi,
            currentPrice: currentPrice !== null ? currentPrice.toFixed(2) : 'N/A',
            oneDayReturn: formattedOneDayReturn,
            oneWeekReturn: formattedOneWeekReturn,
            oneMonthReturn: formattedOneMonthReturn,
            rawRsi: rsi === 'N/A' ? null : rsi,
            rawCurrentPrice: currentPrice,
            rawOneDayReturn: oneDayReturn,
            rawOneWeekReturn: oneWeekReturn,
            rawOneMonthReturn: oneMonthReturn,
            rawThreeMonthReturn: threeMonthReturn,
            rawSixMonthReturn: sixMonthReturn,
            allPrices: allPrices
          };
        })
      );

      const sorted = result.sort((a, b) => {
        if (a.rsi === 'N/A') return 1;
        if (b.rsi === 'N/A') return -1;
        return a.rsi - b.rsi;
      });

      setData(sorted);
    } catch (error) {
      console.error('Error loading RSI data:', error);
    } finally {
      setRefreshing(false);
    }
  }, [tickers]);

  useEffect(() => {
    if (tickers.length > 0) {
      loadRSI();
    }
  }, [tickers, loadRSI]);

  useEffect(() => {
    if (data.length > 0 && sortConfig.key) {
      const sorted = sortData(data, sortConfig.key, sortConfig.direction);
      setData(sorted);
    }
  }, [sortConfig]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSymbolPress = (item) => {
    setSelectedItem(item);
    setShowDetailsPage(true);
  };

  const handleBackFromDetails = useCallback(() => {
    setShowDetailsPage(false);
    setSelectedItem(null);
  }, []);

  const addSymbol = (symbol) => {
    const formattedSymbol = formatSymbol(symbol);
    if (tickers.includes(formattedSymbol)) {
      Alert.alert('Error', 'This symbol is already in your list');
      return;
    }
    const newTickers = [...tickers, formattedSymbol];
    setTickers(newTickers);
    setModalVisible(false);
  };

  const deleteSymbol = (symbolToDelete) => {
    Alert.alert(
      "Delete Symbol?",
      `Are you sure you want to remove ${symbolToDelete.replace('.NS', '')}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const newTickers = tickers.filter(ticker => ticker !== symbolToDelete);
            setTickers(newTickers);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderFixedRow = ({ item }) => (
    <DataRow item={item} onDelete={deleteSymbol} onSymbolPress={handleSymbolPress} fixed />
  );

  const renderScrollableRow = ({ item }) => (
    <DataRow item={item} onDelete={deleteSymbol} onSymbolPress={handleSymbolPress} scrollable />
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
              <RefreshControl refreshing={refreshing} onRefresh={loadRSI} />
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