export const characterFields = `
  id
  name {
    first
    middle
    last
    full
    native
    alternative
    alternativeSpoiler
    userPreferred
  }
  image {
    large
    medium
  }
  description
  gender
  dateOfBirth {
    year
    month
    day
  }
  age
  bloodType
`;

export const getCharacterList = `
  characters {
      ${characterFields}
    }
`;

export const staffFields = `
  id
  name {
    first
    middle
    last
    full
    native
    alternative
    userPreferred
  }
  languageV2
  image {
    large
    medium
  }
  description(asHtml: true)
  primaryOccupations
  gender
  dateOfBirth {
    year
    month
    day
  }
  dateOfDeath {
    year
    month
    day
  }
  age
  yearsActive
  homeTown
  bloodType
`;

export const getStaffList = `
  staff {
    ${staffFields}
  }
`;

export const getAnime = `
  id
  idMal
  title {
    romaji
    english
    native
    userPreferred
  }
  tags {
    id
    name
    description
    category
    rank
    isGeneralSpoiler
    isMediaSpoiler
    isAdult
  }
  genres
  synonyms
  format
  status
  description
  startDate {
    year
    month
    day
  }
  endDate {
    year
    month
    day
  }
  season
  seasonYear
  seasonInt
  episodes
  duration
  countryOfOrigin
  isLicensed
  source
  hashtag
  trailer {
    id
    site
    thumbnail
  }
  coverImage {
    extraLarge
    large
    medium
    color
  }
  bannerImage
  averageScore
  meanScore
  popularity
  isAdult
`;

export const animeConnection = `
  edges {
    node {
      id
      type
    }
    id
    relationType(version: 2)
    isMainStudio
    characters {
      id
    }
    characterRole
    characterName
    roleNotes
    dubGroup
    staffRole
    voiceActors {
      id
    }
    voiceActorRoles {
      roleNotes
      dubGroup
      voiceActor {
        id
      }
    }
  }
  nodes {
    id
    type
  }
  pageInfo {
    hasNextPage
  }
`;

export const characterConnection = `
  pageInfo {
    hasNextPage
  }
  edges {
    node {
      id
    }
    id
    role
    name
    voiceActors {
      id
    }
    voiceActorRoles {
      voiceActor {
        id
      }
      roleNotes
      dubGroup
    }
    media {
      id
    }
  }
  nodes {
    id
  }
`;
