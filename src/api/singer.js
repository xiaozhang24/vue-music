import jsonp from 'common/js/jsonp'
import {options, commonParams} from './config'

export function getSingerList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    key: 'all_all_all',
    page: 'list',
    g_tk: 791819240,
    jsonpCallback: 'GetSingerListCallback',
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0
  })
  return jsonp(url, data, options)
}

export function getSingerDetail(singerid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  const data = Object.assign({}, commonParams, {
    singermid: singerid,
    format: 'jsonp',
    platform: 'yqq',
    needNewCode: 0,
    order: 'time',
    from: 'h5',
    num: 30,
    begin: 0
  })
  return jsonp(url, data, options)
}

export function getSongLyric(songmid) {
  const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
  const data = Object.assign({}, commonParams, {
    g_tk: 791819240,
    songmid: songmid,
    jsonpCallback: 'MusicJsonCallback_lrc',
    loginUin: 351732544,
    hostUin: 0,
    format: 'jsonp',
    platform: 'yqq'
  })
  return jsonp(url, data, options)
}