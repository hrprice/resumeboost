/* Generated File DO NOT EDIT. */
/* tslint:disable */
/* eslint-disable */
import * as Types from '../graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetAllConversationsQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAllConversationsQuery = { __typename?: 'Query', getAllConversations: Array<{ __typename?: 'Conversation', isActive: boolean, conversationId: string, jobDescription: { __typename?: 'JobDescription', jobTitle: string, companyName: string, location: string, employmentType?: string | null, url: string } }> };

export type GetConversationByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['String']['input'];
}>;


export type GetConversationByIdQuery = { __typename?: 'Query', getConversationById: { __typename?: 'Conversation', jobDescription: { __typename?: 'JobDescription', jobTitle: string, companyName: string, location: string, employmentType?: string | null, url: string, _id: string }, updatedResumeText: Array<Array<{ __typename?: 'TextContentDto', content: string, type: Types.TextContentType }>> } };


export const GetAllConversationsDocument = gql`
    query getAllConversations {
  getAllConversations {
    jobDescription {
      jobTitle
      companyName
      location
      employmentType
      url
    }
    isActive
    conversationId: _id
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
export const GetConversationByIdDocument = gql`
    query getConversationById($id: String!) {
  getConversationById(conversationId: $id) {
    jobDescription {
      jobTitle
      companyName
      location
      employmentType
      url
      _id
    }
    updatedResumeText {
      content
      type
    }
  }
}
    `;

/**
 * __useGetConversationByIdQuery__
 *
 * To run a query within a React component, call `useGetConversationByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetConversationByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetConversationByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetConversationByIdQuery(baseOptions: Apollo.QueryHookOptions<GetConversationByIdQuery, GetConversationByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetConversationByIdQuery, GetConversationByIdQueryVariables>(GetConversationByIdDocument, options);
      }
export function useGetConversationByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetConversationByIdQuery, GetConversationByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetConversationByIdQuery, GetConversationByIdQueryVariables>(GetConversationByIdDocument, options);
        }
export type GetConversationByIdQueryHookResult = ReturnType<typeof useGetConversationByIdQuery>;
export type GetConversationByIdLazyQueryHookResult = ReturnType<typeof useGetConversationByIdLazyQuery>;
export type GetConversationByIdQueryResult = Apollo.QueryResult<GetConversationByIdQuery, GetConversationByIdQueryVariables>;