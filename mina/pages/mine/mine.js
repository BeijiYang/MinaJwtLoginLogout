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
