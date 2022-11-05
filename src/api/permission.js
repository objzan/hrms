import request from '@/utils/request.js'

/**
 * 获取所有权限点
 * @returns Promise对象
 */
export const getPermissionListAPI = () => {
  return request({
    url: '/sys/permission'
  })
}

/**
 * 添加权限点
 * @param {*} data
 * @returns Promise对象
 */
export const addPermissionAPI = data => {
  return request({
    url: '/sys/permission',
    method: 'POST',
    data
  })
}

/**
 * 根据ID获取权限点详情
 * @param {*} id
 * @returns Promise对象
 */
export const getPermissionByIdAPI = id => {
  return request({
    url: `/sys/permission/${id}`,
    method: 'GET'
  })
}

/**
 * 根据ID更新权限点详情
 * @param {*} id
 * @param {*} data
 * @returns Promise对象
 */
export const updatePermissionAPI = (id, data) => {
  return request({
    url: `/sys/permission/${id}`,
    method: 'PUT',
    data
  })
}

/**
 * 根据id删除权限点
 * @param {*} id
 * @returns Promise对象
 */
export const deletePremissionAPI = id => {
  return request({
    url: `/sys/permission/${id}`,
    method: 'DELETE'
  })
}

/**
 * 给角色分配权限
 * @param {*} data
 * @returns Promise对象
 */
export const assignPremissionAPI = data => {
  return request({
    url: '/sys/role/assignPrem',
    method: 'PUT',
    data
  })
}
