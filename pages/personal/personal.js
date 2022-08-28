// pages/personal/personal.js
let start = null //初始数据
let end = null //移动尾部数据
let move = null //移动距离
import request from "../../utils/request"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform:"",//移动距离
    coveTransition:"",//过渡
    userInfo: {}, // 用户信息
    recentPlayList: [], // 用户播放记录

  },
  // 触屏事件
  handleTouchStart(e){
    this.setData({
      coveTransition:"",//过渡清空，保证过渡不影响下拉只影响回弹
    })
    start = e.touches[0].clientY  //起始坐标
  },
  // 移动事件
  handleTouchMove(e){
   end = e.touches[0].clientY//移动终点坐标
   move = end - start //移动距离

  //  界限不能那个上移，下一距离不能那个超过80rpx
  if(move <= 0 ){
    move = 0
  } else if(move >=80){
    move = 80
  }
  //  更新数据
   this.setData({
    coverTransform:`translateY(${move}rpx)`
   })
   
  },
  // 离开屏幕事件,离开屏幕回弹
  handleTouchEnd(){
   // 动态更新coverTransform的状态值
   this.setData({
    coverTransform: `translateY(0rpx)`,
    coveTransition:" transform 1s linear"
  })

  },

  // 跳转登录页面
  toLogin(){
    wx.reLaunch({
      url:"/pages/login/login"
    })
  },
   
 //  读取用户信息
 getUserInfo(){
  let user = wx.getStorageSync("userInfo")?JSON.parse(wx.getStorageSync("userInfo")):{}
  this.setData({
    userInfo:user
  })
  this.getPlayedList(this.data.userInfo.userId)
 },

//  获取用户播放记录
 async getPlayedList(uid){
  console.log(uid)
  try{
    let res = await request('/user/record',{uid,type:0},"GET")
    let index = 0
    let recentPlayList =res.data?res.data.allData.splice(0, 10).map(item => {
      item.id = index++;
      return item;
    }):[]
    // 更新数据
    this.setData({
      recentPlayList,
    })
  }catch(error){
  console.log(error)
  }

 },
  // 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getUserInfo()  //获取用户信息
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