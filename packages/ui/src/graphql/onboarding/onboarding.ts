/* Generated File DO NOT EDIT. */
/* tslint:disable */
/* eslint-disable */
import * as Types from '../graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetOnboardingStepQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetOnboardingStepQuery = { __typename?: 'Query', getOnboardingStep: { __typename?: 'User', onboardingStep: Types.OnboardingStep } };

export type UpdateOnboardingStepMutationVariables = Types.Exact<{
  onboardingStep: Types.OnboardingStep;
}>;


export type UpdateOnboardingStepMutation = { __typename?: 'Mutation', updateOnboardingStep: { __typename?: 'User', onboardingStep: Types.OnboardingStep } };


export const GetOnboardingStepDocument = gql`
    query getOnboardingStep {
  getOnboardingStep: getUser {
    onboardingStep
  }
}
    `;

/**
 * __useGetOnboardingStepQuery__
 *
 * To run a query within a React component, call `useGetOnboardingStepQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOnboardingStepQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOnboardingStepQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetOnboardingStepQuery(baseOptions?: Apollo.QueryHookOptions<GetOnboardingStepQuery, GetOnboardingStepQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetOnboardingStepQuery, GetOnboardingStepQueryVariables>(GetOnboardingStepDocument, options);
      }
export function useGetOnboardingStepLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetOnboardingStepQuery, GetOnboardingStepQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetOnboardingStepQuery, GetOnboardingStepQueryVariables>(GetOnboardingStepDocument, options);
        }
export type GetOnboardingStepQueryHookResult = ReturnType<typeof useGetOnboardingStepQuery>;
export type GetOnboardingStepLazyQueryHookResult = ReturnType<typeof useGetOnboardingStepLazyQuery>;
export type GetOnboardingStepQueryResult = Apollo.QueryResult<GetOnboardingStepQuery, GetOnboardingStepQueryVariables>;
export const UpdateOnboardingStepDocument = gql`
    mutation updateOnboardingStep($onboardingStep: OnboardingStep!) {
  updateOnboardingStep(onboardingStep: $onboardingStep) {
    onboardingStep
  }
}
    `;
export type UpdateOnboardingStepMutationFn = Apollo.MutationFunction<UpdateOnboardingStepMutation, UpdateOnboardingStepMutationVariables>;

/**
 * __useUpdateOnboardingStepMutation__
 *
 * To run a mutation, you first call `useUpdateOnboardingStepMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateOnboardingStepMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateOnboardingStepMutation, { data, loading, error }] = useUpdateOnboardingStepMutation({
 *   variables: {
 *      onboardingStep: // value for 'onboardingStep'
 *   },
 * });
 */
export function useUpdateOnboardingStepMutation(baseOptions?: Apollo.MutationHookOptions<UpdateOnboardingStepMutation, UpdateOnboardingStepMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateOnboardingStepMutation, UpdateOnboardingStepMutationVariables>(UpdateOnboardingStepDocument, options);
      }
export type UpdateOnboardingStepMutationHookResult = ReturnType<typeof useUpdateOnboardingStepMutation>;
export type UpdateOnboardingStepMutationResult = Apollo.MutationResult<UpdateOnboardingStepMutation>;
export type UpdateOnboardingStepMutationOptions = Apollo.BaseMutationOptions<UpdateOnboardingStepMutation, UpdateOnboardingStepMutationVariables>;