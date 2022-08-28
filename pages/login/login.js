// pages/login/login.js
import request from '../../utils/request'
import drawQrcode from '../../utils/weapp.qrcode'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:"",//手机号
    password:"",//密码
    qrcodes:true //是否显示二维码，false为显示
  },
  
  handleInput(e){
    let type = e.currentTarget.id
    this.setData({
      [type]:e.detail.value
    })
  },
  async login(){
    // 登录验证
    let phone = this.data.phone
    let password = this.data.password
    if(phone.trim() === ""){
      wx.showToast({
        title:"手机号不能为空",
        icon:"none"

      })
      return
    }
    let reg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
    if(!reg.test(phone)){
      wx.showToast({
        title:"手机号格式不正确",
        icon:"none"

      })
      return
    }

    // 密码验证
    if(password.trim() === ""){
      wx.showToast({
        title:"密码不能为空",
        icon:"none"

      })
      return
    }
    let res = await request("/login/cellphone",{phone,password})

    if(res.data.code === 200){
      wx.showToast({
        title:"登录成功",
        icon:"success",
      })
      // 存储用户信息
      // wx.setStorageSync("userInfo",JSON.stringify(res.data.profile))
      this.getUserInfo() //存储用户信息
      // 跳转到个人中心
      wx.reLaunch({
        url: '/pages/personal/personal'
      })
    }else if(res.data.code === 400){
      wx.showToast({
        title:"手机号错误",
        icon:"error"
      })}else if(res.data.code === 502){
        wx.showToast({
          title:"密码错误",
          icon:"error"
        })
      }else{
        wx.showToast({
          title:"登录失败",
          icon:"error"
        })
        this.setData({
          qrcodes:false
        })
           // 发送请求,登录接口有问题，无法登录，扫码登录
        let res1 = await request("/login/qr/key")
        let key = res1.data.data.unikey
        let res2 = await request("/login/qr/create",{key})
        let qrurl = res2.data.data.qrurl
        new drawQrcode({
          text: qrurl,
          width: 150,
          height: 150,
          canvasId:"myQrcode",
          background:'#ffffff', //	非必须，二维码背景颜色，默认值白色
          foreground: '#000000'
        });
       this.time = setInterval(async()=>{
        let res3 = await request("/login/qr/check",{key}) //获取登录状态
        console.log(res3)
        if(res3.data.code === 803){
          wx.showToast({
            title:"登录成功",
            icon:"success",
          })

          clearInterval(this.time)
          // 获取用户信息，该接口只返回cookie
          this.getUserInfo() //存储用户信息
          wx.setStorageSync("cookies",res3.cookies) //存储cookie
          // 跳转到个人中心
          wx.reLaunch({
            url: '/pages/personal/personal'
          })
       }
      },1000)
      
  }
},

  // 用户信息，这里是我的信息，因为的登录不进去
  getUserInfo(){
    let profile = {
      "backgroundImgIdStr": "109951162868126486",
      "avatarImgIdStr": "109951165647004069",
      "followed": false,
      "backgroundUrl": "https://p1.music.126.net/_f8R60U9mZ42sSNvdPn2sQ==/109951162868126486.jpg",
      "userId": 7998516297,
      "userType": 0,
      "detailDescription": "",
      "vipType": 11,
      "nickname": "芽芽不想发芽",
      "birthday": -2209017600000,
      "gender": 0,
      "province": 330000,
      "city": 330100,
      "avatarImgId": 109951165647004060,
      "backgroundImgId": 109951162868126480,
      "accountStatus": 0,
      "avatarUrl": "https://p3.music.126.net/SUeqMM8HOIpHv9Nhl9qt9w==/109951165647004069.jpg",
      "defaultAvatar": false,
      "expertTags": null,
      "experts": {},
      "mutual": false,
      "remarkName": null,
      "authStatus": 0,
      "djStatus": 0,
      "description": "",
      "signature": "",
      "authority": 0,
      "avatarImgId_str": "109951165647004069",
      "followeds": 0,
      "follows": 1,
      "eventCount": 0,
      "avatarDetail": null,
      "playlistCount": 1,
      "playlistBeSubscribedCount": 0,
      "userId": 7998516297
    }
  //  用户信息本地存储
  wx.setStorageSync('userInfo', JSON.stringify(profile))
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getUserInfo() //存储用户信息

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})