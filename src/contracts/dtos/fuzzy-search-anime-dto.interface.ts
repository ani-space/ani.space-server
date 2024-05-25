export class AnimeByFuzzySearch {
  englishMatchingScore: number;

  romajiMatchingScore: number;

  nativeMatchingScore: number;

  userPreferredMatchingScore: number;

  maxScore: number;

  idAnilist: number;

  id: string;

  constructor(partial: Partial<AnimeByFuzzySearch>) {
    Object.assign(this, partial);
  }
}
