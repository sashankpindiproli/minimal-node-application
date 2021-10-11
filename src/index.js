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
  query getOrganization ($organization:String!) {
    organization(login: $organization) {
      name
      url
      repositories(first: 5) {
        edges {
          node {
            name
            url
          }
        }
      }
    }
  }
`;

client
  .query({
    query: GET_ORGANIZATION,
    variables: { organization: "the-road-to-learn-react" },
  })
  .then(console.log);
