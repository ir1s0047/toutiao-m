// 引入dayjs
import dayjs from 'dayjs'
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

// 配置中文包
require('dayjs/locale/zh-cn')
dayjs.locale('zh-cn')

export default dayjs
