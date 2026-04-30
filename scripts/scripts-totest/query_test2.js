const { ApolloClient, InMemoryCache, gql, HttpLink } = require('@apollo/client/core');
const fetch = require('cross-fetch');
// Using the token for user: 1f77c505-9466-450f-ace7-519324630eae
const jwt = require('jsonwebtoken');
const token = jwt.sign({ id: '1f77c505-9466-450f-ace7-519324630eae' }, 'changeme');

const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:4000/graphql', fetch, headers: { authorization: `Bearer ${token}` } }),
  cache: new InMemoryCache()
});

client.query({
  query: gql`
    query GetMatches {
      getPotentialMatches {
        userId
        score
      }
    }
  `
}).then(res => console.log(res.data)).catch(console.error);
