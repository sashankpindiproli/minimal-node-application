import 'cross-fetch/polyfill';
import ApolloClient, { gql } from 'apollo-boost';
import 'dotenv/config';

const userCredentials = { firstname: 'Robin' };
const userDetails = { nationality: 'German' };

const user = {
  ...userCredentials,
  ...userDetails,
};

const client = new ApolloClient({
  uri: 'https://api.github.com/graphql',
  request: operation => {
    operation.setContext( {
      headers: {
        authorization: `bearer ${process.env.NODE_APP_GITHUB_PERSONAL_ACCESS_TOKEN}`
      }
    })
  }
});


const GET_ORGANIZATION = gql`
  fragment repositoryNodes on Repository {
    name
    url
  }

  query getOrganization($organization: String!, $cursor: String) {
    organization(login: $organization) {
      id
      name
      url
      repositories(
        first: 5
        orderBy: { field: STARGAZERS, direction: ASC }
        after: $cursor
      ) {
        edges {
          node {
            ...repositoryNodes
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`;

client
  .query({
    query: GET_ORGANIZATION,
    variables: { organization: 'the-road-to-learn-react', cursor: null },
  })
  .then( ( { data } ) =>
  { 
    const repositories = data?.organization?.repositories;
    const endCursor = repositories?.pageInfo?.endCursor;
    
    client
      .query({
        query: GET_ORGANIZATION,
        variables: {
          organization: 'the-road-to-learn-react',
          cursor: endCursor,
        },
      })
      .then(({ data }) => data?.organization?.repositories?.pageInfo );
  });
