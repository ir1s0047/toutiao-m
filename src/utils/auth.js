import storage from './storage'

const TOKEN_KEY = 'heima_toutiao_token'

export const getToken = () => storage.get(TOKEN_KEY)

export const setToken = (token) => storage.set(TOKEN_KEY, token)

export const removeToken = () => storage.remove(TOKEN_KEY)
