import { useRef, useCallback } from 'react';
import { findNodeHandle } from 'react-native';

export function useScrollSync(refs) {
  const isSyncing = useRef(false);
  const nodeHandles = useRef([]);

  const onScroll = useCallback(
    (event) => {
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