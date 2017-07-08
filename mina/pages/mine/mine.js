//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    beforeLogin: '登录',
    test: false
  },

  onLoad: function () {
    const value = wx.getStorageSync('user')
    this.setData({ userInfo: value })
  },

  //检测onlunch时是否成功取得用户信息
  onShow: function () {
    try {
      var userInfo = wx.getStorageSync('user')
      if (userInfo) {
        this.setData({
          test: true,
        })
        }
    } catch (e) {
      console.log(e);
    }
  },

  login: function () {
    let that = this
    console.log('login~~~');
    //检测登录态
    getApp().checkToken().then(
      function (res) {
        console.log(res);
        if(parseInt(res.statusCode) === 200){
          console.log(res)
          console.log('未过期');
            //token 未过期，并且在本生命周期一直有效
      } else {
           console.log(res.data.error);
            //登录态过期
            console.log('过期了！');
            that.reGetUserInfo()
        }
      }
    ).catch(
      function (err) {
        console.log(err);
        wx.showToast({
          title: '服务器未响应',
          icon: 'loading',
          duration: 2000
        })
      }
    )
  },

  //重新请求使用用户信息的授权
  reGetUserInfo: function () {
    console.log('reGetUserInfo~~~');
    let that = this
    wx.openSetting({
      success:(res)=>{
        let balbal = that
        console.log(that.data.test);
        console.log("授权结果..")
        console.log(res)
          res.authSetting = {
           "scope.userInfo": true,
         }
         getApp().logIn()
         .then(
           (res) => {
             console.log("NEW PROMISE!!!")
             that.setData({
               test: true,
               userInfo: wx.getStorageSync('user'),
             })
           }
         )
         .catch(
           (err) => {
             console.log(err);
           }
         )
      }
    })
  },

  //退出登录
  quit: function() {
    try {
      wx.removeStorageSync('token')
      wx.removeStorageSync('user')
      this.setData({
        userInfo: {},
        test: false,
      })
    } catch (e) {
      console.log(e);
    }
  },
})
