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

     exports.checkToken = (req, res) => {
         let token = req.headers.authorization;
         console.log(token);
         if(token) {
           console.log('token exist');
           jwt.verify(token, config.jwtSecret, (err, decoded) => {
             console.log('jwt.verify');
             if(err) {
               console.log('err');
               if(err.name === 'TokenExpiredError') {
                 console.log('认证码失效，请重新登录!');
                 return res.status(401).json({ error: '认证码失效，请重新登录!' });
               } else {
                 console.log('认证失败！');
                 return res.status(401).json({ error: '认证失败！'});
               }
             } else {
               if(decoded.openid) {
                 req.openid = decoded.openid;
                 console.log('req.openid = decoded.openid;');
                 return res.status(200).json({ message: '已登录'});
               } else {
                   console.log('认证失败！');
                 res.status(401).json({ error: '认证失败！'});
               }
             }
           });
         } else {
           console.log("no token");
           return res.status(403).json({
             error: '请提供认证码！'
           });
         }
     }
