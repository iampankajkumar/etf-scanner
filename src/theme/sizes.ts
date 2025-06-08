import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const sizes = {
  // global sizes
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,

  // font sizes
  h1: 30,
  h2: 22,
  h3: 16,
  title: 18,
  body: 14,
  caption: 12,

  // app dimensions
  width,
  height,
};