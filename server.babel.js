import express from 'express';
import getData from './getData';

const allowCrossDomain = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
};

const app = express();

app.use(allowCrossDomain);
app.use('/', express.static('public'));
app.use('/get', getData());

app.listen(process.env.PORT || 3000);
