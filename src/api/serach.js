import request from '@/utils/request'

/**
 *
 * @param {String} q 搜索建议的关键词
 * @returns
 */
export const getSearchSuggestion = (q) => {
  return request({
    url: '/v1_0/suggestion',
    params: {
      q
    }
  })
}

export const getSearchList = (params) => {
  return request({
    url: '/v1_0/search',
    params
  })
}
