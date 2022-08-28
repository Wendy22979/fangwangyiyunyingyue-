import config from "./config"
let  cookies = wx.getStorageSync('cookies')?wx.getStorageSync('cookies'):""
let  cookie = ""
if(cookies !== ""){
  let index = cookies.findIndex((item)=>{
    return item.indexOf("MUSIC_U") !== -1
  })
  cookie =  cookies[index]
}

export default (url,data,mothed)=>{
  return new Promise((resolve,reject)=>{
    wx.request({
      url: config.base + url,
      data,
      mothed,
      header:{
        cookie:cookie
      },
      success:(res)=>{
        resolve(res)
      },
      fail:(error)=>{
        reject(error)
      },
    })
  })
}