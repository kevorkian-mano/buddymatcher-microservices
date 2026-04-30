const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');

const token = jwt.sign({ id: '1f77c505-9466-450f-ace7-519324630eae' }, process.env.JWT_SECRET || 'changeme');

fetch('http://localhost:4000/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    query: `
      query GetMatches {
        getPotentialMatches {
          userId
          score
          reason
        }
      }
    `
  })
})
.then(r => r.json())
.then(data => console.log(JSON.stringify(data, null, 2)))
.catch(console.error);
