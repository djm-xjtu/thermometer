## 项目背景
聊城二院医护项目需求，需要用H5做一个体温单，由于和花都体温单区别很多，原有体温单无法满足需求，所以分了一个新项目。

聊城项目是复制了花都项目出来改，所以结构大致一样，只有一些具体的体温单展示规则有区别，此文档只重点说明和花都体温单有区别的部分。

## 项目线上链接
<http://120.224.211.7:9091/temperature/#/?PatientId=&VisitId=&StartTime=>
其中链接末尾参数PatientId，VisitId，StartTime可以根据需要可以动态配置，项目里会根据这些参数请求平台接口数据进行展示。
## 项目代码简介
### （1）脉搏和心率需要画多边形，并且加上斜线阴影
将脉搏和心率抽出来单独处理，描完点后使用zrender.Polygon()画多边形，阴影则用canvas画一根斜线填充到多边形里即可
```js
createPolygon({ points, lineWidth, color, zlevel = 0 }) {
  const canvas = document.createElement('canvas')
  canvas.width = 10
  canvas.height = 10
  const ctx = canvas.getContext('2d')
  ctx.moveTo(canvas.width, 0)
  ctx.lineTo(0, canvas.height)
  ctx.lineWidth = 1
  ctx.strokeStyle = 'red'
  ctx.stroke()

  const polygon = new zrender.Polygon({
    zlevel,
    shape: {
      points,
      smooth: 0,
      smoothConstraint: 0,
    },
    style: {
      lineWidth,
      stroke: color,
      fill: {
        image: canvas
      }
    }
  })
  this.zr.add(polygon)
},
```
### (2) 降温和疼痛干预需要吊灯笼
以降温为例：在体温描点时，判断降温列表里有没有时间点和当前体温一样的，一样的话说明此时有吊灯笼，直接画线描点即可
```js
// 画降温
for (let i = this.coolList.length - 1; i >= 0; i--) {
  const item = this.coolList[i]
  const coolX = this.getXaxis(this.getLocationTime(item.time))
  const coolY = this.getYaxis(yRange, item.value, vitalCode)
  if (coolX === cx) {
    this.createCircle({
      cx: coolX,
      cy: coolY,
      r: 4,
      color: 'red',
      zlevel: 10,
      tips: `${item.time} 降温：${item.value}`,
      dotSolid: false
    })
    this.createLine({
      x1: cx,
      y1: cy,
      x2: coolX,
      y2: coolY,
      lineWidth: 1,
      color: 'red',
      zlevel: 1,
      lineDash: [3, 3]
    })
    this.coolList.splice(i, 1)
  }
}
```
疼痛干预的吊灯笼同理
### (3) 体温画复试
与上次记录的体温相比上升(1.5℃)或下降(2℃)，入院首次体温≥38℃。这两种情况需要画复试标识
```js
// 画复试
const createRepeatTest = () => {
  this.createText({
    x: cx + 8,
    y: cy - 20,
    value: 'v',
    color: 'red',
    tips: '体温复试',
    fontWeight: 'bold',
    zlevel: 10,
    fontSize: 18,
  })
}
if (index > 0) {
  // 与上次记录的体温相比上升(1.5℃)或下降(2℃)
  if (x.value - data[index - 1].value >= 1.5 || x.value - data[index - 1].value <= -2) {
    createRepeatTest()
  }
} else if (index === 0 && this.currentPage === 1) {
  // 入院首次体温≥38℃
  const list = [
    {
      vitalCode: '041',
      ...this.settingMap.oralTemperature.data[0]
    },
    {
      vitalCode: '042',
      ...this.settingMap.axillaryTemperature.data[0]
    },
    {
      vitalCode: '043',
      ...this.settingMap.analTemperature.data[0]
    },
    ].filter(x => Object.keys(x).length > 1).sort((a, b) => this.getTimeNum(a.time) - this.getTimeNum(b.time))
  if (vitalCode === list[0].vitalCode && Number(list[0].value) >= 38) {
    createRepeatTest()
  }
}
```
### (4) 心率和脉搏和体温重叠后画圈
判断心率脉搏和体温描点圆心重合时，改变画圆规则即可
```js
// 如果脉搏或心率和体温坐标重叠，改成在体温标识外面画红色的圆圈
if (vitalCode === '02' || vitalCode === '20') {
  const tList = [
    ...this.settingMap.oralTemperature.data, 
    ...this.settingMap.axillaryTemperature.data, 
    ...this.settingMap.analTemperature.data
  ].map(x => {
    return {
      x: this.getXaxis(this.getLocationTime(x.time)),
      y: this.getYaxis(this.yRange, x.value),
    }
  })
  const sameAxisItem = tList.find(x => x.x === cx && x.y === cy)
  if (sameAxisItem) {
    params = {
      cx,
      cy,
      r: 8,
      color: 'red',
      zlevel: 9,
      tips: `${x.time} ${label}：${x.value}`,
      dotSolid: false
    }
  }
}
this.createCircle(params)
```
### (5) 手术后天数
需求：连续填写7天，如在7天内又做手术，则第2次手术天数作为分子第一次手术天数作为分母填写，例：第一次手术1天又做第二次手术，即写1(2),1/2,2/3…7/8，连续填写至末次手术的第7天。换页后继续书写手术天数，直至末次手术满7天为止，主要计算逻辑在这里
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
    const apart = [] // 存储当天和前面手术的天数间隔
    for (let i = 0; i < index; i++) {
      apart.unshift(days[i])
    }
    if (days[index] <= 7) {
      return index === 0
        ? days[index]
        : (days[index] === 0 ? `${apart.join('/')}(${apart.length+1})` : `${days[index]}/${apart.join('/')}`)
    } else {
      return ''
    }
  })
},
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

npm run dev:liaoCheng 启动本地开发

npm run build:liaoCheng 打包构建，最后打包资源都在dist文件夹里
### 项目部署
将打包出来的dist文件资源放到服务器上，配置nginx代理，现在放的服务器ip为120.224.211.7，文件夹为temperature，代理在9091端口