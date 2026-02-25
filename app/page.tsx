'use client';

import dynamic from 'next/dynamic';

const GlobeComponent = dynamic(() => import('@/app/components/GlobeComponent'), {
  ssr: false,
  loading: () => (
    <div className="flex w-full h-full items-center justify-center bg-[var(--background)]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex h-16 w-16">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-slate-200 dark:border-slate-800 opacity-20"></div>
        </div>
        <p className="text-slate-500 font-medium animate-pulse">Initializing IPFS Network Map...</p>
      </div>
    </div>
  )
});

export default function Home() {
  return (
    <div className="relative w-full h-full bg-[var(--background)]">
      {/* Overlay UI elements can go here */}
      <div className="absolute top-8 left-8 z-10 pointer-events-none">
        <h1 className="text-4xl font-black tracking-tighter text-slate-800 dark:text-white drop-shadow-sm">Global Network</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 max-w-sm drop-shadow-sm">
          Real-time visualization of IPFS data transfers and node topography.
        </p>
      </div>

      {/* 3D Canvas Container */}
      <div className="w-full h-full absolute inset-0">
        <GlobeComponent />
      </div>
    </div>
  );
}
