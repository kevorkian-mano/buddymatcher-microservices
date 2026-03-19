const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { typeDefs } = require('./schema/typeDefs');
const { resolvers } = require('./resolvers');
const { startConsumer } = require('./kafka/consumer');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function startServer() {
  startConsumer().catch(console.error);

  const server = new ApolloServer({ typeDefs, resolvers });

  const { url } = await startStandaloneServer(server, {
    listen: { port: parseInt(process.env.PORT) || 4006 },
    context: async ({ req }) => {
      const token = req.headers.authorization?.split(' ')[1] || null;
      let user = null;
      if (token) {
        try { user = jwt.verify(token, process.env.JWT_SECRET || 'changeme'); } catch (_) {}
      }
      return { user };
    }
  });

  console.log(`🚀 Notification Service ready at ${url}`);
}

startServer();
