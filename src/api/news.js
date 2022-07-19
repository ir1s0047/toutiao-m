import request from '@/utils/request'

/**
 * @param {*} channelId
 * @param {*} timestamp
 * @returns
 */

export const getArticleList = (channelId, timestamp) => {
  return request({
    url: '/v1_0/articles',
    params: {
      channel_id: channelId,
      timestamp
    }
  })
}
