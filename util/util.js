import { token } from './api';
/**
 * 封装微信的的request
 */
function request(url, data = {}, method = "GET") {
    return new Promise(function (resolve, reject) {
        wx.request({
            url: url,
            data: data,
            method: method,
            header: {
                'Content-Type': 'application/json',
                'X-HTSS-Token': wx.getStorageSync('token')
            },
            success: function (res) {
                if (res.code == 0) {
                    resolve(res);
                } else {
                    reject(res.errMsg);
                }
            },
            fail: function (err) {
                reject(err)
            }
        })
    });
}

function get(url, data = {}) {
    return request(url, data, 'GET')
}

function post(url, data = {}) {
    return request(url, data, 'POST')
}

function showToast(title) {
    wx.showToast({
        title: title
    });
}

export default {
    request,
    get,
    post,
    showToast,
}
