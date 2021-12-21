let project = 'huaDu' // 默认是跑花都的体温单项目
/**
 * 处理参数
 */
const argvs = process.argv.slice(3)
for (const argv of argvs) {
  const res = argv.match(/--(.*?)=(.*)/)
  if (res[0]) {
    const field = res[1]
    const value = res[2]
    switch (field) {
      case 'project':
        project = value
        break
      default:
        break
    }
  }
}

module.exports = { project }
