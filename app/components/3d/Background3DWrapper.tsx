'use client';

import dynamic from 'next/dynamic';
import { Suspense, memo, useMemo } from 'react';

const RealisticMountainScene = dynamic(() => import('./RealisticMountain'), {
  ssr: false,
  loading: () => null,
});

// Memoize wrapper untuk mencegah re-render - STABIL
const Background3DWrapper = memo(function Background3DWrapper() {
  return (
    <Suspense fallback={null}>
      <RealisticMountainScene />
    </Suspense>
  );
}, (prevProps, nextProps) => {
  // Selalu return true untuk mencegah re-render
  return true;
});

export default Background3DWrapper;

