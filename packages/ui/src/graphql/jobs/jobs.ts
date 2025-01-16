/* Generated File DO NOT EDIT. */
/* tslint:disable */
import * as Types from '../graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetAllConversationsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAllConversationsQuery = { __typename?: 'Query', getAllConversations: Array<{ __typename?: 'Conversation', isActive: boolean, jobDescription: { __typename?: 'JobDescription', jobTitle: string, companyName: string, location: string, employmentType?: string | null, url: string, jobId: string } }> };


export const GetAllConversationsDocument = gql`
    query getAllConversations {
  getAllConversations {
    jobDescription {
      jobTitle
      companyName
      location
      employmentType
      url
      jobId: _id
    }
    isActive
  }
}
    `;

/**
 * __useGetAllConversationsQuery__
 *
 * To run a query within a React component, call `useGetAllConversationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllConversationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllConversationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllConversationsQuery(baseOptions?: Apollo.QueryHookOptions<GetAllConversationsQuery, GetAllConversationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllConversationsQuery, GetAllConversationsQueryVariables>(GetAllConversationsDocument, options);
      }
export function useGetAllConversationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllConversationsQuery, GetAllConversationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllConversationsQuery, GetAllConversationsQueryVariables>(GetAllConversationsDocument, options);
        }
export type GetAllConversationsQueryHookResult = ReturnType<typeof useGetAllConversationsQuery>;
export type GetAllConversationsLazyQueryHookResult = ReturnType<typeof useGetAllConversationsLazyQuery>;
export type GetAllConversationsQueryResult = Apollo.QueryResult<GetAllConversationsQuery, GetAllConversationsQueryVariables>;