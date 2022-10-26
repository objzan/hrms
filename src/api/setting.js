import request from '@/utils/request'

/**
 * 获取所有角色数据
 * @param {*} params {page:页数，pagesize:数据条数}
 * @returns Promise对象
 */
export const getRolesAPI = params => {
  return request({
    url: '/sys/role',
    params
  })
}

/**
 * 根据用户id获取公司信息
 * @param {*} companyId
 * @returns Promise对象
 */
export const getCompanyInfoAPI = companyId => {
  return request({
    url: `/company/${companyId}`
  })
}

/**
 * 添加角色
 * @param {*} data
 * @returns Promise对象
 */
export const addRolesAPI = data => {
  return request({
    url: '/sys/role',
    method: 'POST',
    data
  })
}

/**
 * 根据id获取角色信息
 * @param {*} id
 * @returns Promise对象
 */
export const getRolesInfoAPI = id => {
  return request({
    url: `/sys/role/${id}`
  })
}

/**
 * 编辑>修改角色详情
 * @param {*} id
 * @param {*} data
 * @returns Promise对象
 */
export const editRolesAPI = data => {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'PUT',
    data
  })
}

/**
 * 根据id删除角色
 * @param {*} id
 * @returns Promise对象
 */
export const deleRolesAPI = id => {
  return request({
    url: `/sys/role/${id}`,
    method: 'DELETE'
  })
}
