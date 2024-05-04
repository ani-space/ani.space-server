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
