import request from "../../utils/request"
let flag = true//用作节流处理，false表示正在执行不可进
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent:"",//默认搜索关键字
    hotSearchList:[],//热搜列表
    historyList:[],//历史列表
    searchContent:"",//搜索的内容
    searchCList:[],//搜素列表
  },
  // 获取默认搜索关键字
  async getPlaceholderContent(){
    try{
    let res = await request("/search/default")
    this.setData({
      placeholderContent:res.data.data.showKeyword
    })
    }catch(error){
    console.log(error)
    }
  },
  // 获取热搜榜的数据
  async  getHotSearchList(){
    try{
     let res = await request("/search/hot/detail")
     this.setData({
      hotSearchList:res.data.data
     })
    }catch(error){
    console.log(error)
    }
  },
  // 发送请求,模糊匹配搜索内容并更新数据
  async getSearchList(keywords){
    try{
    let res = await request("/search",{keywords,limit:10})
    this.setData({
      searchCList:res.data.result.songs
    })
    flag = true// 表示执行完毕，可以进入
    }catch(error){
    console.log(error)
    }
  },
  // input事件
 handleInputChange(e){
    let searchContent = e.detail.value.trim()
    // 搜集修改输入内容
    this.setData({
      searchContent,
    })
    if(searchContent.trim() === ""){  //输入内容为空则不搜索
      return
    }
    // 节流阀
    if(flag){
      flag = false //表示正在执行不可进了
      // 节流
      setTimeout(()=>{
         // 搜索匹配模糊内容
       this.getSearchList(searchContent)
      },300)
    }
   
  },
  // 清除功能
  clear(){
    // 内容为空，列表为空
    this.setData({
      searchContent:"",
      searchCList:[]
    })
  },
  // 点击搜索，搜索对应歌曲,这里没有接口，所以不做请求，但是添加历史接口
  searchSong(){
  let {historyList,searchContent} = this.data
  if(!searchContent) return   //搜索内容为空则不请求
  //  发起请求获取歌曲列表


  // 添加到历史列表  ,如果列表数据有相同的，就提到前面展示，不重复添加
  let index = historyList.findIndex((item)=>{
    return item === searchContent
  })
  console.log(index)
  if(index>0){
    historyList.splice(index,1)
  }
  historyList.unshift(searchContent)
  this.setData({
    historyList,
  })
  // 本地存储
  wx.setStorageSync("historyList",JSON.stringify(historyList))
   // 清空模糊匹配搜索列表
   this.clear()

  },
  // 清楚历史记录
  deleteSearchHistory(){
    wx.showModal({
      content:"确认要删除吗？",
      success:(res)=>{
       if(res.confirm){ //确认
        // 清除历史记录
         this.setData({
          historyList:[] 
         })
        // 清除缓存
        wx.removeStorageSync("historyList")
       }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
   this.getPlaceholderContent()
   this.getHotSearchList()
     // 获取本地历史记录
   let historyList = wx.getStorageSync("historyList")
   if(historyList){
      this.setData({
        historyList:JSON.parse(historyList)
      })
   }

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