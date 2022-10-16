import request from '@/utils/request'

/**
 *
 * @param {*} data 登录
 * @returns Promise对象
 */
export const loginAPI = data => {
  return request({
    url: '/sys/login',
    method: 'POST',
    data
  })
}
