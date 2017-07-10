const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const axios = require('axios')

let generateToken = function(user) {
  return jwt.sign(user, config.jwtSecret , {
    expiresIn: 7200
  })
}

exports.login = (req, res) => {
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
