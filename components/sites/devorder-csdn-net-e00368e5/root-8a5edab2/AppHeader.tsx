import Image from 'next/image';

export function AppHeader() {
  return (
    <header className="site-header">
      <div className="brand-pair" aria-label="CSDN 与序动科技">
        <Image width={100} height={55} unoptimized className="csdn-logo" src="/brand/csdn-official.png" alt="CSDN" />
        <span className="brand-divider" aria-hidden="true" />
        <div className="xudong-wordmark" aria-label="序动科技">序动科技</div>
      </div>
      
    </header>
  );
}
