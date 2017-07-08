const config = require('./config/config.js');

App({
  onLaunch: function() {
    this.logIn()
 },
  logIn: function() {
    return new Promise(function(resolve,reject){
      wx.login({
        success: (res) => {
          let code = res.code
          console.log(code);
          if (code) {
            wx.getUserInfo({
              success: (res) => {
                wx.setStorageSync('user', res.userInfo)
                wx.request({
                  url: `${config.api}/login`,
                  method: 'POST',
                  data: {
                    code: code
                  },
                  header: {
                    'content-type': 'application/json'
                  },
                  success: function (res) {
                    console.log(res.data.token)
                    wx.setStorageSync('token', res.data.token)
                    resolve(res)
                  }
                })
              },
              fail: function () {
                console.log("如果用户点了拒绝，则短期内调用不会出现弹窗，而是直接进入 fail 回调");
              }
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
            reject(err)
          }
        }
      });
      })
    },

    checkToken: function() {
      console.log('Promise');
      const token = wx.getStorageSync('token')
      return new Promise(function(resolve,reject){
        wx.request({
          url: `${config.api}/auth`,
          header: {
            'authorization': token
          },
          method: 'POST',
          success (res) {
            console.log(res);
            resolve(res)
          },
          fail (err) {
            console.log(err);
            reject(err)
          }
        })
      })
    },
    switch: false
})
