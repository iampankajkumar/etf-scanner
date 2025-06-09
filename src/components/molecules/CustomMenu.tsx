import React from 'react';
import { View, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Text } from '../atoms/Text';
import { colors } from '../../theme/colors';
import { sizes } from '../../theme/sizes';

interface MenuItemProps {
  onPress: () => void;
  title: string;
}

interface CustomMenuProps {
  visible: boolean;
  onDismiss: () => void;
  items: Array<{
    title: string;
    onPress: () => void;
  }>;
}

export const CustomMenu = ({ visible, onDismiss, items }: CustomMenuProps): React.JSX.Element => {
  if (!visible) return <></>;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onDismiss}
      >
        <View style={styles.menuContainer}>
          {items.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => {
                item.onPress();
                onDismiss();
              }}
            >
              <Text style={styles.menuText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  menuContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: sizes.radius,
    borderTopRightRadius: sizes.radius,
    paddingVertical: sizes.base,
    marginHorizontal: sizes.base,
    marginBottom: sizes.base,
  },
  menuItem: {
    paddingVertical: sizes.base * 1.5,
    paddingHorizontal: sizes.base * 2,
  },
  menuText: {
    fontSize: sizes.body,
    color: colors.text,
  },
});
