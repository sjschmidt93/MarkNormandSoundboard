/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateSuggestionInput = {
  id?: string | null,
  description?: string | null,
  episodeNumber?: string | null,
  timestamp?: string | null,
};

export type ModelSuggestionConditionInput = {
  description?: ModelStringInput | null,
  episodeNumber?: ModelStringInput | null,
  timestamp?: ModelStringInput | null,
  and?: Array< ModelSuggestionConditionInput | null > | null,
  or?: Array< ModelSuggestionConditionInput | null > | null,
  not?: ModelSuggestionConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type UpdateSuggestionInput = {
  id: string,
  description?: string | null,
  episodeNumber?: string | null,
  timestamp?: string | null,
};

export type DeleteSuggestionInput = {
  id?: string | null,
};

export type ModelSuggestionFilterInput = {
  id?: ModelIDInput | null,
  description?: ModelStringInput | null,
  episodeNumber?: ModelStringInput | null,
  timestamp?: ModelStringInput | null,
  and?: Array< ModelSuggestionFilterInput | null > | null,
  or?: Array< ModelSuggestionFilterInput | null > | null,
  not?: ModelSuggestionFilterInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type CreateSuggestionMutationVariables = {
  input: CreateSuggestionInput,
  condition?: ModelSuggestionConditionInput | null,
};

export type CreateSuggestionMutation = {
  createSuggestion:  {
    __typename: "Suggestion",
    id: string,
    description: string | null,
    episodeNumber: string | null,
    timestamp: string | null,
  } | null,
};

export type UpdateSuggestionMutationVariables = {
  input: UpdateSuggestionInput,
  condition?: ModelSuggestionConditionInput | null,
};

export type UpdateSuggestionMutation = {
  updateSuggestion:  {
    __typename: "Suggestion",
    id: string,
    description: string | null,
    episodeNumber: string | null,
    timestamp: string | null,
  } | null,
};

export type DeleteSuggestionMutationVariables = {
  input: DeleteSuggestionInput,
  condition?: ModelSuggestionConditionInput | null,
};

export type DeleteSuggestionMutation = {
  deleteSuggestion:  {
    __typename: "Suggestion",
    id: string,
    description: string | null,
    episodeNumber: string | null,
    timestamp: string | null,
  } | null,
};

export type GetSuggestionQueryVariables = {
  id: string,
};

export type GetSuggestionQuery = {
  getSuggestion:  {
    __typename: "Suggestion",
    id: string,
    description: string | null,
    episodeNumber: string | null,
    timestamp: string | null,
  } | null,
};

export type ListSuggestionsQueryVariables = {
  filter?: ModelSuggestionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListSuggestionsQuery = {
  listSuggestions:  {
    __typename: "ModelSuggestionConnection",
    items:  Array< {
      __typename: "Suggestion",
      id: string,
      description: string | null,
      episodeNumber: string | null,
      timestamp: string | null,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type OnCreateSuggestionSubscription = {
  onCreateSuggestion:  {
    __typename: "Suggestion",
    id: string,
    description: string | null,
    episodeNumber: string | null,
    timestamp: string | null,
  } | null,
};

export type OnUpdateSuggestionSubscription = {
  onUpdateSuggestion:  {
    __typename: "Suggestion",
    id: string,
    description: string | null,
    episodeNumber: string | null,
    timestamp: string | null,
  } | null,
};

export type OnDeleteSuggestionSubscription = {
  onDeleteSuggestion:  {
    __typename: "Suggestion",
    id: string,
    description: string | null,
    episodeNumber: string | null,
    timestamp: string | null,
  } | null,
};
