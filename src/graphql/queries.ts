// tslint:disable
// eslint-disable
// this is an auto generated file. This will be overwritten

export const getSuggestion = /* GraphQL */ `
  query GetSuggestion($id: ID!) {
    getSuggestion(id: $id) {
      id
      description
      episodeNumber
      timestamp
    }
  }
`;
export const listSuggestions = /* GraphQL */ `
  query ListSuggestions(
    $filter: ModelSuggestionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSuggestions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        description
        episodeNumber
        timestamp
      }
      nextToken
    }
  }
`;
