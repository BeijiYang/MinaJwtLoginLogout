const express =  require('express')
const app = express()

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/mina');

const db = mongoose.connection;
db.on('error', console.log);
db.once('open', function() {
  console.log('success!')
});

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))



const User = require('./models/user')
const jwt = require('jsonwebtoken')
const config = require('./config/config')
const axios = require('axios')

let generateToken = function(user) {
  return jwt.sign(user, config.jwtSecret , {
    expiresIn: 7200
  })
}

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.post('/login',(req, res) => {
  const queryString = `appid=${config.appId}&secret=${config.appSecret}&js_code=${req.body.code}&grant_type=authorization_code`;
  const wxAPI = `https://api.weixin.qq.com/sns/jscode2session?${queryString}`;
  axios.get(wxAPI)
       .then(response =>{
         console.log(response.data);

        User.findOne({openId: response.data.openid}, (err, user) => {
          if(user) {
            return res.json({
              token: generateToken({openid: response.data.openid})
            })
          } else {
            const user = new User();
            user.openId = response.data.openid;
            user.save();

            return res.json({
              token: generateToken({openid: response.data.openid})
            })
          }
        })
       })
       .catch(error => {
         console.log(error)
       })
     }
   )

app.listen(3000, () => console.log('running on port 3000...'))
