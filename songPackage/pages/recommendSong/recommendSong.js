import request from "../../../utils/request"
import PubSub from 'pubsub-js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day:"",//天数
    month:"",//月
    recommendList:[],//每日推荐列表
    musicIndex:0,//当前音乐的index
    musicId:"",//当前音乐id

  },
   
  // 年月获取
  getDayMonth(){
    let dayMonth = new Date()
    this.setData({
      day:dayMonth.getDate(),
      month:dayMonth.getMonth()+1
    })

  },
  // 歌曲列表数据请求
  async getRecommendList(){
    try{
      let res = await request("/recommend/songs")
      this.setData({
        recommendList: res.data.data.dailySongs
      })
    }catch(error){
    console.log(error)
    }
  },
  // 跳转歌曲播放界面
  toSongDetail(e){
    let id = e.currentTarget.id
    let index = e.currentTarget.dataset.index
    // 存储当前id便于上下曲切换数据
    this.setData({
      musicIndex:index,
      musicId:id
    })

    wx.navigateTo({
      url:"/songPackage/pages/songDetail/songDetail?id="+ id
    })
  },
  // 上一曲下一曲事件处理
  nextPerCut(pubsub,type){
    let {musicIndex,recommendList} = this.data
    if(type === "next"){
      musicIndex = musicIndex+1
      if(musicIndex === recommendList.length){
        musicIndex = 0
      }
      
    }else {
      musicIndex = musicIndex-1
      if(musicIndex < 0){
        musicIndex = recommendList.length-1
      }
    }
    // 更新当前数据
    this.setData({
      musicIndex:musicIndex,
      musicId:recommendList[musicIndex].id
    })
    // 传递数据
    PubSub.publish("songCut",this.data.musicId)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getDayMonth()//获取当前年月并更新
    this.getRecommendList()//获取推荐歌曲信息

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    // 接收数据
   this.nextPerCut = PubSub.subscribe("nextPerCut",this.nextPerCut)
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
    // 取消订阅
    PubSub.unsubscribe(this.nextPerCut)
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