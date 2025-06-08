import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { styles } from '../styles/appStyles';

export function AddSymbolModal({ visible, onClose, onAdd }) {
  const [newSymbol, setNewSymbol] = useState('');

  const handleAdd = () => {
    if (!newSymbol.trim()) {
      Alert.alert('Error', 'Please enter a valid symbol');
      return;
    }
    onAdd(newSymbol);
    setNewSymbol('');
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Add New Symbol</Text>
          <TextInput
            style={styles.input}
            value={newSymbol}
            onChangeText={setNewSymbol}
            placeholder="Enter symbol (e.g., RELIANCE)"
            placeholderTextColor="#888"
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
                onClose();
              }}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonAdd]}
              onPress={handleAdd}
            >
              <Text style={[styles.buttonText, styles.buttonAddText]}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}