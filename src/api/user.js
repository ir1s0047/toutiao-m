import request from '@/utils/request'
/**
 *
 * @param {String} mobile
 * @param {String} code
 * @returns
 */
export const login = (mobile, code) => {
  return request({
    url: '/v1_0/authorizations',
    method: 'POST',
    data: { mobile, code }
  })
}

// 发送验证码
/**
 *
 * @param {String} mobile
 * @returns
 */
export const sendCode = (mobile) => {
  return request({
    url: `/v1_0/sms/codes/${mobile}`
  })
}

export const getUserInfo = () => {
  return request({
    url: '/v1_0/user'
  })
}

/**
 * 添加关注
 */
export const addFollow = (userId) => {
  return request({
    method: 'POST',
    url: '/v1_0/user/followings',
    data: {
      target: userId
    }
  })
}

/**
 * 取消关注
 */
export const deleteFollow = (userId) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/user/followings/${userId}`
  })
}

// 获取用户个人资料
export const takeUserInfo = () => {
  return request({
    url: '/v1_0/user/profile'
  })
}

/**
 * 更新昵称
 */
export const updateUserName = (data) => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/profile',
    data
  })
}

export const updateUserPhotoAPI = (fd) => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/photo',
    data: fd
  })
}
