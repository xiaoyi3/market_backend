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

const MAX_ELEMENT_IN_PAGE = 5;


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

app.post('/user/check', async (req, res) => {
  const username = req.body['username'];
  const password = req.body['password'];
  msg = await dbm.login(username, password);
  rts = 'False'
  if (msg === 'verified') {
    rts = 'True';
  } else if (msg === 'no such user or wrong password') {
    rts = 'False';
  } else {
    rts = 'False';
  }
  res.json({'res': rts, 'msg': msg})
});

app.post('/register', async (req, res) => {
  const username = req.body['username'];
  const password = req.body['password'];
  rts = 'False'
  console.log(req.body)
  try {
    msg = await dbm.register(username, password);
    rts = 'test'
  } catch (e){
    msg = 'exists'
    rts = 'False'
  }
  res.json({
    'res':rts,
    'msg':msg
  })
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
  const assets = await dbm.assetPage(batch, MAX_ELEMENT_IN_PAGE);
  
  pages = Math.ceil(assets.total/MAX_ELEMENT_IN_PAGE);
  element = Math.min(MAX_ELEMENT_IN_PAGE, assets.total-batch*MAX_ELEMENT_IN_PAGE);
  res.json(
    {assets, 'pages': pages, 'element': element}
    );
});

app.get('/user/rank/:batch', async (req, res) => {
  let batch = req.params.batch
  let users = await dbm.userRank(batch, MAX_ELEMENT_IN_PAGE);
  //users = users.slice(batch*30, (batch+1)*30)
  pages = Math.ceil(users.total/MAX_ELEMENT_IN_PAGE);
  element = Math.min(MAX_ELEMENT_IN_PAGE, users.total-batch*MAX_ELEMENT_IN_PAGE);
  res.json({users, 'pages':pages, 'element':element})
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