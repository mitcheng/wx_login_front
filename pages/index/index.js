import { getToken, updateUserInfo } from '../../util/api';

Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: false,
    hasLogin: false
  },

  onLoad: function () {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        // 已授权,进行登陆
        if (res.authSetting['scope.userInfo']) {
          wx.checkSession({
            success:function(res){
              if (!that.hasLogin) {
                that.setData({
                  isHide: true,
                });
              }
            },
            fail:function(res){
             wx.showModal({
              title: '提示',
              content: '你的登录信息过期了，请重新登录',
             });
             wx.login({
                success: res => {
                  // 获取服务器的token
                  wx.request({
                    url: getToken,
                    method: 'GET',
                    header: {
                      'content-type': 'application/json' // 默认值
                    },
                    data: {
                      code: res.code
                    },
                    success: function (res) {
                      if (res.data.code == 0) {
                        wx.setStorageSync('userInfo', e.detail.userInfo);
                        wx.setStorageSync('token', res.data.data);
                        that.setData({
                          hasLogin: true,
                          userInfo: e.detail.userInfo
                        });
                      }
                      // 保存或者更新用户信息
                      wx.getUserInfo({
                        success: res => {
                          wx.request({
                            url: updateUserInfo,
                            data: res.userInfo,
                            method: "POST",
                            header: {
                              'content-type': 'application/json',
                            },
                            success: function (res) {
                              that.setData({
                                hasLogin: true
                              });
                            },
                            fail: function (error) {
                              console.log(error);
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        } else {
          that.setData({
            isHide: true
          });
        }
      }
    });
  },

  bindGetUserInfo: function (e) {
    let that = this;
    if (e.detail.userInfo) {
      // 用户已经授权过,不需要显示授权页面,所以不需要改变 isHide 的值
      wx.login({
        success: res => {
          // 获取服务的token值
          wx.request({
            url: getToken,
            method: 'GET',
            header: {
              'content-type': 'application/json' // 默认值
            },
            data: {
              code: res.code
            },
            success: function (res) {
              if (res.data.code == 0) {
                wx.setStorageSync('userInfo', e.detail.userInfo);
                wx.setStorageSync('token', res.data.data);
                that.setData({
                  hasLogin: true,
                  userInfo: e.detail.userInfo
                });
              }else{
                wx.showToast({
                  title: '稍后重试'
                });
                return;
              }
              // 保存或者更新用户信息
              wx.getUserInfo({
                success: res => {
                  wx.request({
                    url: updateUserInfo,
                    data: res.userInfo,
                    method: "POST",
                    header: {
                      'content-type': 'application/json',
                      'Authorization': 'HTSS ' + wx.getStorageSync('token')
                    },
                    success: function (res) {
                      that.setData({
                        hasLogin: true
                      });
                      //跳转到注册页面
                      wx.redirectTo({
                        url: '/pages/register/register'
                      })
                    },
                    fail: function (error) {
                      wx.showToast({
                        title: '稍后重试'
                      });
                    }
                  });
                }
              });
            },
            fail: function(res) {
              wx.setStorageSync('userInfo', "");
              wx.showToast({
                title: '服务器维护中...',
               });
              that.setData({
                isHide: true,
                hasLogin: false
              });
            }
          });
        }
      });
    } else {
      wx.setStorageSync('userInfo', "");
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  }
})
