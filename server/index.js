const express =  require('express')
const app = express()
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/mina', {
  useMongoClient: true,
});

const db = mongoose.connection;
db.on('error', console.log);
db.once('open', function() {
  console.log('success!')
});

const cors = require('cors')
const bodyParser = require('body-parser')
const apiRouter = require('./routes')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/', cors(), apiRouter)

app.listen(3000, () => console.log('running on port 3000...'))
