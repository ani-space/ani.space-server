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
