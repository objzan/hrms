import request from '@/utils/request.js'

/**
 *获取员工列表数据
 * @param {*} params
 * @returns Promise对象
 */
export const getEmployeeListAPI = params => {
  return request({
    url: '/sys/user',
    params
  })
}

/**
 * 添加员工
 * @param {*} data
 * @returns Promise对象
 */
export const addEmployeeAPI = data => {
  return request({
    url: '/sys/user',
    method: 'POST',
    data
  })
}

/**
 * 根据员工id删除员工
 * @param {*} id
 * @returns Promise对象
 */
export const deleteEmployeeAPI = id => {
  return request({
    url: `/sys/user/${id}`,
    method: 'DELETE'
  })
}

/**
 * 批量导入员工信息
 * @param {*} data
 * @returns Promise对象
 */
export const importEmployeeAPI = data => {
  return request({
    url: '/sys/user/batch',
    method: 'POST',
    data
  })
}
/**
 * 根据id更新用户名和密码
 * @param {*} data
 * @returns Promise对象
 */
export const saveUserDetailByIdAPI = data => {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'PUT',
    data
  })
}
