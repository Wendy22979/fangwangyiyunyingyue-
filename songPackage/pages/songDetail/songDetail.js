// songPackage/pages/songDetail/songDetail.js
import request from "../../../utils/request"
import PubSub from 'pubsub-js';
import dayjs from "dayjs"
// 获取全局实例
const appInstance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay:false,//播放状态
    songInfo:{},//当前歌曲信息
    musicId:"",//当前歌曲id
    musicUrl:"",//当前音乐链接地址
    currentProgress:0,//当前进度条
    currentTime:"0:00",//当前时间
    durationTime:"0:00",//总时间

  },
  // 播放与暂停状态更改与存储
  handleMusicState(){
  let {isPlay} = this.data
  isPlay = !isPlay
  // 更改状态
  this.setIsPlayState(isPlay)
  // 实现播放与暂停功能回调
   this.handleMusicPlay(this.data.isPlay)
  
  },

  // 更改存储状态
  setIsPlayState(isPlay){
    this.setData({
      isPlay,
     })
   appInstance.globalData.isMusicPlay = isPlay //修改状态
  },

  // 实现播放与暂停功能函数
  handleMusicPlay(isPlay){
    if(isPlay){
       //  创建播放器,并自动播放
      this.backgroundAudio.src = this.data.musicUrl
      this.backgroundAudio.title = this.data.songInfo.name
    }else{
      this.backgroundAudio.pause()//暂停播放
    }
  },
  // 时间格式化,时间戳转分秒
  getTime(date){
    return dayjs(date).format('m:ss') 
  },

  // 请求歌曲信息
  async getSongInfo(id){
   try{
    let res = await request("/song/detail",{ids:id})
    let time = this.getTime(res.data.songs[0].dt)
    console.log(time)
    this.setData({
      songInfo:res.data.songs[0],
      durationTime:time
    })

    // 修改窗口标题
    wx.setNavigationBarTitle({
      title:this.data.songInfo.name
    })
   }catch(error){
   console.log(error)
   }
  },
  // 获取当前音乐地址
  async getMusicUrl(id){
    try{
      let res = await request("/song/url",{id})
      this.setData({
        musicUrl:res.data.data[0].url
      })
    }catch(error){
    console.log(error)
    }
  },
  // 上一曲，下一曲切换
  handleSwitch(e){
    // 关闭当前音乐
    this.setIsPlayState(false)  //修改状态
    this.handleMusicPlay(false) //实现暂停播放
    let type = e.currentTarget.id
    // 传递id通知传下一个id过来
    PubSub.publish("nextPerCut",type)

  },
  // 切换处理更新数据
 async songCut(pubsub,id){
    // 获取当前歌曲信息
    await this.getSongInfo(id)
    // 更新地址信息
    await this.getMusicUrl(id)
    this.setIsPlayState(true)  //修改状态
    this.handleMusicPlay(true) //自动播放
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 存储当前id
    this.setData({
      musicId:options.id
    })
    this.getSongInfo(options.id)  //获取音乐信息

    // 判断当前音乐是不是上一首播放的，如果是，那么地址就不请求，之间获取，并且同步上一首音乐的播放状态
    if(appInstance.globalData.isMusicPlay&&appInstance.globalData.musicId === options.id){
      this.setData({
        isPlay:appInstance.globalData.isMusicPlay,
        musicUrl:appInstance.globalData.musicUrl
      })
    }else {
      this.getMusicUrl(options.id)  //获取音乐地址
    }

    this.backgroundAudio = wx.getBackgroundAudioManager()  //创建当前音乐id的播放管理器
    //  监听播放状态，使内外状态一致
    // 监听暂停状态
    this.backgroundAudio.onPause(()=>{
      this.setIsPlayState(false)
    })
    // 监听播放状态
    this.backgroundAudio.onPlay(() => {
      this.setIsPlayState(true)
      appInstance.globalData.musicId = this.data.musicId //音乐id
      appInstance.globalData.musicUrl = this.data.musicUrl//音乐地址
    });
    // 监听外部关闭程序音乐播放时的回调
    this.backgroundAudio.onStop(() => {
      this.setIsPlayState(false);
    });
    // 进度条监听事件
    this.backgroundAudio.onTimeUpdate(()=>{
      let currentTime = this.getTime(this.backgroundAudio.currentTime*1000)
      let currentProgress = (this.backgroundAudio.currentTime/this.backgroundAudio.duration)*100
      this.setData({
        currentTime,
        currentProgress
      })
    })
    // 监听音乐自动播放结束
    this.backgroundAudio.onEnded(()=>{
      PubSub.publish("nextPerCut","next")
    })


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    PubSub.subscribe("songCut",this.songCut)
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