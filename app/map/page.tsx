'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface FlowerShop {
  id: string;
  name: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  url: string;
}

const KAKAO_REST_KEY = 'bffb96920e389d2640a20bb8e5ed8981';
const KAKAO_JS_KEY = 'bffb96920e389d2640a20bb8e5ed8981';

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [shops, setShops] = useState<FlowerShop[]>([]);
  const [selectedShop, setSelectedShop] = useState<FlowerShop | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const kakaoMapRef = useRef<any>(null);

  // 카카오맵 SDK 로드
  useEffect(() => {
    if (window.kakao?.maps) {
      setMapLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_KEY}&autoload=false`;
    script.onload = () => {
      window.kakao.maps.load(() => {
        setMapLoaded(true);
      });
    };
    document.head.appendChild(script);
  }, []);

  const searchFlowerShops = useCallback(async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://dapi.kakao.com/v2/local/search/keyword.json?query=꽃집&y=${lat}&x=${lng}&radius=3000&size=15&sort=distance`,
        { headers: { Authorization: `KakaoAK ${KAKAO_REST_KEY}` } }
      );
      const data = await res.json();
      if (data.documents) {
        const parsed: FlowerShop[] = data.documents.map((doc: any) => ({
          id: doc.id,
          name: doc.place_name,
          address: doc.road_address_name || doc.address_name,
          phone: doc.phone || '전화번호 없음',
          lat: parseFloat(doc.y),
          lng: parseFloat(doc.x),
          url: doc.place_url,
        }));
        setShops(parsed);

        // 마커 표시
        if (kakaoMapRef.current) {
          const map = kakaoMapRef.current;
          parsed.forEach((shop) => {
            const marker = new window.kakao.maps.Marker({
              map,
              position: new window.kakao.maps.LatLng(shop.lat, shop.lng),
              title: shop.name,
            });
            window.kakao.maps.event.addListener(marker, 'click', () => {
              setSelectedShop(shop);
            });
          });
        }
      }
    } catch (err) {
      console.log('꽃집 검색 오류:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 지도 초기화
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    const initMap = (lat: number, lng: number) => {
      const options = {
        center: new window.kakao.maps.LatLng(lat, lng),
        level: 5,
      };
      const map = new window.kakao.maps.Map(mapRef.current, options);
      kakaoMapRef.current = map;
      searchFlowerShops(lat, lng);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => initMap(pos.coords.latitude, pos.coords.longitude),
        () => initMap(37.5665, 126.978) // 서울
      );
    } else {
      initMap(37.5665, 126.978);
    }
  }, [mapLoaded, searchFlowerShops]);

  const handleSearchHere = () => {
    if (!kakaoMapRef.current) return;
    const center = kakaoMapRef.current.getCenter();
    searchFlowerShops(center.getLat(), center.getLng());
  };

  return (
    <div className="relative" style={{ height: 'calc(100vh - 80px)' }}>
      <div ref={mapRef} className="w-full h-full" />

      {/* 이 지역에서 검색 */}
      <button
        onClick={handleSearchHere}
        className="absolute top-4 left-1/2 -translate-x-1/2 bg-white px-5 py-2.5 rounded-full shadow-lg text-sm font-semibold text-[var(--pink)] z-10 hover:shadow-xl transition-shadow"
      >
        이 지역에서 검색
      </button>

      {loading && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 text-sm text-[var(--pink)] z-10">
          검색 중...
        </div>
      )}

      {/* 선택된 꽃집 */}
      {selectedShop && (
        <div className="absolute bottom-6 left-4 right-4 bg-white rounded-2xl p-5 shadow-xl z-10">
          <button
            onClick={() => setSelectedShop(null)}
            className="absolute top-3 right-4 text-gray-400 text-lg"
          >
            ✕
          </button>
          <h3 className="font-bold text-lg text-gray-800">{selectedShop.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{selectedShop.address}</p>
          <p className="text-sm text-gray-400 mt-0.5">{selectedShop.phone}</p>
          <div className="flex gap-2.5 mt-4">
            {selectedShop.phone !== '전화번호 없음' && (
              <a
                href={`tel:${selectedShop.phone}`}
                className="flex-1 py-3 rounded-xl bg-gray-100 text-center text-sm font-semibold text-gray-600"
              >
                전화하기
              </a>
            )}
            <a
              href={selectedShop.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 rounded-xl bg-[var(--pink)] text-center text-sm font-semibold text-white"
            >
              상세보기
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
