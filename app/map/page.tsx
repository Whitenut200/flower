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
  distance: string;
}

const KAKAO_JS_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY || '';

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [shops, setShops] = useState<FlowerShop[]>([]);
  const [selectedShop, setSelectedShop] = useState<FlowerShop | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const kakaoMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // 카카오맵 SDK 로드
  useEffect(() => {
    if (!KAKAO_JS_KEY) {
      setMapError('카카오 JavaScript 키가 설정되지 않았습니다');
      setLoading(false);
      return;
    }

    if (window.kakao?.maps?.services) {
      setMapLoaded(true);
      return;
    }

    // 이전에 services 없이 로드된 경우 기존 스크립트 제거
    const oldScript = document.querySelector('script[src*="dapi.kakao.com"]');
    if (oldScript) oldScript.remove();

    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JS_KEY}&libraries=services&autoload=false`;
    script.onload = () => {
      window.kakao.maps.load(() => {
        console.log('카카오맵 로드 완료, services:', !!window.kakao.maps.services);
        setMapLoaded(true);
      });
    };
    script.onerror = () => {
      setMapError('카카오맵 로드 실패 — 개발자 콘솔에서 사이트 도메인을 확인해주세요');
      setLoading(false);
    };
    document.head.appendChild(script);
  }, []);

  // 기존 마커 제거
  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
  }, []);

  const searchFlowerShops = useCallback(async (lat: number, lng: number) => {
    setLoading(true);
    clearMarkers();
    try {
      const res = await fetch(
        `/api/flower-shops?lat=${lat}&lng=${lng}`
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
          distance: doc.distance,
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
            markersRef.current.push(marker);
          });
        }
      }
    } catch (err) {
      console.log('꽃집 검색 오류:', err);
    } finally {
      setLoading(false);
    }
  }, [clearMarkers]);

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

  // 장소 검색 → 해당 위치로 이동 후 꽃집 검색
  const handlePlaceSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !mapLoaded) return;

    const geocoder = new window.kakao.maps.services.Geocoder();
    const places = new window.kakao.maps.services.Places();

    // 먼저 키워드로 장소 검색
    places.keywordSearch(searchQuery, (result: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK && result.length > 0) {
        const lat = parseFloat(result[0].y);
        const lng = parseFloat(result[0].x);
        const moveLatLng = new window.kakao.maps.LatLng(lat, lng);
        kakaoMapRef.current.setCenter(moveLatLng);
        searchFlowerShops(lat, lng);
        setSearchQuery('');
      } else {
        // 키워드 실패 시 주소로 검색
        geocoder.addressSearch(searchQuery, (result: any, status: any) => {
          if (status === window.kakao.maps.services.Status.OK && result.length > 0) {
            const lat = parseFloat(result[0].y);
            const lng = parseFloat(result[0].x);
            const moveLatLng = new window.kakao.maps.LatLng(lat, lng);
            kakaoMapRef.current.setCenter(moveLatLng);
            searchFlowerShops(lat, lng);
            setSearchQuery('');
          }
        });
      }
    });
  };

  // 거리 포맷
  const formatDistance = (m: string) => {
    const meters = parseInt(m);
    if (meters >= 1000) return `${(meters / 1000).toFixed(1)}km`;
    return `${meters}m`;
  };

  return (
    <div className="relative" style={{ height: 'calc(100vh - 80px)' }}>
      <div ref={mapRef} className="w-full h-full" />

      {/* 장소 검색 */}
      <form
        onSubmit={handlePlaceSearch}
        className="absolute top-4 left-4 right-4 z-10 flex gap-2"
      >
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="지역, 주소 검색 (예: 강남역, 홍대)"
          className="flex-1 px-4 py-2.5 rounded-full shadow-lg text-sm bg-white outline-none focus:ring-2 focus:ring-[var(--pink)]"
        />
        <button
          type="submit"
          className="px-5 py-2.5 rounded-full shadow-lg text-sm font-semibold bg-[var(--pink)] text-white hover:shadow-xl transition-shadow"
        >
          검색
        </button>
      </form>

      {/* 이 지역에서 검색 */}
      <button
        onClick={handleSearchHere}
        className="absolute top-16 left-1/2 -translate-x-1/2 bg-white px-5 py-2.5 rounded-full shadow-lg text-sm font-semibold text-[var(--pink)] z-10 hover:shadow-xl transition-shadow"
      >
        이 지역에서 꽃집 검색
      </button>

      {loading && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 text-sm text-[var(--pink)] z-10">
          검색 중...
        </div>
      )}

      {mapError && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-sm text-red-500 z-10 bg-white p-4 rounded-xl shadow">
          {mapError}
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
          <div className="flex items-baseline gap-2">
            <h3 className="font-bold text-lg text-gray-800">{selectedShop.name}</h3>
            <span className="text-xs text-[var(--pink)] font-semibold">{formatDistance(selectedShop.distance)}</span>
          </div>
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
