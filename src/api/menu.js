import request from '@/utils/request'

// 查询菜单树形结构
export function getRouteList() {
  return request({
    url: 'vue-admin-template/route/getRoutes',
    method: 'get'
  })
}

// 查询菜单列表
export function getRouteLists() {
  return request({
    url: 'vue-admin-template/route/getRouteList',
    method: 'get'
  })
}
