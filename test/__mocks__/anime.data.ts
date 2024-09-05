import {
  AnimeFormat,
  AnimeSeason,
  AnimeSource,
  AnimeStatus,
} from '~/models/sub-models/anime-sub-models';

export const animeListDto = [
  {
    id: '000103f8-7338-4e6b-8227-b73a0ef59ef8',
    createdAt: new Date('2024-04-30 14:04:28.284621'),
    updatedAt: new Date('2024-06-01 22:21:07.80208'),
    idAnilist: 1985,
    idMal: 1985,
    format: 'TV' as AnimeFormat,
    status: 'FINISHED' as AnimeStatus,
    season: 'FALL' as AnimeSeason,
    seasonYear: 1975,
    seasonInt: 754,
    episodes: 74,
    duration: 25,
    countryOfOrigin: 'JP',
    isLicensed: true,
    source: 'MANGA' as AnimeSource,
    hashtag: undefined,
    updateAt: undefined,
    bannerImage:
      'https://s4.anilist.co/file/anilistcdn/media/anime/banner/1985-kyrtocnMQsvE.jpg',
    averageScore: 69,
    meanScore: 71,
    popularity: 2863,
    isAdult: false,
    startDateId: '529140a6-3cf0-4073-9c20-5c62c7472b33',
    endDateId: 'f03687d6-bd3a-458b-abb4-90f2e7950054',
    titleId: '08b3728b-ac1a-4749-9d3a-5559d4355f54',
    descriptionId: 'd211ea5c-875c-44ac-beed-dbe020e3ccd7',
    trailerId: undefined,
    coverImageId: 'f9e3caca-d651-409b-80ab-d0e2d75010d2',
    relationsId: 'd12bfa9d-107f-4d6b-9693-d15e882507ac',
    charactersId: '9c420663-13be-4e88-827e-daa2ece46b22',
    staffId: '6f9801e8-6627-44ee-8a99-820018581a8e',
    studiosId: '97ecfa21-cfb4-497c-9d78-ad74c2b3c8cb',
    nextAiringEpisodeId: undefined,
    airingScheduleId: undefined,
    trendsId: undefined,
  },
];

export const animeConnectionListDto = [
  {
    id: '81e77de8-dd31-49f3-889c-fef8b067b524',
    nodes: [
      {
        id: '0147c571-4b14-49e7-8ce9-9fdf35083c59',
        isAdult: false,
        isLicensed: true,
        averageScore: 66,
        description: {
          english:
            "The story takes place five decades from now, when brain scanners have been perfected to the point that the government can retrieve up to five years' worth of memories from people's minds — even if they are dead. The investigators of the National Research Institute of Police Science's 9th Forensics Laboratory must weigh the ethical choices in the ultimate invasion of privacy as they delve into people's minds to solve crimes.<br><br>\n(Source: Anime News Network)",
          updatedAt: '2024-04-30T07:08:35.350Z',
          vietnamese: null,
          vietnameseAIGenerate: null,
        },
        format: 'TV',
        genres: [
          {
            genre: 'Mystery',
            description: null,
          },
          {
            genre: 'Sci-Fi',
            description: null,
          },
          {
            genre: 'Psychological',
            description: null,
          },
        ],
        hashtag: null,
        endDate: {
          day: 1,
          month: 10,
          year: 2008,
        },
        bannerImage:
          'https://s4.anilist.co/file/anilistcdn/media/anime/banner/n3859-NAmumvkGBCts.jpg',
        countryOfOrigin: 'JP',
        createdAt: '2024-04-30T07:08:35.417Z',
        duration: 22,
      },
    ],
    edges: [
      {
        characterName: null,
        characterRole: null,
        dubGroup: null,
        favouriteOrder: null,
        idAnilist: 31,
        isMainStudio: false,
        relationType: null,
        roleNotes: null,
        staffRole: null,
      },
    ],
  },
];
