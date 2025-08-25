"use client";

import VantaNet from '@/components/VantaNet';

export default function VantaTestPage() {
  return (
    <VantaNet className="fixed inset-0 -z-10">
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-black/20 backdrop-blur-sm rounded-lg border border-white/10">
          <h1 className="text-5xl font-bold mb-4 text-white drop-shadow-lg">
            Vanta NET Effect
          </h1>
          <p className="text-xl text-white/90 drop-shadow mb-8">
            Interactive network animation background for Next.js
          </p>
          <div className="space-y-4 text-white/80">
            <p>✓ Responsive to mouse movement</p>
            <p>✓ Touch controls for mobile</p>
            <p>✓ Theme-aware colors</p>
            <p>✓ Proper Next.js integration</p>
            <p>✓ TypeScript support</p>
            <p>✓ Error handling & fallbacks</p>
          </div>
          <div className="mt-8">
            <p className="text-sm text-white/60">
              Check browser console for debug information
            </p>
          </div>
        </div>
      </div>
    </VantaNet>
  );
}
