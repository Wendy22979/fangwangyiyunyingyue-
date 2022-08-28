// pages/index/index.js
import request from "../../utils/request"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList:[],
    songList:[],
    topList:[],

  },

  // 请求banner数据
  async getBanner(){
    try{
      let res = await request("/banner",{type:1},"GET")
      this.setData({
        bannerList:res.data.banners
      })
      console.log(this.data.bannerList)
    }catch(error){
    console.log(error)
    }
  },

  // 获取歌单
  async getSongList(){
    try{
      let res = await request("/personalized",{limit:30},"GET")
      console.log(res)
      this.setData({
        songList:res.data.result
      })
    
     }catch(error){
     console.log(error)
    }
  },

  // 获取排行榜
  async getTopList(){
    let list = []
    try{
      let res = await request("/toplist/detail")
      list = res.data.list.slice(0,4).map((item)=>{
        return {name:item.name,tracks:item.tracks}
      })
      this.setData({
        topList:list
      })
    
     }catch(error){
     console.log(error)
    }
  },

  //每日推荐
  toRecommendSong(){
    wx.navigateTo({
      url:"/songPackage/pages/recommendSong/recommendSong"
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
     this.getBanner()  //请求banner数据
     this.getSongList()  //请求歌单数据
     this.getTopList()  //请求排行榜 数据




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