const config = require('./config');
const {DataManager} = require('./lib/dataManager');
const {dbConfig} = require('./config');
const {generateError} = require('./lib/errors');
const cors = require('cors');
const knexConf = dbConfig[dbConfig.useDB];
const bodyParser = require('body-parser')


const express = require('express');
const { json } = require('express/lib/response');
const { val } = require('objection');
const app = express();
const dbm = new DataManager(knexConf);

app.use(cors())
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const MAX_ELEMENT_IN_PAGE = 5;


app.get('/', async(req, res) => {
  let username = req.params.username;
  console.log(username);
  const user = await dbm.queryUser(username);
  console.log(user['username'])
  res.json('ok')
});

//user info
app.post('/user', (req, res) => {
  const reqbody = req.body
  let id = reqbody['id']
  
});

app.post('/login', async (req, res) => {
  const username = req.body['username'];
  const password = req.body['password'];
  let user;
  try {
    await dbm.login(username, password);
    user = await dbm.queryUser(username);

    res.json({
      statue: true,
      user: user,
      message: 'successful'
    })

  } catch (e) {
    res.json({
      statue: false,
      user: null,
      message: e.message
    });
  }
  
});

app.post('/register', async (req, res) => {
  const username = req.body['username'];
  const password = req.body['password'];
  rts = 'False';
  console.log(req.body);
  try {
    msg = await dbm.register(username, password);
    rts = 'True';
  } catch (e){
    msg = 'exists';
    rts = 'False';
  }
  res.json({
    res:rts,
    msg:msg
  })
});

//purchase 
app.post('/asset/purchase', async (req, res) => {
  const username = req.body['username'];
  const assetID = req.body['assetID'];
  
  try {
    let user = await dbm.queryUser(username);
    console.log(user['id']);
    const msg = await dbm.assetPurchase(assetID, user['id']);
    if(msg === 'ok') {
      user = await dbm.queryUser(username);
      res.json({
        'status' : 'true',
        'message': `${username} has purchased successfully.`,
        'balance': user['sanity']
      });
    } else {
      res.json({
        'status' : 'false',
        'message': msg,
        'balance': user['sanity']
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


app.post('/onSale', async (req, res) => {
  let name, uri, marketName, value;
  name = req.body['name'];
  uri = req.body['uri'];
  marketName = req.body['marketName'];
  value = req.body['value'];

  let rst = dbm.onSale(name, uri, marketName, value);
  res.json(rst);  
});

app.get('/onSale', (req, res) =>{
  res.json({
    msg: 'post to this url',
    form: '{name:"str", uri:"str", marketName:"str", vaule:"int"}'
  });
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
});

