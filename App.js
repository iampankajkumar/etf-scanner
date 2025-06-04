import { useEffect, useState, useCallback } from 'react';

import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  RefreshControl, 
  TouchableOpacity, 
  TextInput,
  Alert,
  Modal
} from 'react-native';

// Initial list of tickers
const defaultTickers = ['ITBEES.NS', 'BANKBEES.NS', 'NIFTYBEES.NS', 'JUNIORBEES.NS', 'ALPHA.NS','MOMENTUM.NS','GOLDBEES.NS','SILVERBEES.NS','PHARMABEES.NS','FMCGIETF.NS','MIDCAP.NS','EVINDIA.NS','MODEFENCE.NS','PSUBNKBEES.NS', 'BTC-USD', 'ETH-USD'];

async function fetchPriceData(symbol) {
  try {
    // Fetch 3 months of data to ensure we have enough points for RSI calculation considering holidays
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=3mo`
    );
    const json = await response.json();
    
    // Check if the response has the expected structure
    if (!json.chart?.result?.[0]?.indicators?.quote?.[0]?.close) {
      console.error(`Invalid data structure for ${symbol}`);
      return { closingPrices: [], currentPrice: null, oneDayReturn: null, oneWeekReturn: null };
    }
    
    // Get timestamps and closing prices
    const timestamps = json.chart.result[0].timestamp || [];
    const closes = json.chart.result[0].indicators.quote[0].close || [];
    
    // Create array of clean closing prices (non-null values only)
    const validPrices = [];
    const validTimestamps = [];
    
    for (let i = 0; i < closes.length; i++) {
      if (closes[i] !== null && closes[i] !== undefined) {
        validPrices.push(closes[i]);
        validTimestamps.push(timestamps[i]);
      }
    }
    
    if (validPrices.length === 0) {
      return { closingPrices: [], currentPrice: null, oneDayReturn: null, oneWeekReturn: null };
    }
    
    // Get current price (most recent closing price)
    const currentPrice = validPrices[validPrices.length - 1];
    
    // Calculate 1-day return
    const yesterdayPrice = validPrices.length > 1 ? validPrices[validPrices.length - 2] : null;
    const oneDayReturn = yesterdayPrice ? ((currentPrice - yesterdayPrice) / yesterdayPrice) * 100 : null;
    
    // Calculate 1-week return (approximately 5 trading days)
    const weekAgoIndex = validPrices.length > 5 ? validPrices.length - 6 : null;
    const weekAgoPrice = weekAgoIndex !== null ? validPrices[weekAgoIndex] : null;
    const oneWeekReturn = weekAgoPrice ? ((currentPrice - weekAgoPrice) / weekAgoPrice) * 100 : null;

    // Calculate 1-month return (approximately 21 trading days)
    const monthAgoIndex = validPrices.length > 21 ? validPrices.length - 22 : null;
    const monthAgoPrice = monthAgoIndex !== null ? validPrices[monthAgoIndex] : null;
    const oneMonthReturn = monthAgoPrice ? ((currentPrice - monthAgoPrice) / monthAgoPrice) * 100 : null;
    
    // Return the last 30 valid prices for RSI calculation
    return {
      closingPrices: validPrices.slice(-30),
      currentPrice,
      oneDayReturn,
      oneWeekReturn,
      oneMonthReturn
    };
  } catch (e) {
    console.error('Error fetching', symbol, e);
    return { closingPrices: [], currentPrice: null, oneDayReturn: null, oneWeekReturn: null };
  }
}

function calculateRSI(closes, period = 14) {
  if (closes.length < period + 1) return []; // Need at least period+1 data points
  
  // Calculate price changes between consecutive closing prices
  const changes = [];
  for (let i = 1; i < closes.length; i++) {
    changes.push(closes[i] - closes[i - 1]);
  }
  
  // We now have period changes to calculate the initial RSI
  if (changes.length < period) return [];
  
  // Calculate initial average gain and loss
  let sumGain = 0;
  let sumLoss = 0;
  
  for (let i = 0; i < period; i++) {
    if (changes[i] > 0) {
      sumGain += changes[i];
    } else {
      sumLoss += Math.abs(changes[i]);
    }
  }
  
  let avgGain = sumGain / period;
  let avgLoss = sumLoss / period;
  
  // Calculate first RSI
  const rsis = [];
  let rs = avgGain / (avgLoss === 0 ? 0.001 : avgLoss); // Avoid division by zero
  rsis.push(100 - (100 / (1 + rs)));
  
  // Calculate RSI for remaining data using Wilder's smoothing method
  for (let i = period; i < changes.length; i++) {
    const change = changes[i];
    const currentGain = change > 0 ? change : 0;
    const currentLoss = change < 0 ? Math.abs(change) : 0;
    
    // Apply Wilder's smoothing
    avgGain = ((avgGain * (period - 1)) + currentGain) / period;
    avgLoss = ((avgLoss * (period - 1)) + currentLoss) / period;
    
    rs = avgGain / (avgLoss === 0 ? 0.001 : avgLoss);
    rsis.push(100 - (100 / (1 + rs)));
  }
  
  return rsis;
}

export default function App() {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [tickers, setTickers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newSymbol, setNewSymbol] = useState('');
  
  // Load saved tickers from storage on initial load
  useEffect(() => {
    // In a real app, you would load from AsyncStorage here
    // For this example, we'll use the default tickers
    setTickers(defaultTickers);
  }, []);
  
  // Load RSI data whenever tickers list changes
  useEffect(() => {
    if (tickers.length > 0) {
      loadRSI();
    }
  }, [tickers, loadRSI]);

// Move this above useEffect
const loadRSI = useCallback(async () => {
  setRefreshing(true);
  try {
    const result = await Promise.all(
      tickers.map(async (ticker) => {
        const { closingPrices, currentPrice, oneDayReturn, oneWeekReturn, oneMonthReturn } = await fetchPriceData(ticker);
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
          oneMonthReturn: formattedOneMonthReturn
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

// Now this will work
useEffect(() => {
  if (tickers.length > 0) {
    loadRSI();
  }
}, [tickers, loadRSI]);

  const addSymbol = () => {
  // Basic validation
  if (!newSymbol.trim()) {
    Alert.alert('Error', 'Please enter a valid symbol');
    return;
  }
  
  // Format the ticker correctly
  let formattedSymbol = newSymbol.trim().toUpperCase();
  
  // Only add .NS suffix if it's not already present and it's not a crypto or US stock
  if (!formattedSymbol.includes('.') && !formattedSymbol.includes('-')) {
    // Check if it's likely a crypto symbol (ends with USD) or has other indicators
    const isCrypto = formattedSymbol.endsWith('USD') || 
                     formattedSymbol.includes('BTC') || 
                     formattedSymbol.includes('ETH');
    
    if (!isCrypto) {
      formattedSymbol += '.NS'; // Add .NS suffix only for Indian stocks
    }
  }
  
  // Check if the ticker already exists
  if (tickers.includes(formattedSymbol)) {
    Alert.alert('Error', 'This symbol is already in your list');
    return;
  }
  
  // Add the new ticker
  const newTickers = [...tickers, formattedSymbol];
  setTickers(newTickers);
  
  // In a real app, you would save to AsyncStorage here
  
  // Reset input and close modal
  setNewSymbol('');
  setModalVisible(false);
};
  
  const deleteSymbol = (symbolToDelete) => {
    Alert.alert(
      "Delete Symbol?",
      `Are you sure you want to remove ${symbolToDelete.replace('.NS', '')}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
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

  const getColor = (rsi) => {
    if (rsi === 'N/A') return 'black';
    const value = parseFloat(rsi);
    if (value < 30) return 'red';
    if (value > 70) return 'green';
    return 'white';
  };

  const getReturnColor = (returnValue) => {
    if (returnValue === 'N/A') return 'black';
    return returnValue.startsWith('+') ? 'green' : returnValue === '0.00%' ? 'black' : 'red';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📊 Nifty ETF Tracker</Text>
      
      {/* Add Button */}
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ Add Symbol</Text>
      </TouchableOpacity>
      
      {/* Column Headers */}
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, styles.symbolHeader]}>Symbol</Text>
        <Text style={[styles.headerCell, styles.priceHeader]}>Price</Text>
        <Text style={[styles.headerCell, styles.rsiHeader]}>RSI</Text>
        <Text style={[styles.headerCell, styles.returnHeader]}>1W</Text>
        <Text style={[styles.headerCell, styles.returnHeader]}>1M</Text>
      </View>
      
      {/* Symbol List */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.ticker}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadRSI} />} 
        renderItem={({ item }) => (
          <TouchableOpacity
            onLongPress={() => deleteSymbol(item.ticker)}
            activeOpacity={0.7}
            style={{ backgroundColor: '#fff' }}
          >
                          <View style={styles.row}>
              <Text style={styles.ticker}>{item.ticker.replace('.NS', '')}</Text>
              <View style={styles.dataContainer}>
                <Text style={[styles.priceCell]}>{item.currentPrice}</Text>
                <Text style={[styles.dataCell, { color: getColor(item.rsi) }]}>{item.rsi}</Text>
                <Text style={[styles.dataCell, { color: getReturnColor(item.oneWeekReturn) }]}>{item.oneWeekReturn}</Text>
                    <Text style={[styles.dataCell, { color: getReturnColor(item.oneMonthReturn) }]}>{item.oneMonthReturn}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          refreshing ? null : <Text style={styles.emptyText}>No data available</Text>
        }
      />
      
      {/* Add Symbol Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Add New Symbol</Text>
            <TextInput
              style={styles.input}
              value={newSymbol}
              onChangeText={setNewSymbol}
              placeholder="Enter symbol (e.g., RELIANCE)"
              autoCapitalize="characters"
              autoCorrect={false}
            />
            <Text style={styles.inputHelp}>
              Enter symbol (e.g., RELIANCE for Indian stocks, BTC-USD for crypto)
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => {
                  setNewSymbol('');
                  setModalVisible(false);
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonAdd]}
                onPress={addSymbol}
              >
                <Text style={[styles.buttonText, styles.buttonAddText]}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingTop: 50, 
    paddingHorizontal: 10, 
    backgroundColor: '#121212',
  },
  header: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    textAlign: 'center',
    color: '#FFFFFF',
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 8,
    paddingHorizontal: 5,
    marginBottom: 5,
  },
  headerCell: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#CCCCCC',
  },
  symbolHeader: {
    flex: 1,
    textAlign: 'left',
  },
  priceHeader: {
    width: 70,
    textAlign: 'right',
  },
  rsiHeader: {
    width: 50,
    textAlign: 'right',
  },
  returnHeader: {
    width: 60,
    textAlign: 'right',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#333',
    backgroundColor: '#1E1E1E',
    paddingHorizontal: 5,
  },
  dataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ticker: { 
    fontSize: 12,
    flex: 1,
    color: '#FFFFFF',
  },
  dataCell: {
    fontSize: 14,
    fontWeight: 'bold', 
    textAlign: 'right',
    width: 60,
    color: '#FFFFFF',
  },
  priceCell: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
    width: 70,
    color: '#FFFFFF',
  },
  emptyText: { 
    textAlign: 'center', 
    marginTop: 20, 
    fontSize: 16, 
    color: '#888' 
  },
  addButton: {
    backgroundColor: '#00C853',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalView: {
    width: '80%',
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 20,
    borderWidth: 1,
    borderColor: '#444',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  input: {
    borderWidth: 1,
    borderColor: '#444',
    backgroundColor: '#2C2C2C',
    color: '#FFFFFF',
    borderRadius: 5,
    padding: 10,
    marginBottom: 5,
  },
  inputHelp: {
    fontSize: 12,
    color: '#AAAAAA',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonCancel: {
    backgroundColor: '#2E2E2E',
  },
  buttonAdd: {
    backgroundColor: '#00C853',
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  buttonAddText: {
    color: '#FFFFFF',
  },
});
