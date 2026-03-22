const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const {
  ApolloGateway,
  IntrospectAndCompose,
  RemoteGraphQLDataSource,
} = require('@apollo/gateway');

require('dotenv').config();

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  willSendRequest({ request, context }) {
    if (context.token) {
      request.http.headers.set(
        "authorization",
        context.token
      );
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
  }),

  buildService({ name, url }) {
    return new AuthenticatedDataSource({ url });
  },
});

const server = new ApolloServer({
  gateway,
});

async function startGateway() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: parseInt(process.env.PORT) || 4000 },

    context: async ({ req }) => {
      const token = req.headers.authorization || "";
      return { token };
    },
  });

  console.log(`🚀 Gateway ready at ${url}`);
}

startGateway();