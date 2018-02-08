import jsonp from 'common/js/jsonp'
import {options, commonParams} from './config'

export function getRankList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'

  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    format: 'jsonp',
    platform: 'h5',
    needNewCode: 1,
    uin: 0,
    _: 1516266935541
  })
  return jsonp(url, data, options)
}

export function getTopMusicList(topid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'

  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    platform: 'h5',
    needNewCode: 1,
    uin: 0,
    type: 'top',
    page: 'detail',
    tpl: 3,
    topid: topid,
    _: 1516949354957
  })
  return jsonp(url, data, options)
}