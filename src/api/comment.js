/**
 * 评论接口模块
 */
import request from '@/utils/request'

/**
 * 获取文章列表
 */
export const getComments = (params) => {
  return request({
    method: 'GET',
    url: '/v1_0/comments',
    params
  })
}

export const addComments = (data) => {
  return request({
    method: 'POST',
    url: '/v1_0/comments',
    data
  })
}
