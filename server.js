const express = require('express');
const next = require('next');
const api = require('./api');

const port = parseInt(process.env.PORT, 10) || 3333;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare()
.then(() => {
  const server = express();

  // Handle /api calls at the server
  server.use('/api', api(null, null));

  server.get('*', (req, res) => handle(req, res));

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
