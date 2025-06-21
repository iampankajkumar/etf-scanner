import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text } from './atoms/Text';
import { colors } from '../theme/colors';
import { useLivePrice } from '../hooks/useLivePrice';
import { livePriceService } from '../services/livePriceService';

/**
 * Debug component for Live Price Service in React Native
 */
export const LivePriceDebug: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  
  const {
    livePrices,
    isLoading,
    error,
    lastUpdated,
    refreshLivePrices,
    getLivePriceForSymbol,
    clearError,
  } = useLivePrice();

  const runDebugTest = async () => {
    setIsRunning(true);
    setDebugInfo('🔍 Starting React Native Live Price Debug...\n\n');
    
    try {
      // Test 1: Service availability
      setDebugInfo(prev => prev + '🧪 Test 1: Service Availability\n');
      const isAvailable = await livePriceService.isServiceAvailable();
      setDebugInfo(prev => prev + `${isAvailable ? '✅' : '❌'} Service Available: ${isAvailable}\n\n`);
      
      if (!isAvailable) {
        setDebugInfo(prev => prev + '❌ Service unavailable, stopping tests\n');
        return;
      }
      
      // Test 2: Fetch data
      setDebugInfo(prev => prev + '🧪 Test 2: Fetch Live Prices\n');
      const startTime = Date.now();
      
      try {
        await refreshLivePrices();
        const endTime = Date.now();
        
        setDebugInfo(prev => prev + `✅ Fetch successful in ${endTime - startTime}ms\n`);
        setDebugInfo(prev => prev + `📊 Symbols loaded: ${livePrices.size}\n`);
        
        if (livePrices.size > 0) {
          const firstSymbol = Array.from(livePrices.keys())[0];
          const firstData = livePrices.get(firstSymbol);
          setDebugInfo(prev => prev + `🔍 Sample: ${firstSymbol} = ${firstData?.livePrice} (${firstData?.changePercent})\n`);
        }
        
      } catch (fetchError) {
        setDebugInfo(prev => prev + `❌ Fetch failed: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}\n`);
      }
      
      setDebugInfo(prev => prev + '\n🏁 Debug complete!\n');
      
    } catch (error) {
      setDebugInfo(prev => prev + `💥 Debug failed: ${error instanceof Error ? error.message : 'Unknown error'}\n`);
    } finally {
      setIsRunning(false);
    }
  };

  const showCurrentStatus = () => {
    const statusInfo = `
Live Prices: ${livePrices.size} symbols
Loading: ${isLoading}
Error: ${error || 'None'}
Last Updated: ${lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Never'}
Note: /api/prices is called on every refresh (no caching)
    `.trim();
    
    Alert.alert('Current Status', statusInfo);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Live Price Debug</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, isRunning && styles.buttonDisabled]} 
          onPress={runDebugTest}
          disabled={isRunning}
        >
          <Text style={styles.buttonText}>
            {isRunning ? 'Running...' : 'Run Debug Test'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={showCurrentStatus}>
          <Text style={styles.buttonText}>Show Status</Text>
        </TouchableOpacity>
        
        {error && (
          <TouchableOpacity style={[styles.button, styles.errorButton]} onPress={clearError}>
            <Text style={styles.buttonText}>Clear Error</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      )}
      
      <ScrollView style={styles.debugOutput}>
        <Text style={styles.debugText}>{debugInfo || 'No debug info yet. Run debug test to see results.'}</Text>
      </ScrollView>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: colors.text,
    textAlign: 'center' as const,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    justifyContent: 'space-around' as const,
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    margin: 4,
  },
  buttonDisabled: {
    backgroundColor: colors.textSecondary,
  },
  errorButton: {
    backgroundColor: colors.error,
  },
  buttonText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  errorContainer: {
    backgroundColor: colors.error + '20',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
  },
  debugOutput: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 12,
  },
  debugText: {
    color: colors.text,
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 18,
  },
};