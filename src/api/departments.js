import request from '@/utils/request'

export const departmentsListAPI = () => {
  return request({
    url: '/company/department'
  })
}

export const getEmployeeSimpleAPI = () => {
  return request({
    url: '/sys/user/simple'
  })
}

export const addDepartmentsAPI = data => {
  return request({
    url: '/company/department',
    method: 'POST',
    data
  })
}

export const getDepartDetailAPI = departId => {
  return request({
    url: `/company/department/${departId}`
  })
}

export const updateDepartmentsAPI = data => {
  return request({
    url: `/company/department/${data.id}`,
    method: 'PUT',
    data
  })
}

export const delDepartmentAPI = id => {
  return request({
    url: `/company/department/${id}`,
    method: 'DELETE'
  })
}
