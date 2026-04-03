import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

// Configure Apollo Client to connect to the Gateway
const httpLink = createHttpLink({
  // Your backend gateway URL (uses local environment variable if set, otherwise defaults to port 4000)
  uri: import.meta.env.VITE_GRAPHQL_URI || 'http://localhost:4000/graphql',
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);