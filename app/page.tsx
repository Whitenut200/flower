'use client';

import { useState } from 'react';
import { flowers, plants, occasions } from '@/data/flowers';

export default function Home() {
  const [selected, setSelected] = useState<string | null>(null);
  const filtered = selected
    ? flowers.filter((f) => f.occasions.includes(selected))
    : [];
  const filteredPlants = selected
    ? plants.filter((p) => p.occasions.includes(selected))
    : [];

  const selectedOccasion = occasions.find((o) => o.label === selected);

  return (
    <div className="px-5 pt-4 pb-8">
      <h1 className="text-2xl font-bold text-gray-800">
        어떤 마음을 전하고 싶으세요?
      </h1>
      <p className="text-sm text-gray-400 mt-1">상황에 맞는 꽃을 추천해드릴게요</p>

      {/* 목적 선택 칩 */}
      <div className="grid grid-cols-4 gap-2 mt-5">
        {occasions.map((occ) => (
          <button
            key={occ.id}
            onClick={() => setSelected(selected === occ.label ? null : occ.label)}
            className={`px-3 py-2.5 rounded-full text-sm font-semibold transition-all ${
              selected === occ.label
                ? 'bg-[var(--pink)] text-white shadow-md'
                : 'bg-white text-gray-700 shadow-sm hover:shadow-md'
            }`}
          >
            {occ.label}
          </button>
        ))}
      </div>

      {/* 선택된 목적 설명 */}
      {selectedOccasion && (
        <div className="mt-3 bg-white rounded-xl py-2.5 px-4 text-center">
          <p className="text-sm text-gray-400">{selectedOccasion.description}</p>
        </div>
      )}

      {/* 꽃 목록 */}
      {selected ? (
        <div className="mt-5">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            &apos;{selected}&apos; 에 어울리는 꽃
          </h2>
          {filtered.map((flower) => (
            <div
              key={flower.id}
              className="flex bg-white rounded-2xl p-4 mb-3 shadow-sm"
            >
              <span className="text-4xl mr-4 mt-1">{flower.image}</span>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">{flower.name}</h3>
                <p className="text-sm text-[var(--pink)] font-semibold mt-0.5">
                  꽃말: {flower.meaning}
                </p>
                <p className="text-xs text-gray-500 mt-1.5 leading-5">
                  {flower.description}
                </p>
                <div className="flex gap-1.5 mt-2">
                  {flower.season.map((s) => (
                    <span
                      key={s}
                      className="text-xs text-[var(--pink)] bg-[var(--pink-bg)] px-2.5 py-1 rounded-full"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* 화초 섹션 */}
          {filteredPlants.length > 0 && (
            <>
              <div className="flex items-center gap-3 mt-8 mb-4">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-sm font-semibold text-gray-400">선물용 화초</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              {filteredPlants.map((plant) => (
                <div
                  key={plant.id}
                  className="flex bg-white rounded-2xl p-4 mb-3 shadow-sm"
                >
                  <span className="text-4xl mr-4 mt-1">{plant.image}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{plant.name}</h3>
                    <p className="text-sm text-green-600 font-semibold mt-0.5">
                      의미: {plant.meaning}
                    </p>
                    <p className="text-xs text-gray-500 mt-1.5 leading-5">
                      {plant.description}
                    </p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      ) : (
        <div className="mt-20 text-center text-gray-300">
          위에서 상황을 선택해보세요
        </div>
      )}
    </div>
  );
}
