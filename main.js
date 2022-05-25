const config = require('./config');
const {DataManager} = require('./lib/dataManager');
const {dbConfig} = require('./config');
const {generateError} = require('./lib/errors');
const cors = require('cors');
const knexConf = dbConfig[dbConfig.useDB];
const bodyParser = require('body-parser')


const express = require('express');
const app = express();
const dbm = new DataManager(knexConf);

app.use(cors())
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded



app.get('/', (req, res) => {
  console.log(req.body);

  res.send(JSON.stringify({
    message: 'Hello World!',
  }));
});

//user info
app.post('/user', (req, res) => {
  const reqbody = req.body
  let id = reqbody['id']
  
});

//purchase 
app.get('/asset/:id/purchase', async (req, res) => {
  const asset_ID = req.params.asset_id;
  const user_ID = req.params.user_id;
  try {
    const msg = await dbm.assetPurchase(asset_ID, user_ID);
    if(msg === 'ok') {
      res.json({
        status : 'ok',
        message: `${user_ID} has purchased successfully.`
      });
    } else {
      res.json({
        status : 'error',
        message: msg
      });
    }
  } catch (e) {
    console.log("asset purchage wrong,", e);
    res.json({
      status : 'error',
      message: String(e)
    });
  }
  
  
});

// asset detail
app.get('/asset/:id', async (req, res) => {
  const id = req.params.id;
  const asset = await dbm.queryAsset(id);
  if (asset) {
    res.json(asset);
  } else {
    res.json(generateError('null'));
  }
});

app.get('/asset/batch/:batch', async (req, res) => {
  const batch = req.params.batch;
  let assets = [];
  let id = batch * 30;
  let total = 0;
  for(let i=0; i<30; i++) {
    const asset = await dbm.queryAsset(id);
    if(asset) {
      console.log(asset);
      assets.push(asset);
      total++;
    }
    id++;
  }

  res.json({'assets': assets, 'total': total});
});

app.get('/user/rank/:batch', async (req, res) => {
  let batch = req.params.batch
  let users = await dbm.userRank();
  users = users.slice(batch*30, (batch+1)*30)
  res.json({'total': users.length,'users':users})
});

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});


app.post('/register', async (req, res) =>{
  const username = req.body['username']
  const password = req.body['password']
  const accLeve = req.body['accLeve']
  console.log(username)
  try {
    dbm.register(username, password, accLeve);
    res.json({
      status : 'ok',
      message: 'registered'
    })
  }catch(e) {
    res.json({
      status : 'error',
      message: String(e)
    })
  }
})