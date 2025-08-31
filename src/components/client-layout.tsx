'use client';

import { MatrixBackground } from './matrix-background';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <MatrixBackground />
      <div className="relative" style={{ zIndex: 10 }}>
        {children}
      </div>
    </div>
  );
}