const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { ApolloGateway, IntrospectAndCompose } = require('@apollo/gateway');
require('dotenv').config();

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: 'user', url: 'http://localhost:4001' },
      { name: 'profile', url: 'http://localhost:4002' },
      { name: 'availability', url: 'http://localhost:4003' },
      { name: 'matching', url: 'http://localhost:4004' },
      { name: 'session', url: 'http://localhost:4005' },
      { name: 'notification', url: 'http://localhost:4006' },
      { name: 'messaging', url: 'http://localhost:4007' },
    ],
  }),
});

const server = new ApolloServer({
  gateway,
});

async function startGateway() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: parseInt(process.env.PORT) || 4000 },
    context: async ({ req }) => {
      // Pass the Authorization header to subgraphs
      const token = req.headers.authorization || '';
      return { token };
    },
  });

  console.log(`🚀 Gateway ready at ${url}`);
}

startGateway();
