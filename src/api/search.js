import jsonp from 'common/js/jsonp'
import {options, commonParams} from './config'

export function getHotKey() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    uin: 0,
    _: 1517211339865
  })
  return jsonp(url, data, options)
}

export function search(query, page, zhida) {
  const url ="https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp"
  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    platform: 'h5',
    format: 'jsonp',
    needNewCode: 1,
    w: query,
    zhidaqu: 1,
    catZhida: zhida ? 1 : 0,
    p: page,
    ie: 'utf-8',
    t: 0,
    sem: 1,
    flag: 1,
    aggr: 1,
    perpage:20,
    n: 20,
    remoteplace: 'txt.mqq.all'
  })

  return jsonp(url, data, options)
}