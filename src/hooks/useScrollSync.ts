import { useRef, useCallback } from 'react';
import { 
  Animated, 
  NativeSyntheticEvent, 
  NativeScrollEvent, 
  FlatList,
  ScrollView
} from 'react-native';

/**
 * Props for the useScrollSync hook
 */
interface UseScrollSyncProps {
  /**
   * Whether to enable horizontal scrolling
   */
  enableHorizontalScroll?: boolean;
}

/**
 * Custom hook for synchronizing scroll between two lists
 * @param props Hook configuration
 * @returns Object containing refs and handlers for scroll synchronization
 */
export const useScrollSync = <T,>(props?: UseScrollSyncProps) => {
  const { enableHorizontalScroll = true } = props || {};
  
  // Animation values for tracking scroll position
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollX = useRef(new Animated.Value(0)).current;
  
  // Refs for the lists
  const fixedListRef = useRef<FlatList<T>>(null);
  const scrollableListRef = useRef<FlatList<T>>(null);
  const horizontalScrollRef = useRef<ScrollView>(null);
  
  // Track whether lists are currently being scrolled
  const isScrolling = useRef({ fixed: false, scrollable: false });
  
  /**
   * Handle scroll events from the fixed list
   */
  const handleFixedScroll = useCallback(
    Animated.event(
      [{ nativeEvent: { contentOffset: { y: scrollY } } }],
      {
        useNativeDriver: false,
        listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
          if (!isScrolling.current.scrollable) {
            isScrolling.current.fixed = true;
            const offsetY = event.nativeEvent.contentOffset.y;

            scrollableListRef.current?.scrollToOffset({
              offset: offsetY,
              animated: false
            });

            // Use setTimeout instead of requestAnimationFrame for better performance
            setTimeout(() => {
              isScrolling.current.fixed = false;
            }, 0);
          }
        }
      }
    ),
    [scrollY]
  );

  /**
   * Handle scroll events from the scrollable list
   */
  const handleScrollableScroll = useCallback(
    Animated.event(
      [{ nativeEvent: { contentOffset: { y: scrollY } } }],
      {
        useNativeDriver: false,
        listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
          if (!isScrolling.current.fixed) {
            isScrolling.current.scrollable = true;
            const offsetY = event.nativeEvent.contentOffset.y;

            fixedListRef.current?.scrollToOffset({
              offset: offsetY,
              animated: false
            });

            // Use setTimeout instead of requestAnimationFrame for better performance
            setTimeout(() => {
              isScrolling.current.scrollable = false;
            }, 0);
          }
        }
      }
    ),
    [scrollY]
  );

  /**
   * Handle horizontal scroll events
   */
  const handleHorizontalScroll = enableHorizontalScroll
    ? Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: false }
      )
    : undefined;

  return {
    // Animation values
    scrollY,
    scrollX,
    
    // Refs
    fixedListRef,
    scrollableListRef,
    horizontalScrollRef,
    
    // Handlers
    handleFixedScroll,
    handleScrollableScroll,
    handleHorizontalScroll,
  };
};