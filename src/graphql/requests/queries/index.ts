export const getCharacterList = `
  characters {
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
    }
`;

export const getStaffList = `
  staff {
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
