import { getToken, updateUserInfo } from '../../util/api';

Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: false,
    userInfo: null
  },

  onLoad: function () {
    var that = this;
    that.setData({
      userInfo: wx.getStorageSync("userInfo")
    });
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        // 已授权,进行登陆
        if (res.authSetting['scope.userInfo']) {
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
                    wx.setStorageSync('token', res.data.data);
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
                          console.log("success");
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
        } else {
          that.setData({
            isHide: true
          });
        }
      }
    });
  },

  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      wx.setStorageSync('userInfo', e.detail.userInfo);
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
                wx.setStorageSync('token', res.data.data);
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
                      //跳转到注册页面
                      wx.navigateTo({
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
