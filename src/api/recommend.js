import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
// import axios from 'axios'

export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  const data = Object.assign({}, commonParams, {
    g_tk: 1880152653,
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })
  return jsonp(url, data, options)
}

// export function getDiscList() {
//   const url = './data.json'

//   const data = Object.assign({}, commonParams, {
//     platform: 'yqq',
//     needNewCode: 0,
//     rnd: Math.random(),
//     categoryId: 10000000,
//     g_tk: 791819240,
//     hostUin: 0,
//     sortId: 5,
//     sin: 0,
//     ein: 29,
//     jsonpCallback: 'getPlaylist',
//     picmid: 1
//   })
//   return axios.get(url, {
//     params: data
//   }).then((res) => {
//     return Promise.resolve(res.data)
//   })
// }
// export function getDiscList() {
//   const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
//   const data = Object.assign({}, commonParams, {
//     g_tk: 5381,
//     platform: 'h5',
//     uin: 0,
//     needNewCode: 1
//   })
//   return jsonp(url, data, options)
// }

// export function getDiscInfo(disstid) {
//   const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'

//   const data = Object.assign({}, commonParams, {
//     disstid: disstid,
//     json: 1,
//     type: 1,
//     g_tk: 791819240,
//     platform: 'yqq',
//     format: 'jsonp',
//     uin: 0,
//     jsonpCallback: 'playlistinfoCallback',
//     needNewCode: 0,
//     onlysong: 0
//   })
//   return axios.get(url, {
//     params: data
//   }).then((res) => {
//     return Promise.resolve(res.data)
//   })
// }