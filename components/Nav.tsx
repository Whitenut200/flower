'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/', label: '꽃 추천', icon: '🎁' },
  { href: '/birth', label: '탄생화', icon: '📅' },
  { href: '/dictionary', label: '꽃말 도감', icon: '📖' },
  { href: '/map', label: '주변 꽃집', icon: '🗺️' },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50">
      <div className="max-w-lg mx-auto flex">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex-1 flex flex-col items-center py-3 text-xs transition-colors ${
                active ? 'text-[var(--pink)] font-bold' : 'text-gray-400'
              }`}
            >
              <span className="text-lg mb-0.5">{tab.icon}</span>
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
