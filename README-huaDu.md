## 项目背景
花都人医医护项目需求，需要用H5做一个通用的体温单
## 项目仓库链接
<http://dev.cr-health.com:380/middleware-front/thermometer>
## 项目线上链接
<http://120.238.239.27:9091/temperature/#/?PatientId=595603&VisitId=1&StartTime=2020-12-01>

其中链接末尾参数PatientId，VisitId，StartTime可以根据需要可以动态配置，项目里会根据这些参数请求平台接口数据进行展示。
## 项目代码简介
由vue-cli4脚手架快速搭建生成，主要代码都在thermometer.vue文件里面，后续修改也主要是在这个文件修改。
项目需求难点在中间的网格部分，主要使用到的依赖包是一个canvas类库zrender。
### （1）画网格
画竖线：根据开始时间和结束时间，还有网格最小时间间隔计算出竖线的总条数，根据竖线总条数和每条线的间隔使用遍历画线
```js
yLine() {
  const totalLine =
    this.yRange[1] -
    this.yRange[0] +
    1 +
    (this.yRange[1] - this.yRange[0]) * 4
  let preSpace = 0
  for (let i = 0; i < totalLine; i++) {
    const isBreak = i % 5 === 0 && i > 0 && i < totalLine - 1
    const isboundary = i === 0 || i === totalLine - 1
    const lineWidth = isBreak ? 2 : 1
    const params = {
      x1: 0,
      y1: preSpace,
      x2: this.areaWidth - 1,
      y2: preSpace,
      lineWidth,
      color: isBreak ? '#000' : isboundary ? 'transparent' : '#000'
    }
    preSpace += lineWidth + this.ySpace
    this.createLine(params)
  }
},
```
画横线：和画竖线同理，根据最小体温和最大体温来画
### （2）根据数据在网格描点
x轴坐标：根据时间点time_point和最大最小时间的间隔计算出百分比，映射到x轴的长度计算出相应的偏移像素值，偏移像素值就是画布上的x轴坐标
```js
// 根据时间点计算横坐标
getXaxis(time) {
  return (
    ((this.getTimeStamp(time) - this.getTimeStamp(this.timeRange[0])) /
      (this.getTimeStamp(this.timeRange[1]) -
        this.getTimeStamp(this.timeRange[0]))) *
    this.areaWidth
  )
},
```
y轴坐标：和计算x轴坐标同理，如体温的话就根据最大最小体温去计算百分比
### （3）将多个点用线连接起来形成折线效果
在遍历数组数据描点的同时，将前一个点作为起点，后一个点作为终点，描点同时画线即可
### （4）表顶注释、表底注释和折线折点的定位
医院有特殊的定位规则，需要按一定规则落点在格子中间，需要将一定时间段映射为格子中间的时间点，再根据确定的时间点换算出横坐标，具体逻辑在这里：
```js
getLocationTime(time) {
  const sec = this.getTotalSeconds(time.slice(-8))
  let str = ''
  const timeAreasMap = {
    '02:00:00': ['00:00:00', '06:00:59'],
    '06:00:00': ['06:01:00', '10:00:59'],
    '10:00:00': ['10:01:00', '14:00:59'],
    '14:00:00': ['14:01:00', '18:00:59'],
    '18:00:00': ['18:01:00', '22:00:59'],
    '22:00:00': ['22:01:00', '23:59:59']
  }
  for (let key in timeAreasMap) {
    if (timeAreasMap.hasOwnProperty(key)) {
      const item = timeAreasMap[key]
      if (
        sec >= this.getTotalSeconds(item[0]) &&
        sec <= this.getTotalSeconds(item[1])
      ) {
        str = key
        break
      }
    }
  }
  return `${time.slice(0, -8)}${str}`
},
```
### （5）手术或产后天数
这个需求计算有点复杂，第一次手术需要显示0天，之后一直显示到术后10天，即0~10，插入第二次手术的话会中断成显示II-0...II-10，插入第三次变成III-0...III-10以此类推，主要计算逻辑在这里
```js
formatOperateDateList() {
  return this.dateList.map((x) => {
    if (this.dayInterval(x, this.parseTime(new Date(), '{y}-{m}-{d}')) > 0)
      return ''
    if (!this.operateDateList.length) return ''
    // 构造天数差数组，有相同天数差的说明在同一天，所以要去重
    const days = [
      ...new Set(
        this.operateDateList.map((y) => {
          return this.dayInterval(x, y)
        })
      )
    ]
    if (days.every((z) => z < 0)) return ''
    // 找到前一次手术（最后一次天数差是正整数的地方）
    let index = 0
    for (let i = 0; i < days.length; i++) {
      if (days[i] >= 0) index = i
    }
    if (days[index] <= 10) {
      return index === 0
        ? days[index]
        : `${this.numToRome(index + 1)}-${days[index]}`
    } else {
      return ''
    }
  })
},
```
### （6）表底的数据填入（呼吸、入量那些）
根据最大时间和最小时间，做一个累加遍历，根据时间点time_point判断数据落点，构造一个新的渲染数组。
```js
// 计算底部数据的渲染列表
getFormatList({ tList, timeInterval = 24 * 60 * 60 * 1000 }) {
  const timeNumRange = this.timeRange.map((x) => this.getTimeNum(x))
  const list = []
  const targetList = [...tList]
  for (let i = timeNumRange[0]; i < timeNumRange[1]; i += timeInterval) {
    const item = { timeNum: i, value: '' }
    for (let j = targetList.length - 1; j >= 0; j--) {
      const timeNum = this.getTimeNum(targetList[j].time)
      if (timeNum >= i && timeNum < i + timeInterval) {
        item.value = targetList[j].value
        targetList.splice(j, 1)
        break
      }
    }
    list.push(item)
  }
  return list
},
```
### （7）分页
因为一页最多能显示7天，如果时间点time_point跨度比较大，大于7天就需要分页展示，因为开始时间固定为入院时间，所以根据入院时间累加7天，保证每个time_piont都能包含在内，在累加的过程中同时构造每一页的最大最小时间跨度，后续点击分页的时候只需修改时间跨度就行
```js
// 计算最大标识时间
const maxTimeNum = Math.max.apply(null, vitalSigns.map(x => new Date(x.time_point).getTime()))
const admissionDateNum = new Date(`${this.patInfo.admission_date.slice(0, 10)} 00:00:00`).getTime()
// 根据入院时间和最大标识时间计算出页数和每页的时间范围
const dateRangeList = []
for (let i = admissionDateNum; i < maxTimeNum; i += 7 * 24 * 60 * 60 * 1000) {
  dateRangeList.push([this.parseTime(i, '{y}-{m}-{d}'), this.parseTime(i+6 * 24 * 60 * 60 * 1000, '{y}-{m}-{d}')])
}
this.dateRangeList = dateRangeList
this.pageTotal = dateRangeList.length
```
现在内部分页操作是做在体温单下面，默认隐藏，如果连接上拼接了showInnerPage=1就会在下面显示出来。

如果需要在iframe外面做分页操作，则需要用postMessage进行页面通信。
#### 使用postMessage在体温单iframe外部做分页
只需在体温单iframe内部传出总页数给到父页面，父页面切换页数时将当前页传给体温单iframe即可

在体温单中
```js
watch: {
  // 因为分页可能在体温单外面，所以给父页面传递pageTotal
  pageTotal(value) {
    window.parent.postMessage({ type: 'pageTotal', value }, '*')
  }
},
created() {
  // 实现外部分页
  window.addEventListener('message', this.messageHandle, false)
},
beforeDestroy() {
  window.removeEventListener('message', this.messageHandle, false)
},
methods:{
  messageHandle(e) {
    if (e && e.data && e.data.type === 'currentPage' && e.data.value > 0) {
      this.currentPage = e.data.value
      document.getElementById('main').innerHTML = ''
      this.reset()
      this.handleData()
    }
  },
}
```
在父页面中
```js
watch: {
  currentPage(value) {
    this.$refs.myIframe.contentWindow.postMessage({ type: 'currentPage', value }, '*')
  }
},
created() {
  window.addEventListener('message', this.messageHandle, false)
},
beforeDestroy() {
  window.removeEventListener('message', this.messageHandle, false)
},
methods: {
  messageHandle(e) {
    if (e && e.data && e.data.type === 'pageTotal') {
      this.pageTotal = e.data.value
    }
  }
}
```
## 假数据
假数据写在mockData.js文件里，需要使用假数据时将useMockData改为true即可，记得打包成dist之前将useMockData改为false，不然部署线上后不会使用接口返回的数据。
## 接口请求
使用axios依赖包，请求路径/crHesb/hospital/common，如果前端资源在线上的话请求地址和服务器所在地址一致。
```js
this.$http({
  method: 'post',
  url: '/crHesb/hospital/common',
  data: {
    tradeCode: 'nurse_getPatientVitalSigns',
    PatientId: urlParams.PatientId,
    VisitId: urlParams.VisitId,
    StartTime: urlParams.StartTime
  }
}).then((res) => {
  this.apiData = this.handleOriginData(res.data)
  this.$nextTick(() => {
    this.handleData()
  })
})
```
本地开发时请求接口需要使用webpack中的devServer进行代理，不然会有跨域问题
(使用nginx反向代理也可)
```js
devServer: {
  proxy: {
    '/': {
      target: (() => {
        switch(project) {
          case 'huaDu': return 'http://120.238.239.27:9091'
          case 'liaoCheng': return 'http://120.224.211.7:9091'
          default: break
        }
      })(),
      changeOrigin: true,
    },
  },
},
```
### 项目运行命令
npm install  安装依赖包

npm run dev:huaDu 启动本地开发

npm run build:huaDu 打包构建，最后打包资源都在dist文件夹里
### 项目部署
将打包出来的dist文件资源放到服务器上，配置nginx代理，现在放的服务器ip为120.238.239.27，文件夹为temperature，代理在9091端口