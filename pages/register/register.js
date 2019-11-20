//获取应用实例
const app = getApp()

// pages/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    nickName : "",
    phone: "",
  },

  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    let { nickName,phone } = e.detail.value;
    if (!nickName || !phone) {
      wx.showModal({
        title: '提示',
        content: '请填写昵称,手机号',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      });
      return;
    }
    // 调用到后台更新代码
    
    wx.switchTab({
      url: '/pages/discover/discover'
    })
  },

  formReset: function () {
    console.log('form发生了reset事件')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad');
    this.setData({
      userInfo : wx.getStorageSync("userInfo")
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onShow');
    this.setData({
      userInfo : wx.getStorageSync("userInfo")
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})