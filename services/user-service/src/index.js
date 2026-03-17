const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { typeDefs } = require('./schema/typeDefs');
const { resolvers } = require('./resolvers');
const { verifyToken } = require('./middleware/auth');
require('dotenv').config();

async function startServer() {
  const server = new ApolloServer({ typeDefs, resolvers });

  const { url } = await startStandaloneServer(server, {
    listen: { port: parseInt(process.env.PORT) || 4001 },
    context: async ({ req }) => {
      const token = req.headers.authorization?.split(' ')[1] || null;
      let user = null;
      if (token) {
        try { user = verifyToken(token); } catch (_) {}
      }
      return { user };
    }
  });

  console.log(`🚀 User Service ready at ${url}`);
}

startServer();
