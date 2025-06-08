import { useRef, useCallback, RefObject } from 'react';
import { NativeSyntheticEvent, NativeScrollEvent, ScrollView } from 'react-native';

export function useScrollSync(refs: RefObject<ScrollView>[]) {
  const isSyncing = useRef(false);

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (isSyncing.current) {
        isSyncing.current = false; // Reset and ignore this event
        return;
      }

      isSyncing.current = true;
      const { x } = event.nativeEvent.contentOffset;

      for (const ref of refs) {
        if (ref.current) {
          ref.current.scrollTo({ x, animated: false });
        }
      }
    },
    [refs]
  );

  return { onScroll };
}