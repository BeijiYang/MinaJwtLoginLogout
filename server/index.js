const express =  require('express')
const app = express()

const mongoose = require('mongoose');
mongoose.createConnection('mongodb://localhost:27017/mina');

const db = mongoose.connection;
db.on('error', console.log);
db.once('open', function() {
  console.log('success!')
});



app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(3000, () => console.log('running on port 3000...'))
