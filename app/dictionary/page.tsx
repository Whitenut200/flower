'use client';

import { useState } from 'react';
import { flowers } from '@/data/flowers';

export default function DictionaryPage() {
  const [search, setSearch] = useState('');

  const filtered = flowers.filter(
    (f) =>
      f.name.includes(search) ||
      f.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      f.meaning.includes(search)
  );

  return (
    <div className="px-5 pt-4 pb-8">
      <h1 className="text-2xl font-bold text-gray-800">꽃말 도감</h1>
      <p className="text-sm text-gray-400 mt-1">꽃 이름이나 꽃말로 검색해보세요</p>

      {/* 검색 */}
      <input
        type="text"
        placeholder="꽃 이름 또는 꽃말 검색..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mt-4 px-4 py-3.5 bg-white rounded-xl text-sm shadow-sm outline-none focus:ring-2 focus:ring-[var(--pink)] placeholder-gray-300"
      />

      {/* 꽃 목록 */}
      <div className="mt-5">
        {filtered.length > 0 ? (
          filtered.map((flower) => (
            <div
              key={flower.id}
              className="bg-white rounded-2xl mb-3.5 shadow-sm overflow-hidden"
            >
              <div className="flex items-center p-4 pb-3 border-b border-gray-50">
                <span className="text-3xl mr-3">{flower.image}</span>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{flower.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{flower.nameEn}</p>
                </div>
              </div>
              <div className="p-4 pt-3">
                <div className="flex mb-1.5">
                  <span className="text-xs text-gray-400 font-semibold w-10">꽃말</span>
                  <span className="text-xs text-[var(--pink)] font-semibold">{flower.meaning}</span>
                </div>
                <div className="flex mb-1.5">
                  <span className="text-xs text-gray-400 font-semibold w-10">계절</span>
                  <span className="text-xs text-[var(--pink)] font-semibold">{flower.season.join(', ')}</span>
                </div>
                <div className="flex mb-1.5">
                  <span className="text-xs text-gray-400 font-semibold w-10">색상</span>
                  <span className="text-xs text-[var(--pink)] font-semibold">{flower.color.join(', ')}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2 leading-5">{flower.description}</p>
                <div className="flex gap-1.5 mt-2.5">
                  {flower.occasions.map((occ) => (
                    <span
                      key={occ}
                      className="text-xs text-[var(--pink)] bg-[var(--pink-bg)] px-2.5 py-1 rounded-full"
                    >
                      {occ}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-300 mt-16">검색 결과가 없어요</div>
        )}
      </div>
    </div>
  );
}
