import request from '@/utils/request'
import da from 'element-ui/src/locale/lang/da'

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

// 新增菜单
export function addOneMenu(data) {
  return request({
    url: 'vue-admin-template/menu/addOne',
    method: 'post',
    data
  })
}
