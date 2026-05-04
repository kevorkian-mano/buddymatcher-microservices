const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const {
  ApolloGateway,
  IntrospectAndCompose,
  RemoteGraphQLDataSource,
} = require('@apollo/gateway');

require('dotenv').config();

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  willSendRequest({ request, context }) {
    if (context.token) {
      request.http.headers.set('authorization', context.token);
    }
  }
}

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: 'user', url: process.env.USER_SERVICE_URL || 'http://localhost:4001' },
      { name: 'profile', url: process.env.PROFILE_SERVICE_URL || 'http://localhost:4002' },
      { name: 'availability', url: process.env.AVAILABILITY_SERVICE_URL || 'http://localhost:4003' },
      { name: 'matching', url: process.env.MATCHING_SERVICE_URL || 'http://localhost:4004' },
      { name: 'session', url: process.env.SESSION_SERVICE_URL || 'http://localhost:4005' },
      { name: 'notification', url: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:4006' },
      { name: 'messaging', url: process.env.MESSAGING_SERVICE_URL || 'http://localhost:4007' },
    ],
    pollIntervalInMs: 10000,
  }),
  buildService({ name, url }) {
    return new AuthenticatedDataSource({ url });
  },
});

const server = new ApolloServer({ gateway });

async function startGateway() {
  await server.start();

  const app = express();

  app.use(cors({
    origin: '*', // allow all origins
    credentials: true,
  }));

  app.use(express.json());

  // ADD THIS LINE
  app.get('/', (req, res) => res.send('Gateway is running ✅'));


  app.use('/graphql', expressMiddleware(server, {
    context: async ({ req }) => {
      const token = req.headers.authorization || '';
      return { token };
    },
  }));

  const port = parseInt(process.env.PORT) || 4000;
  app.listen(port, () => {
    console.log(`🚀 Gateway ready at http://localhost:${port}/graphql`);
  });
}

startGateway();