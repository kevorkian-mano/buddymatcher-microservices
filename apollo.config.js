module.exports = {
  client: {
    service: {
      name: 'software-project',
      localSchemaFile: './gateway/src/schema/typeDefs.js', // Adjust if you have a local schema file or endpoint
      // OR
      // url: 'http://localhost:4000/graphql',
    },
    includes: ['./frontend/src/**/*.js', './frontend/src/**/*.jsx', './frontend/src/**/*.ts', './frontend/src/**/*.tsx'],
    excludes: ['**/__tests__/**']
  }
};
