const config = require('./config');
const {DataManager} = require('./lib/dataManager');
const {dbConfig} = require('./config');
const {generateError} = require('./lib/errors');

const knexConf = dbConfig[dbConfig.useDB];

const express = require('express');
const app = express();
const dbm = new DataManager(knexConf);


app.get('/', (req, res) => {
  res.send(JSON.stringify({
    message: 'Hello World!',
  }));
});

app.get('/asset/:id', async (req, res) => {
  const id = req.params.id;
  const asset = await dbm.queryAsset(id);
  if (asset) {
    res.json(asset);
  } else {
    res.json(generateError('null'));
  }
});

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
