import request from '@/utils/request'
import { string } from 'clipboard'




export function getCPUtotal() {
  return request({
    url: '/cpu_usage',
    method: 'get',
  })
}


export function getMEMtotal() {
  return request({
    url: '/mem_usage',
    method: 'get',
  })
}

export function getAlarmInstant() {
  return request({
    url: '/alarm_instant',
    method: 'get',
  })
}