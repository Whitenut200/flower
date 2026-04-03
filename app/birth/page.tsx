'use client';

import { useState, useEffect } from 'react';
import { getBirthFlower, monthlyBirthFlowers } from '@/data/birthFlowers';
import { BirthFlower } from '@/data/types';

export default function BirthPage() {
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [result, setResult] = useState<BirthFlower | null>(null);

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const daysInMonth = new Date(2024, selectedMonth, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  useEffect(() => {
    const flower = getBirthFlower(selectedMonth, selectedDay);
    setResult(flower);
  }, [selectedMonth, selectedDay]);

  return (
    <div className="px-5 pt-4 pb-8">
      <h1 className="text-2xl font-bold text-gray-800">나의 탄생화는?</h1>
      <p className="text-sm text-gray-400 mt-1">생일을 선택하면 탄생화를 알려드려요</p>

      {/* 월 선택 */}
      <p className="text-sm font-semibold text-gray-500 mt-5 mb-2">월</p>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {months.map((m) => (
          <button
            key={m}
            onClick={() => setSelectedMonth(m)}
            className={`shrink-0 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
              selectedMonth === m
                ? 'bg-[var(--pink)] text-white font-bold'
                : 'bg-white text-gray-700 shadow-sm'
            }`}
          >
            {m}월
          </button>
        ))}
      </div>

      {/* 일 선택 */}
      <p className="text-sm font-semibold text-gray-500 mt-4 mb-2">일</p>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {days.map((d) => (
          <button
            key={d}
            onClick={() => setSelectedDay(d)}
            className={`shrink-0 w-10 h-10 rounded-full text-sm font-medium transition-all ${
              selectedDay === d
                ? 'bg-[var(--pink)] text-white font-bold'
                : 'bg-white text-gray-700 shadow-sm'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* 결과 */}
      {result && (
        <div className="mt-6 bg-white rounded-2xl p-8 text-center shadow-md">
          <span className="text-6xl">{result.image}</span>
          <p className="text-sm text-gray-400 mt-4">
            {result.month}월 {result.day > 0 ? `${result.day}일` : ''} 탄생화
          </p>
          <h2 className="text-2xl font-bold text-gray-800 mt-1">{result.flower}</h2>
          <p className="text-base text-[var(--pink)] font-semibold mt-2">
            꽃말: {result.meaning}
          </p>
        </div>
      )}

      {/* 월별 대표 탄생화 */}
      <h2 className="text-lg font-bold text-gray-800 mt-8 mb-4">월별 대표 탄생화</h2>
      {monthlyBirthFlowers.map((bf) => (
        <div
          key={bf.month}
          className="flex items-center bg-white rounded-xl p-3.5 mb-2"
        >
          <span className="text-2xl mr-3">{bf.image}</span>
          <div className="flex-1">
            <p className="text-xs text-gray-400">{bf.month}월</p>
            <p className="text-sm font-semibold text-gray-800">{bf.flower}</p>
          </div>
          <p className="text-xs text-[var(--pink)]">{bf.meaning}</p>
        </div>
      ))}
    </div>
  );
}
