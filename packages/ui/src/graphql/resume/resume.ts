/* Generated File DO NOT EDIT. */
/* tslint:disable */
/* eslint-disable */
import * as Types from '../graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetAllResumesQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAllResumesQuery = { __typename?: 'Query', getAllResumes: Array<{ __typename?: 'Resume', fileName: string, resumeId: string }> };


export const GetAllResumesDocument = gql`
    query GetAllResumes {
  getAllResumes {
    resumeId: _id
    fileName
  }
}
    `;

/**
 * __useGetAllResumesQuery__
 *
 * To run a query within a React component, call `useGetAllResumesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllResumesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllResumesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllResumesQuery(baseOptions?: Apollo.QueryHookOptions<GetAllResumesQuery, GetAllResumesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllResumesQuery, GetAllResumesQueryVariables>(GetAllResumesDocument, options);
      }
export function useGetAllResumesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllResumesQuery, GetAllResumesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllResumesQuery, GetAllResumesQueryVariables>(GetAllResumesDocument, options);
        }
export type GetAllResumesQueryHookResult = ReturnType<typeof useGetAllResumesQuery>;
export type GetAllResumesLazyQueryHookResult = ReturnType<typeof useGetAllResumesLazyQuery>;
export type GetAllResumesQueryResult = Apollo.QueryResult<GetAllResumesQuery, GetAllResumesQueryVariables>;