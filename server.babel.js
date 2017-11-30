import express from 'express';
import getData from './getData';

const allowCrossDomain = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  if (req.method === 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
};

const app = express();

app.use(allowCrossDomain);
app.use('/', express.static('public'));
app.use('/get', getData());

app.listen(process.env.PORT || 3000);
