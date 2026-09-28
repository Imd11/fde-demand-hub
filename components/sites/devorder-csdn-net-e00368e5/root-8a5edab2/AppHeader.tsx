import Image from 'next/image';
import type { ReactNode } from 'react';

export function AppHeader({ children }: { children?: ReactNode }) {
  return (
    <header className="site-header">
      <div className="brand-pair" aria-label="CSDN 与序动科技">
        <Image width={100} height={55} unoptimized className="csdn-logo" src="/brand/csdn-official.png" alt="CSDN" />
        <span className="brand-divider" aria-hidden="true" />
        <div className="xudong-logo-lockup" aria-label="序动科技">
          <Image width={72} height={36} unoptimized className="xudong-cloud-symbol" src="/brand/cloud-motion-19.png" alt="" />
          <span className="xudong-wordmark">序动科技</span>
        </div>
      </div>
      {children}
    </header>
  );
}
