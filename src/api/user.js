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

/**
 * 获取用户信息
 * @returns Promise对象
 */
export const getUserProfileAPI = () => {
  return request({
    url: '/sys/profile',
    method: 'POST'
  })
}

/**
 * 获取用户信息
 * @param {*} id
 * @returns Promise对象
 */
export const getUserStaffPhotoAPI = id => {
  return request({
    url: `/sys/user/${id}`
  })
}
