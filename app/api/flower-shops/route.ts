import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return Response.json({ error: '위치 정보가 필요합니다' }, { status: 400 });
  }

  const KAKAO_REST_KEY = process.env.KAKAO_REST_KEY;
  if (!KAKAO_REST_KEY) {
    return Response.json({ error: 'API 키가 설정되지 않았습니다' }, { status: 500 });
  }

  const res = await fetch(
    `https://dapi.kakao.com/v2/local/search/keyword.json?query=꽃집&y=${lat}&x=${lng}&radius=3000&size=15&sort=distance`,
    { headers: { Authorization: `KakaoAK ${KAKAO_REST_KEY}` } }
  );

  const data = await res.json();
  return Response.json(data);
}
