export interface Flower {
  id: string;
  name: string;
  nameEn: string;
  meaning: string; // 꽃말
  season: string[];
  color: string[];
  occasions: string[]; // 축하, 고백, 감사, 위로 등
  description: string;
  image: string; // emoji for MVP, later real images
}

export interface BirthFlower {
  month: number;
  day: number;
  flower: string;
  meaning: string;
  image: string;
}

export type Occasion = '축하' | '고백' | '감사' | '위로' | '응원' | '축하(개업)' | '추모';
