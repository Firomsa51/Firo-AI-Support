import { useEffect, useRef, useState } from 'react';

export default function usePullToRefresh(onRefresh, threshold = 72) {
  const containerRef = useRef(null);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const pulling = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onTouchStart = (e) => {
      if (el.scrollTop > 0) return;
      startY.current = e.touches[0].clientY;
      pulling.current = true;
    };
    const onTouchMove = (e) => {
      if (!pulling.current) return;
      const delta = e.touches[0].clientY - startY.current;
      if (delta > 0 && el.scrollTop === 0) {
        e.preventDefault();
        setPullDistance(Math.min(delta * 0.5, threshold + 20));
      } else {
        pulling.current = false;
        setPullDistance(0);
      }
    };
    const onTouchEnd = async () => {
      if (!pulling.current) return;
      pulling.current = false;
      if (pullDistance >= threshold) {
        setRefreshing(true);
        setPullDistance(threshold);
        await onRefresh();
        setRefreshing(false);
      }
      setPullDistance(0);
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd);
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [onRefresh, pullDistance, threshold]);

  return { containerRef, pullDistance, refreshing };
}