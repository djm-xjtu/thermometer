<template>
  <div
    class="main-view"
    :style="{ width: `${leftWidth + areaWidth}px` }"
    v-if="apiData"
  >
    <div class="head-hos">贵州省人民医院</div>
    <div class="head-title">体温单</div>
    <div class="head-info">
      <div class="item">
        姓名<span class="value">&emsp;{{ patInfo.name }}&emsp;</span>
      </div>
      <div class="item">
        科别<span class="value"
          >&emsp;{{ adtLog || patInfo.dept_name }}&emsp;</span
        >
      </div>
      <div class="item">
        床号<span class="value"
          >&emsp;{{ bedExchangeLog || patInfo.bed_label }}&emsp;</span
        >
      </div>
      <div class="item">
        入院日期<span class="value"
          >&emsp;{{ patInfo.admission_date.slice(0, 10) }}&emsp;</span
        >
      </div>
      <div class="item">
        住院号<span class="value">&emsp;{{ patInfo.patient_id }}&emsp;</span>
      </div>
    </div>
    <div class="table-area">
      <div class="hline"></div>
      <div
        class="vline"
        :style="{
          top: 0,
          bottom: '2px',
          transform: 'translateX(-0.5px)'
        }"
      ></div>
      <div
        class="vline"
        :style="{
          left: `${leftWidth - 1}px`,
          top: 0,
          bottom: '2.5px',
          transform: 'translateY(0.5px)',
          'border-color': 'red'
        }"
      ></div>
      <div
        class="vline"
        :style="{
          right: 0,
          'border-color': 'red',
          top: 0,
          bottom: '40px',
          transform: 'translateY(0.5px)'
        }"
      ></div>
      <div
        class="vline"
        :style="{
          right: 0,
          'border-color': 'black',
          bottom: '1px',
          top: `${areaHeight + 5 * trHeight}px`,
          'z-index': 40,
          transform: 'translateY(0.5px)'
        }"
      ></div>
      <div class="table-box" style="transform: translateY(0.5px);">
        <div
          class="vtline"
          :style="{ left: `${leftWidth + item * (6 * xSpace + 7) - 1}px` }"
          v-for="item in 6"
          :key="item"
        ></div>
        <div
          class="row border-bottom-black-2"
          :style="{ height: `${trHeight}px` }"
        >
          <div
            class="label"
            :style="{ width: `${leftWidth}px` }"
            v-html="`日&emsp;&emsp;期`"
          ></div>
          <div class="value-item-box">
            <div
              class="value-item"
              v-for="(item, index) in formatDateList"
              :key="index"
            >
              {{ item }}
            </div>
          </div>
        </div>
        <div
          class="row border-bottom-black-2"
          :style="{ height: `${trHeight}px` }"
        >
          <div class="label" :style="{ width: `${leftWidth}px` }">
            术后天数
          </div>
          <div class="value-item-box">
            <div
              class="value-item"
              v-for="(item, index) in formatOperateDateList"
              :key="index"
            >
              {{ item }}
            </div>
          </div>
        </div>
        <div
          class="row border-bottom-black-2"
          :style="{ height: `${trHeight}px` }"
        >
          <div class="label" :style="{ width: `${leftWidth}px` }">住院天数</div>
          <div class="value-item-box">
            <div
              class="value-item"
              v-for="(item, index) in formatStayDayList"
              :key="index"
            >
              {{ item }}
            </div>
          </div>
        </div>
        <div
          class="row border-bottom-black-2"
          :style="{ height: `${trHeight}px` }"
        >
          <div class="label" :style="{ width: `${leftWidth}px` }"></div>
          <div class="value-item-box">
            <div
              class="value-item"
              :style="middleTdStyle(index)"
              v-for="(item, index) in maTds"
              :key="index"
            >
              {{ item }}
            </div>
          </div>
        </div>
        <div
          class="row border-bottom-black-2"
          :style="{ height: `${trHeight}px` }"
        >
          <div class="label" :style="{ width: `${leftWidth}px` }">
            <span
              class="time-label"
              :style="`transform: translateY(-${trHeight / 2}px);`"
              v-html="`时&emsp;&emsp;间`"
            ></span>
          </div>
          <div class="value-item-box font-12">
            <div
              class="value-item"
              :style="smallTdStyle(index, timeTds.length)"
              v-for="(item, index) in timeTds"
              :key="index"
            >
              {{ item }}
            </div>
          </div>
        </div>
      </div>
      <div class="info-box">
        <div
          class="index-box"
          :style="{ height: `${areaHeight}px`, width: `${leftWidth}px` }"
        >
          <div class="item times">
            <div :style="`height: ${topAreaHeight}px`"></div>
            <div class="pain-area" :style="`height: ${painAreaHeight}px`">
              疼<br />痛<br />强<br />度
            </div>
            <div class="text" :style="`height: ${indexTextAreaHeight}px`">
              <div class="label" :style="{ height: `${trHeight}px` }">
                脉搏
              </div>
              <div>n/min</div>
            </div>
            <div class="index" v-for="item in pulseList" :key="item">
              <span>{{ item }}</span>
            </div>
          </div>
          <div class="item temp">
            <div :style="`height: ${topAreaHeight}px`"></div>
            <div class="pain-area" :style="`height: ${painAreaHeight}px`">
              <div class="pain-index" v-for="item in painList" :key="item">
                <span>{{ item === 4 || item === 7 ? item : `&emsp;` }}</span>
              </div>
            </div>
            <div class="text" :style="`height: ${indexTextAreaHeight}px`">
              <div class="label" :style="{ height: `${trHeight}px` }">
                体温
              </div>
              <div>℃</div>
            </div>
            <div class="index" v-for="item in temperaturelist" :key="item">
              <span>{{ item }}</span>
            </div>
          </div>
        </div>
        <div
          id="main"
          :style="{ width: `${areaWidth}px`, height: `${areaHeight}px` }"
        ></div>
      </div>
      <div class="table-box" style="transform: translateY(-0.5px);">
        <div
          class="vtline"
          :style="{
            left: `${leftWidth + item * (6 * xSpace + 7) - 1}px`,
            'border-color': '#000'
          }"
          v-for="item in 6"
          :key="item"
        ></div>
        <div
          class="row border-top-black-2"
          :style="{ height: `${trHeight * 2}px` }"
        >
          <div class="label" :style="{ width: `${leftWidth}px` }">
            呼吸(次/分)
          </div>
          <div class="value-item-box font-12">
            <div
              class="value-item"
              :style="{
                ...smallTdStyle(index, formatBreatheList.length),
                ...item.style,
                color: '#000'
              }"
              v-for="(item, index) in formatBreatheList"
              :key="index"
            >
              {{ item.value }}
            </div>
          </div>
        </div>
        <div class="row" :style="{ height: `${trHeight}px` }">
          <div class="label" :style="{ width: `${leftWidth}px` }">
            血压(mmHg)
          </div>
          <div class="value-item-box">
            <div
              class="value-item"
              :style="middleTdStyle(index)"
              v-for="(item, index) in formatPressureList"
              :key="index"
            >
              {{ item.value }}
            </div>
          </div>
        </div>
        <div class="row" :style="{ height: `${trHeight}px` }">
          <div class="label" :style="{ width: `${leftWidth}px` }">
            总入量(ml)
          </div>
          <div class="value-item-box">
            <div
              class="value-item"
              v-for="(item, index) in getFormatList({ tList: inputList })"
              :key="index"
            >
              {{ item.value }}
            </div>
          </div>
        </div>
        <div class="row" :style="{ height: `${trHeight}px` }">
          <div class="label" :style="{ width: `${leftWidth}px` }">
            总出量(ml)
          </div>
          <div class="value-item-box">
            <div
              class="value-item"
              v-for="(item, index) in getFormatList({ tList: outputList })"
              :key="index"
            >
              {{ item.value }}
            </div>
          </div>
        </div>
        <div class="row" :style="{ height: `${trHeight}px` }">
          <div class="label" :style="{ width: `${leftWidth}px` }">
            大便(次)
          </div>
          <div class="value-item-box">
            <div
              class="value-item"
              v-for="(item, index) in getFormatList({ tList: shitList })"
              :key="index"
            >
              {{ item.value }}
            </div>
          </div>
        </div>
        <div class="row" :style="{ height: `${trHeight}px` }">
          <div class="label" :style="{ width: `${leftWidth}px` }">体重(kg)</div>
          <div class="value-item-box">
            <div
              class="value-item"
              v-for="(item, index) in getFormatList({ tList: weightList })"
              :key="index"
            >
              {{ item.value }}
            </div>
          </div>
        </div>
        <div class="row" :style="{ height: `${trHeight}px` }">
          <div class="label" :style="{ width: `${leftWidth}px` }">身高(cm)</div>
          <div class="value-item-box">
            <div
              class="value-item"
              v-for="(item, index) in getFormatList({ tList: heightList })"
              :key="index"
            >
              {{ item.value }}
            </div>
          </div>
        </div>
        <div class="row" :style="{ height: `${trHeight}px` }">
          <div class="label" :style="{ width: `${leftWidth}px` }">尿量(ml)</div>
          <div class="value-item-box">
            <div
              class="value-item"
              v-for="(item, index) in getFormatList({ tList: urineList })"
              :key="index"
            >
              {{ item.value }}
            </div>
          </div>
        </div>
        <div class="row" :style="{ height: `${trHeight}px` }">
          <div class="label" :style="{ width: `${leftWidth}px` }">
            分娩
          </div>
          <div class="value-item-box">
            <div
              class="value-item"
              v-for="(item, index) in formatChildbirthDateList"
              :key="index"
            >
              {{ item }}
            </div>
          </div>
        </div>
        <!-- <div class="row" :style="{ height: `${trHeight}px` }">
          <div class="label" :style="{ width: `${leftWidth}px` }">
            引流量(ml)
          </div>
          <div class="value-item-box">
            <div
              class="value-item"
              v-for="(item, index) in getFormatList({ tList: yinliuList })"
              :key="index"
            >
              {{ item.value }}
            </div>
          </div>
        </div> -->
        <div class="row" :style="{ height: `${trHeight}px` }">
          <div class="label" :style="{ width: `${leftWidth}px` }">
            {{ customList0.label || '' }}
          </div>
          <div class="value-item-box">
            <div
              class="value-item"
              v-for="(item, index) in getFormatList({ tList: customList0 })"
              :key="index"
            >
              {{ item.value }}
            </div>
          </div>
        </div>
        <div class="row" :style="{ height: `${trHeight}px` }">
          <div class="label" :style="{ width: `${leftWidth}px` }">
            {{ customList1.label || '' }}
          </div>
          <div class="value-item-box">
            <div
              class="value-item"
              v-for="(item, index) in getFormatList({ tList: customList1 })"
              :key="index"
            >
              {{ item.value }}
            </div>
          </div>
        </div>
        <div class="row" :style="{ height: `${trHeight}px` }">
          <div class="label" :style="{ width: `${leftWidth}px` }">
            {{ customList2.label || '' }}
          </div>
          <div class="value-item-box">
            <div
              class="value-item"
              v-for="(item, index) in getFormatList({ tList: customList2 })"
              :key="index"
            >
              {{ item.value }}
            </div>
          </div>
        </div>
        <div
          class="row border-bottom-black-2"
          :style="{ height: `${trHeight}px` }"
        >
          <div class="label" :style="{ width: `${leftWidth}px` }">
            {{ customList3.label || '' }}
          </div>
          <div class="value-item-box">
            <div
              class="value-item"
              v-for="(item, index) in getFormatList({ tList: customList3 })"
              :key="index"
            >
              {{ item.value }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="pagination" v-if="showInnerPage">
      <!-- <i :disabled="currentPage === 1" @click="toPre" class="pre-icon"></i> -->
      <button :disabled="currentPage === 1" @click="toPre" class="pre-btn">
        上一页
      </button>
      <span>第{{ currentPage }}页/共{{ pageTotal }}页</span>
      <button
        :disabled="currentPage === pageTotal"
        @click="toNext"
        class="next-btn"
      >
        下一页
      </button>
      <!-- <i :disabled="currentPage === pageTotal" @click="toNext" class="next-icon"></i> -->
    </div>
    <div class="pagination" v-else>第{{ currentPage }}页</div>
  </div>
</template>

<script>
import zrender from 'zrender'
import { mockData } from 'src/projects/guiZhou/mockData.js'

export default {
  data() {
    const yRange = [34, 42]
    const pulseRange = [20, 180]
    const painRange = [0, 10]
    return {
      useMockData: true,
      apiData: '', // 接口数据
      zr: '',
      areaWidth: 0, // 网格区域的宽度
      areaHeight: 0, // 网格区域的高度
      xSpace: 18, // 纵向网格的间距
      ySpace: 16, //  横向网格的间距
      leftWidth: 90, // 左侧内容宽度
      xRange: [1, 8],
      yRange,
      pulseRange,
      painRange,
      settingMap: {
        oralTemperature: {
          vitalCode: 'kouTemperature',
          label: '口温',
          color: 'blue',
          solid: true,
          dotType: 'Circle',
          range: yRange,
          data: [
            // { time: '2019-05-15 07:10:00', value: 37 },
          ]
        },
        axillaryTemperature: {
          vitalCode: 'yeTemperature',
          label: '腋温',
          color: 'blue',
          lineColor: 'blue',
          dotType: 'Text',
          range: yRange,
          data: [
            // { time: '2019-05-15 07:10:00', value: 36.5 },
          ]
        },
        analTemperature: {
          vitalCode: 'gangTemperature',
          label: '肛温',
          color: 'blue',
          dotType: 'Circle',
          range: yRange,
          data: [
            // { time: '2019-05-15 07:10:00', value: 34 },
          ]
        },
        heart: {
          vitalCode: 'heartRate',
          label: '心率',
          color: 'red',
          dotType: 'Circle',
          range: pulseRange,
          data: [
            // { time: '2019-05-15 07:10:00', value: 140},
          ]
        },
        pulse: {
          vitalCode: 'pulse',
          label: '脉搏',
          color: 'red',
          solid: true,
          dotType: 'Circle',
          range: pulseRange,
          data: [
            // { time: '2019-05-15 07:10:00', value: 120},
          ]
        },
        pain: {
          vitalCode: 'ttpf',
          label: '疼痛',
          color: 'blue',
          solid: true,
          dotType: 'Circle',
          range: painRange,
          data: [
            // { time: '2019-05-15 07:10:00', value: 2},
          ]
        }
      }, // 折线部分
      topSheetNote: [
        // { time: '2019-05-15 07:10:00', value: '入院|' },
        // { time: '2019-05-15 10:10:00', value: '手术' },
      ], // 表顶注释
      bottomSheetNote: [
        // 贵州版将大部分表底注释并入表顶注释
        // { time: '2019-05-16 17:10:00', value: '外出' },
        // { time: '2019-05-19 20:10:00', value: '请假' },
        // { time: '2019-05-19 20:10:00', value: '不升' },
      ], // 表底注释  体温低于或等于35度则剔除，在体温单下面标注"不升"
      // topPulseNote: [
      //   // 贵州版不需要过快注释
      //   // { time: '2019-05-16 17:10:00', value: '过快' }
      // ], // 心率和脉搏过快超出体温单上限则剔除，在体温单上面标注"过快"
      breatheList: [
        // { time: '2019-05-18 03:12:00', value: '20' }
      ], // 呼吸
      pressureList: [], // 血压
      weightList: [], // 体重
      heightList: [], // 身高
      inputList: [], // 液体入量
      shitList: [], // 大便次数
      yinliuList: [], // 引流量
      urineList: [], // 尿量
      outputList: [], // 出量
      customList0: [], // 自定义1
      customList1: [], // 自定义2
      customList2: [], // 自定义3
      customList3: [], // 自定义4
      customList4: [], // 自定义5
      customList5: [], // 自定义6
      coolList: [], // 降温
      ttgyList: [], // 疼痛干预
      dateRangeList: [], // 数组长度决定页数
      patInfo: {
        patient_id: '',
        name: '',
        sex: '',
        dept_name: '', // 由于存在转科的情况，所以这个字段基本废弃
        bed_label: '', // 由于存在转床的情况，所以这个字段基本废弃
        visit_id: '',
        admission_date: this.parseTime(new Date()),
        age: ''
      },
      vitalSigns: [],
      typeMap: {
        nurseEvents: '病人事件', // 入院|,手术,分娩|,出院|,转入|,死亡|,排胎|,出生|,手术分娩|,手术入院|,转出|
        '4': '表底注释', // 拒测,不在,外出不升,请假,右PPD,左PPD,冰敷,退热贴,冷水枕,降温毯,温水浴,辅助呼吸,PDD停辅助呼吸   并入病人事件
        yeTemperature: '腋温',
        pulse: '脉搏',
        heartRate: '心率',
        breathe: '呼吸',
        bloodPressure: '血压',
        niaoliang: '尿量',
        ruliang: '入量',
        chuliang: '出量',
        weight: '体重',
        gangTemperature: '肛温',
        kouTemperature: '口温',
        '21': '发热体温',
        '22': '线上降温',
        breatheMachine: '呼吸机', // 前端并入呼吸
        excrement: '大便次数',
        '10': '引流量',
        '25': '护理事件',
        '27': '物理降温',
        '28': '呕吐量',
        '29': '在线降温',
        ttpf: '疼痛评分',
        height: '身高',
        downTemperature: '降温后',
        other1: '自定义1',
        other2: '自定义2',
        other3: '自定义3',
        other4: '自定义4',
        other5: '自定义5',
        other6: '自定义6'
      }, // vital_code是other的时候，是自定义字段，显示在体温表后面
      lineMap: {
        kouTemperature: 'oralTemperature',
        yeTemperature: 'axillaryTemperature',
        gangTemperature: 'analTemperature',
        heartRate: 'heart',
        pulse: 'pulse',
        ttpf: 'pain'
      },
      pageTotal: 1,
      currentPage: 1,
      showInnerPage: false, // 是否显示内部分页
      adtLog: '', // 转科
      bedExchangeLog: '' // 转床
    }
  },
  computed: {
    timeTds() {
      const list = [2, 6, 10, 14, 18, 22]
      const tds = []
      for (let i = 0; i < 7; i++) {
        tds.push(...list)
      }
      return tds
    },
    maTds() {
      const list = ['上午', '下午']
      const tds = []
      for (let i = 0; i < 7; i++) {
        tds.push(...list)
      }
      return tds
    },
    trHeight() {
      return this.ySpace
    },
    formatPressureList() {
      const timeNumRange = this.timeRange.map((x) => this.getTimeNum(x))
      const list = []
      const pressureList = [...this.pressureList]
      for (
        let i = timeNumRange[0];
        i < timeNumRange[1];
        i += 3 * 4 * 60 * 60 * 1000
      ) {
        const item = { timeNum: i, value: '' }
        for (let j = pressureList.length - 1; j >= 0; j--) {
          const timeNum = this.getTimeNum(pressureList[j].time)
          if (timeNum >= i && timeNum < i + 3 * 4 * 60 * 60 * 1000) {
            item.value = pressureList[j].value
            pressureList.splice(j, 1)
            break
          }
        }
        list.push(item)
      }
      return list
    },
    formatBreatheList() {
      const timeNumRange = this.timeRange.map((x) => this.getTimeNum(x))
      const list = []
      const breatheList = [...this.breatheList]
      const timeAdd = (i) => {
        return i === timeNumRange[0]
          ? 6 * 60 * 60 * 1000
          : i === timeNumRange[1] - 2 * 60 * 60 * 1000
          ? 2 * 60 * 60 * 1000
          : 4 * 60 * 60 * 1000
      }
      for (let i = timeNumRange[0]; i < timeNumRange[1]; i += timeAdd(i)) {
        const item = { timeNum: i, value: '' }
        for (let j = breatheList.length - 1; j >= 0; j--) {
          const timeNum = this.getTimeNum(breatheList[j].time)
          if (timeNum >= i && timeNum < i + timeAdd(i)) {
            item.value = breatheList[j].value
            breatheList.splice(j, 1)
            break
          }
        }
        list.push(item)
      }
      list
        .filter((x) => x.value !== '')
        .forEach(
          (x, i) =>
            (x.style =
              i % 2 === 0
                ? { 'align-items': 'flex-start' }
                : { 'align-items': 'flex-end' })
        )
      return list
    },
    dateList() {
      const list = []
      const min = new Date(`${this.dateRange[0]} 00:00:00`).getTime()
      const max = new Date(`${this.dateRange[1]} 00:00:00`).getTime()
      for (let i = min; i <= max; i += 24 * 60 * 60 * 1000) {
        list.push(this.parseTime(i, '{y}-{m}-{d}'))
      }
      return list
    },
    dateRange() {
      return this.dateRangeList[this.currentPage - 1] || []
    },
    timeRange() {
      return [
        `${this.dateList[0]} 00:00:00`,
        `${this.dateList[this.dateList.length - 1]} 24:00:00`
      ]
    },
    operateDateList() {
      return this.vitalSigns
        .filter(
          (x) =>
            x.vital_code === 'nurseEvents' &&
            (x.value === '手术' ||
              x.value === '手术分娩|' ||
              x.value === '手术入院|')
        )
        .map((x) => x.time_point)
    },
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
        let apart = [] // 存储当天和前面手术的天数间隔
        for (let i = 0; i < index; i++) {
          apart.unshift(days[i])
        }
        // 间隔大于14天的手术，分子分母的写法要重置
        if (apart.length) {
          apart.unshift(days[index])
          for (let i = 1; i < apart.length; i++) {
            if (apart[i] - apart[i - 1] > 14) {
              apart = apart.slice(0, i)
              break
            }
          }
          apart.splice(0, 1)
        }
        if (days[index] <= 14) {
          return index === 0 || !apart.length
            ? days[index] || '手术'
            : days[index] === 0
            ? `手术/${apart.join('/')}`
            : `${days[index]}/${apart.join('/')}`
        } else {
          return ''
        }
      })
    },
    formatStayDayList() {
      /* 住院天数 */
      return this.dateList.map((x) => {
        return this.dayInterval(x, this.patInfo.admission_date) + 1
      })
    },
    childbirthDateList() {
      return this.vitalSigns
        .filter(
          (x) =>
            x.vital_code === 'nurseEvents' &&
            (x.value === '分娩' ||
              x.value === '分娩|' ||
              x.value === '手术分娩|')
        )
        .map((x) => x.time_point)
    },
    formatChildbirthDateList() {
      // 分娩
      return this.dateList.map((x) => {
        if (this.dayInterval(x, this.parseTime(new Date(), '{y}-{m}-{d}')) > 0)
          return ''
        if (!this.childbirthDateList.length) return ''
        // 构造天数差数组，有相同天数差的说明在同一天，所以要去重
        const days = [
          ...new Set(
            this.childbirthDateList.map((y) => {
              return this.dayInterval(x, y)
            })
          )
        ]
        if (days.every((z) => z < 0)) return ''
        // 找到前一次分娩（最后一次天数差是正整数的地方）
        let index = 0
        for (let i = 0; i < days.length; i++) {
          if (days[i] >= 0) index = i
        }
        return days[index] > 0 && days[index] <= 14
          ? `分娩后第${days[index]}天`
          : ''
      })
    },
    formatDateList() {
      return this.dateList.map((x, i) => {
        if (i === 0 || this.dateList[i - 1].slice(0, 4) !== x.slice(0, 4)) {
          return x
        } else {
          return x.slice(5)
        }
      })
    },
    temperaturelist() {
      const list = []
      for (let i = this.yRange[1]; i > this.yRange[0]; i--) {
        list.push(i)
      }
      return list
    },
    pulseList() {
      const list = []
      for (let i = this.pulseRange[1]; i > this.pulseRange[0]; i = i - 20) {
        list.push(i)
      }
      return list
    },
    painList() {
      const list = []
      for (let i = this.painRange[1]; i > this.painRange[0]; i -= 1) {
        list.push(i)
      }
      return list
    },
    topAreaHeight() {
      return this.ySpace * 1 + 1
    },
    painAreaHeight() {
      return this.ySpace * 5 + 8
    },
    indexTextAreaHeight() {
      return this.ySpace * 2 + 1
    },
    timesTempAreaHeight() {
      return (
        this.areaHeight -
        this.topAreaHeight -
        this.painAreaHeight -
        this.indexTextAreaHeight
      )
    },
    polygonPoints() {
      /*
        形成心率和脉搏多边形锚点二维数组，多个数组则画多个多边形，
        注意同一对录入的心率值肯定大于脉搏值的，而且脉搏和心率一一对应
      */
      const settingMap = this.settingMap
      if (settingMap.heart.data.length > 0) {
        let data = [[]]
        settingMap.heart.data.forEach((x, i) => {
          // 注释的是断线逻辑
          // if (x.value > this.pulseRange[1]) {
          //   data.push([])
          // } else {
          //   data[data.length - 1].push({ value: x, index: i })
          // }
          // 贵州医院不需要断线
          data[data.length - 1].push({ value: x, index: i })
        })
        data = data.map((x) => {
          return [
            ...x.map((y) => {
              return [
                this.getXaxis(this.getLocationTime(y.value.time)),
                this.getYaxis(
                  settingMap.heart.range,
                  y.value.value > this.pulseRange[1]
                    ? this.pulseRange[1] - 2
                    : y.value.value
                )
              ]
            }),
            ...settingMap.pulse.data
              .slice(x[0].index, x[x.length - 1].index + 1)
              .map((z) => {
                return [
                  this.getXaxis(this.getLocationTime(z.time)),
                  this.getYaxis(
                    settingMap.pulse.range,
                    z.value > this.pulseRange[1]
                      ? this.pulseRange[1] - 2
                      : z.value
                  )
                ]
              })
              .reverse()
          ]
        })
        return data
      }
      return []
    },
    temperatureNoteList() {
      // 拒测,不在,外出,请假都是体温相关的注释，出现后体温曲线要在此时间点断开
      const textList = ['拒测', '不在', '外出', '请假']
      return this.topSheetNote.filter((x) => textList.includes(x.value))
    }
  },
  watch: {
    // 因为分页可能在体温单外面，所以给父页面传递pageTotal
    pageTotal(value) {
      window.parent.postMessage({ type: 'pageTotal', value }, '*')
    }
  },
  created() {
    // 实现外部分页和打印
    window.addEventListener('message', this.messageHandle, false)
  },
  beforeDestroy() {
    window.removeEventListener('message', this.messageHandle, false)
  },
  methods: {
    smallTdStyle(index) {
      return {
        color:
          index % 6 === 0 || (index - 4) % 6 === 0 || (index - 5) % 6 === 0
            ? 'red'
            : '',
        width: `${this.xSpace + ((index - 5) % 6 === 0 ? 2 : 1)}px`,
        flex: 'auto',
        'flex-grow': 0,
        'flex-shrink': 0,
        'border-right-style': 'solid',
        'border-width': `${(index - 5) % 6 === 0 ? 2 : 1}px`,
        'border-color': `${(index - 5) % 6 === 0 ? 'transparent' : '#000'}`,
        transform: 'translateX(1px)'
      }
    },
    middleTdStyle(index) {
      return {
        width: `${this.xSpace * 3 + ((index - 1) % 2 === 0 ? 4 : 3)}px`,
        flex: 'auto',
        'flex-grow': 0,
        'flex-shrink': 0,
        'border-right-style': 'solid',
        'border-width': `${(index - 1) % 2 === 0 ? 2 : 1}px`,
        'border-color': `${(index - 1) % 2 === 0 ? 'transparent' : '#000'}`,
        transform: 'translateX(1px)'
      }
    },
    messageHandle(e) {
      if (e && e.data) {
        switch (e.data.type) {
          case 'currentPage':
            if (e.data.value > 0) {
              this.currentPage = e.data.value
              document.getElementById('main').innerHTML = ''
              this.reset()
              this.handleData()
            }
            break
          case 'printing':
            window.print()
            break
          case 'nurseExchangeInfo':
            if (e.data.value) {
              this.adtLog = e.data.value.adtLog || '' // 转科
              this.bedExchangeLog = e.data.value.bedExchangeLog || '' // 转床
            }
            break
          default:
            break
        }
      }
    },
    reset() {
      Object.keys(this.settingMap).forEach((x) => {
        this.settingMap[x].data = []
      })
      this.topSheetNote = []
      this.bottomSheetNote = []
      // this.topPulseNote = []
      this.breatheList = []
      this.pressureList = []
      this.weightList = []
      this.heightList = []
      this.inputList = []
      this.shitList = []
      this.yinliuList = []
      this.urineList = []
      this.outputList = []
      this.coolList = []
      this.ttgyList = []
      this.dateRangeList = []
      for (let i = 0; i < 6; i++) {
        this[`customList${i}`] = []
      }
    },
    toNext() {
      if (this.currentPage === this.pageTotal) return
      this.currentPage++
      document.getElementById('main').innerHTML = ''
      this.reset()
      this.handleData()
    },
    toPre() {
      if (this.currentPage === 1) return
      this.currentPage--
      document.getElementById('main').innerHTML = ''
      this.reset()
      this.handleData()
    },
    handleData() {
      if (this.apiData.patientInfo)
        this.patInfo = this.apiData.patientInfo.patInfo
      const vitalSigns = this.apiData.vitalSigns.sort(
        (a, b) => this.getTimeNum(a.time_point) - this.getTimeNum(b.time_point)
      )
      if (!vitalSigns.length) {
        vitalSigns.push({
          // 空数据加个占位，否则样式会错乱
          temperature_type: '出量',
          value: '',
          time_point: this.patInfo.admission_date,
          vital_code: 'chuliang'
        })
      }
      this.vitalSigns = vitalSigns
      // 计算最大标识时间
      const maxTimeNum = Math.max.apply(
        null,
        vitalSigns.map((x) => new Date(x.time_point).getTime())
      )
      const admissionDateNum = new Date(
        `${this.patInfo.admission_date.slice(0, 10)} 00:00:00`
      ).getTime()
      // 根据入院时间和最大标识时间计算出页数和每页的时间范围
      const dateRangeList = []
      for (
        let i = admissionDateNum;
        i < maxTimeNum;
        i += 7 * 24 * 60 * 60 * 1000
      ) {
        dateRangeList.push([
          this.parseTime(i, '{y}-{m}-{d}'),
          this.parseTime(i + 6 * 24 * 60 * 60 * 1000, '{y}-{m}-{d}')
        ])
      }
      this.dateRangeList = dateRangeList
      this.pageTotal = dateRangeList.length

      // 和iframe外部通信，传当前页起止时间段，用来获取转科和转床信息的
      window.parent.postMessage(
        {
          type: 'getNurseExchangeInfo',
          value: {
            startLogDateTime: this.timeRange[0],
            endLogDateTime: this.timeRange[1]
          }
        },
        '*'
      )

      const timeNumRange = this.timeRange.map((x) => this.getTimeNum(x))
      const customSigns = [] // 记录自定义字段的名字
      for (let i = 0; i < vitalSigns.length; i++) {
        if (
          this.getTimeNum(vitalSigns[i].time_point) < timeNumRange[0] ||
          this.getTimeNum(vitalSigns[i].time_point) > timeNumRange[1]
        ) {
          // 超出时间范围的抛弃
          continue
        }
        if (
          ['other1', 'other2', 'other3', 'other4', 'other5', 'other6'].includes(
            vitalSigns[i].vital_code
          )
        ) {
          // 自定义字段填入
          const sign = vitalSigns[i].temperature_type
          const index = customSigns.indexOf(sign)
          if (index < 0) {
            customSigns.push(sign)
            this[`customList${customSigns.length - 1}`].push({
              time: vitalSigns[i].time_point,
              value: vitalSigns[i].value
            })
            this[`customList${customSigns.length - 1}`].label = sign
          } else {
            this[`customList${index}`].push({
              time: vitalSigns[i].time_point,
              value: vitalSigns[i].value
            })
            this[`customList${index}`].label = sign
          }
          continue
        }
        if (this.lineMap[vitalSigns[i].vital_code]) {
          if (
            ['pulse', 'heartRate'].includes(vitalSigns[i].vital_code) &&
            Number(vitalSigns[i].value) > this.pulseRange[1]
          ) {
            // this.topPulseNote.push({
            //   time: vitalSigns[i].time_point,
            //   value: '过快'
            // })
          } else if (
            ['kouTemperature', 'yeTemperature', 'gangTemperature'].includes(
              vitalSigns[i].vital_code
            ) &&
            Number(vitalSigns[i].value) <= 35
          ) {
            this.bottomSheetNote.push({
              time: vitalSigns[i].time_point,
              value: '不升'
            })
          }
          this.settingMap[this.lineMap[vitalSigns[i].vital_code]].data.push({
            time: vitalSigns[i].time_point,
            value: Number(vitalSigns[i].value)
          })
          continue
        }
        const item = {
          time: vitalSigns[i].time_point,
          value: vitalSigns[i].value
        }
        switch (vitalSigns[i].vital_code) {
          case 'nurseEvents':
            this.topSheetNote.push(item)
            break
          case '4':
            this.bottomSheetNote.push(item)
            break
          case 'breathe': // 呼吸
            this.breatheList.push(item)
            break
          case 'breatheMachine': // 呼吸机
            this.breatheList.push(item)
            break
          case 'bloodPressure':
            this.pressureList.push(item)
            break
          case 'weight':
            this.weightList.push(item)
            break
          case 'ruliang':
            this.inputList.push(item)
            break
          case 'excrement':
            this.shitList.push(item)
            break
          case '10':
            this.yinliuList.push(item)
            break
          case 'niaoliang':
            this.urineList.push(item)
            break
          case 'chuliang':
            this.outputList.push(item)
            break
          case 'downTemperature':
            this.coolList.push(item)
            break
          case 'jtpf':
            this.ttgyList.push(item)
            break
          case 'height':
            this.heightList.push(item)
            break
          default:
            break
        }
      }
      this.init()
    },
    createNote(notes, y, color) {
      // 为了防止注释重叠，如果注释落在同一个格子里，则依次往后移一个格子
      const xaxis = notes.map((x) =>
        this.getXaxis(this.getLocationTime(x.time))
      )
      const xaxisNew = this.handleNoteXaxis(xaxis)
      notes.forEach((x, i) => {
        let value = x.value
        if (x.value.endsWith('|')) {
          value = `${x.value.replace('|', '于')}${new Date(
            x.time
          ).getHours()}时${new Date(x.time).getMinutes()}分`
        }
        this.createText({
          // x: this.getXaxis(this.getSplitTime(x.time)) + this.xSpace/2,
          x: xaxisNew[i],
          y,
          value: this.addn(value),
          color,
          textLineHeight: this.ySpace + 1,
          fontWeight: 'bold'
        })
      })
    },
    init() {
      this.getAreaHeight() // 遍历一遍获取高度
      this.getAreaWidth() // 遍历一遍获取宽度
      this.$nextTick(() => {
        this.zr = zrender.init(document.getElementById('main'))
        const div = document.createElement('div')
        div.classList.add('tips')
        document.getElementById('main').appendChild(div)
        this.yLine() //生成Y轴坐标
        this.xLine() //生成X轴坐标
        // 画折线
        Object.values(this.settingMap).forEach((x) => {
          let data = [x.data]
          if (
            ['kouTemperature', 'yeTemperature', 'gangTemperature'].includes(
              x.vitalCode
            )
          ) {
            // 体温为不升时，折线需要断开
            data = [[]]
            x.data.forEach((y) => {
              if (y.value <= 35) {
                data.push([])
              } else {
                data[data.length - 1].push(y)
              }
            })
          }
          // if (['pulse', 'heartRate'].includes(x.vitalCode)) {
          //   // 心率或脉搏过快时，折线需要断开
          //   data = [[]]
          //   x.data.forEach((y) => {
          //     if (y.value > this.pulseRange[1]) {
          //       data.push([])
          //     } else {
          //       data[data.length - 1].push(y)
          //     }
          //   })
          // }
          data.forEach((z) => {
            this.createBrokenLine({
              vitalCode: x.vitalCode,
              data: z,
              yRange: x.range,
              lineColor: x.lineColor || x.color,
              label: x.label,
              dotColor: x.color,
              dotSolid: x.solid,
              dotType: x.dotType
            })
          })
        })
        /*  画心率和脉搏的多边形，连线已经用折线画了，
            这里用多边形是为了生成阴影，多边形的边框颜色设为透明，
            ①只填写脉搏没有填写心率的单据，不需要连接成闭环形成阴影
            ②填写脉搏和心率的单据需要连接两者数据点形成阴影(此情况为房颤患者)
        */
        if (this.settingMap.heart.data.length > 0) {
          this.polygonPoints.forEach((x) => {
            this.createPolygon({
              points: x,
              lineWidth: 1,
              color: 'transparent'
            })
          })
        }
        // // 生成心率脉搏过快注释
        // this.createNote(this.topPulseNote, this.ySpace + 2, 'black')
        // 生成表顶注释
        this.createNote(
          this.topSheetNote,
          this.topAreaHeight +
            this.painAreaHeight +
            this.indexTextAreaHeight +
            1,
          'red'
        )
        // 生成表底注释
        this.createNote(
          this.bottomSheetNote,
          this.areaHeight - 4 * (this.ySpace + 1),
          'red'
        )
      })
    },
    yLine() {
      const totalLine =
        this.yRange[1] -
        this.yRange[0] +
        (this.yRange[1] - this.yRange[0]) * 4 +
        8 +
        1 // 这里加1是疼痛7那条红线
      let preSpace = 0
      for (let i = 0; i < totalLine; i++) {
        const isPainBreak = i === 3 || i === 5 || i === 7
        const isBreak =
          (((i - 9) % 5 === 0 && i >= 9) || isPainBreak) &&
          i > 0 &&
          i < totalLine - 1
        const isboundary = i === 0 || i === totalLine - 1
        const lineWidth = isBreak ? 2 : 1
        const params = {
          x1: 0,
          y1: preSpace,
          x2: this.areaWidth - 1,
          y2: preSpace,
          lineWidth,
          color: (() => {
            if (isBreak) {
              if (i === 5) {
                return 'red'
              } else if (i === 3) {
                return 'blue'
              } else {
                return '#000'
              }
            } else {
              return isboundary ? 'transparent' : '#000'
            }
          })()
        }
        preSpace +=
          lineWidth + (i === 2 || i === 3 ? this.ySpace / 2 - 1 : this.ySpace)
        this.createLine(params)
      }
    },
    xLine() {
      const totalLine =
        this.xRange[1] -
        this.xRange[0] +
        1 +
        (this.xRange[1] - this.xRange[0]) * 5
      let preSpace = 0
      for (let i = 0; i < totalLine; i++) {
        const isBreak = i % 6 === 0 && i > 0 && i < totalLine - 1
        const lineWidth = isBreak ? 2 : i === 0 ? 2 : 1
        const params = {
          x1: preSpace,
          y1: 0,
          x2: preSpace,
          y2: this.areaHeight,
          lineWidth,
          color: isBreak ? 'red' : '#000'
        }
        preSpace += lineWidth + this.xSpace
        this.createLine(params)
      }
    },
    getAreaHeight() {
      const totalLine =
        this.yRange[1] -
        this.yRange[0] +
        (this.yRange[1] - this.yRange[0]) * 4 +
        8 +
        1 // 这里加1是疼痛7那条红线
      let preSpace = 0
      for (let i = 0; i < totalLine; i++) {
        const isPainBreak = i === 3 || i === 5 || i === 7
        const isBreak =
          (((i - 9) % 5 === 0 && i >= 9) || isPainBreak) &&
          i > 0 &&
          i < totalLine - 1
        const lineWidth = isBreak ? 2 : 1
        preSpace +=
          lineWidth + (i === 2 || i === 3 ? this.ySpace / 2 - 1 : this.ySpace)
      }
      this.areaHeight = preSpace - this.ySpace - 1
    },
    getAreaWidth() {
      const totalLine =
        this.xRange[1] -
        this.xRange[0] +
        1 +
        (this.xRange[1] - this.xRange[0]) * 5
      let preSpace = 0
      for (let i = 0; i < totalLine; i++) {
        const isBreak = i % 6 === 0 && i > 0 && i < totalLine - 1
        const lineWidth = isBreak ? 2 : i === 0 ? 2 : 1
        preSpace += lineWidth + this.xSpace
      }
      this.areaWidth = preSpace - this.xSpace
    },
    createText({
      x,
      y,
      value,
      color,
      fontSize = 12,
      tips,
      zlevel = 0,
      fontWeight = 'normal',
      textLineHeight
    }) {
      const text = new zrender.Text({
        zlevel,
        style: {
          x,
          y,
          text: value,
          fontSize,
          textFill: color,
          textAlign: 'center',
          fontWeight,
          textLineHeight
        }
      })
      this.zr.add(text)
      if (tips) {
        this.addHover(
          text,
          { tips },
          x,
          y + 7,
          {
            style: {
              fontSize: fontSize + 2
            }
          },
          {
            style: {
              fontSize
            }
          }
        )
      }
    },
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
          smoothConstraint: 0
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
    createLine({
      x1,
      y1,
      x2,
      y2,
      lineWidth,
      color,
      zlevel = 0,
      lineDash = []
    }) {
      const line = new zrender.Line({
        zlevel,
        shape: {
          x1,
          y1,
          x2,
          y2
        },
        style: {
          lineDash,
          lineWidth,
          stroke: color
        }
      })
      this.zr.add(line)
    },
    createCircle({ cx, cy, r, color, zlevel, tips, dotSolid }) {
      const circle = new zrender.Circle({
        zlevel,
        shape: {
          cx,
          cy,
          r
        },
        style: {
          fill: dotSolid ? color : '#fff',
          stroke: color,
          lineWidth: 2
        }
      })
      this.zr.add(circle)
      if (tips) {
        this.addHover(
          circle,
          { tips },
          cx,
          cy - 5,
          {
            shape: {
              r: r + 1
            }
          },
          {
            shape: {
              r
            }
          }
        )
      }
    },
    createIsogon({ x, y, r, n, color, zlevel, tips, dotSolid }) {
      const isogon = new zrender.Isogon({
        zlevel,
        shape: {
          x,
          y,
          r,
          n
        },
        style: {
          fill: dotSolid ? color : '#fff',
          stroke: color,
          lineWidth: 2
        }
      })
      this.zr.add(isogon)
      if (tips) {
        this.addHover(
          isogon,
          { tips },
          x,
          y,
          {
            shape: {
              r: r + 1
            }
          },
          {
            shape: {
              r
            }
          }
        )
      }
    },
    getTimeStamp(timeStr) {
      return new Date(timeStr).getTime()
    },
    addHover(el, config, x, y, shapeOn, shapeOut) {
      const domTips = document.getElementsByClassName('tips')
      el.on('mouseover', () => {
        domTips[0].innerHTML = config.tips

        domTips[0].setAttribute(
          'style',
          `
          position:absolute;
          top:${y - 30}px;
          z-index:50;
          display:block;
          font-size:12px;
          background-color:rgba(0,0,0,.7);
          padding:5px 5px;
          border-radius:2px;
          color:#fff;
          width:fit-content;
          text-align:center`
        )
        const tipsDom = document.querySelector('.tips')
        const tipWidth = tipsDom.clientWidth
        tipsDom.style.left = `${x - tipWidth / 2}px`
        el.animateTo(shapeOn, 100, 0)
      }).on('mouseout', function() {
        domTips[0].setAttribute('style', `display:none`)
        el.animateTo(shapeOut, 100, 0)
      })
    },
    createBrokenLine({
      vitalCode,
      data,
      yRange,
      lineColor,
      label,
      dotColor,
      dotSolid,
      dotType
    }) {
      const dots = []
      data.forEach((x) => {
        const cx = this.getXaxis(this.getLocationTime(x.time))
        let cy = this.getYaxis(yRange, x.value, vitalCode)
        let params = {
          cx,
          cy,
          r: 4,
          color: dotColor || '#000',
          zlevel: 10,
          tips: `${x.time} ${label}：${x.value}`,
          dotSolid
        }
        switch (dotType) {
          case 'Text':
            this.createText({
              x: cx,
              y: cy - 10.5,
              value: 'x',
              color: dotColor,
              fontSize: 18,
              tips: `${x.time} ${label}：${x.value}`,
              zlevel: 10,
              fontWeight: 'bold'
            })
            break
          case 'Circle':
            if (vitalCode === 'pulse' || vitalCode === 'heartRate') {
              // 如果脉搏或心率超限过快，则在最高的格子中间用实心红圈描点
              if (x.value > this.pulseRange[1]) {
                cy = this.getYaxis(yRange, yRange[1] - 2, vitalCode)
                params = {
                  cx,
                  cy,
                  r: 4,
                  color: 'red',
                  zlevel: 9,
                  tips: `${x.time} ${label}：${x.value}`,
                  dotSolid: true
                }
              }
              // 如果脉搏或心率和体温坐标重叠，改成在体温标识外面画红色的圆圈
              const tList = [
                ...this.settingMap.oralTemperature.data,
                ...this.settingMap.axillaryTemperature.data,
                ...this.settingMap.analTemperature.data
              ].map((x) => {
                return {
                  x: this.getXaxis(this.getLocationTime(x.time)),
                  y: this.getYaxis(this.yRange, x.value)
                }
              })
              const sameAxisItem = tList.find((x) => x.x === cx && x.y === cy)
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
            break
          case 'Isogon':
            this.createIsogon({
              x: cx,
              y: cy,
              r: 4,
              n: 3,
              color: dotColor || '#000',
              zlevel: 10,
              tips: `${x.time} ${label}：${x.value}`,
              dotSolid
            })
            break
          default:
            break
        }
        if (
          ['yeTemperature', 'gangTemperature', 'kouTemperature'].includes(
            vitalCode
          )
        ) {
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
          // // 画复试
          // const createRepeatTest = () => {
          //   this.createText({
          //     x: cx + 8,
          //     y: cy - 20,
          //     value: 'v',
          //     color: 'red',
          //     tips: '体温复试',
          //     fontWeight: 'bold',
          //     zlevel: 10,
          //     fontSize: 18
          //   })
          // }
          // if (index > 0) {
          //   // 与上次记录的体温相比上升(1.5℃)或下降(2℃)
          //   if (
          //     x.value - data[index - 1].value >= 1.5 ||
          //     x.value - data[index - 1].value <= -2
          //   ) {
          //     createRepeatTest()
          //   }
          // } else if (index === 0 && this.currentPage === 1) {
          //   // 入院首次体温≥38℃
          //   const list = [
          //     {
          //       vitalCode: 'kouTemperature',
          //       ...this.settingMap.oralTemperature.data[0]
          //     },
          //     {
          //       vitalCode: 'yeTemperature',
          //       ...this.settingMap.axillaryTemperature.data[0]
          //     },
          //     {
          //       vitalCode: 'gangTemperature',
          //       ...this.settingMap.analTemperature.data[0]
          //     }
          //   ]
          //     .filter((x) => Object.keys(x).length > 1)
          //     .sort((a, b) => this.getTimeNum(a.time) - this.getTimeNum(b.time))
          //   if (
          //     vitalCode === list[0].vitalCode &&
          //     Number(list[0].value) >= 38
          //   ) {
          //     createRepeatTest()
          //   }
          // }
        } else if (vitalCode === 'ttpf') {
          // 画疼痛干预
          for (let i = this.ttgyList.length - 1; i >= 0; i--) {
            const item = this.ttgyList[i]
            const ttgyX = this.getXaxis(this.getLocationTime(item.time))
            const ttgyY = this.getYaxis(yRange, item.value, vitalCode)
            if (ttgyX === cx) {
              this.createCircle({
                cx: ttgyX,
                cy: ttgyY,
                r: 4,
                color: 'red',
                zlevel: 10,
                tips: `${item.time} 疼痛干预：${item.value}`,
                dotSolid: false
              })
              this.createLine({
                x1: cx,
                y1: cy,
                x2: ttgyX,
                y2: ttgyY,
                lineWidth: 1,
                color: 'red',
                zlevel: 1,
                lineDash: [3, 3]
              })
              this.ttgyList.splice(i, 1)
            }
          }
        } else if (['pulse', 'heartRate'].includes(vitalCode)) {
          // 画脉搏/心率超限过快
          if (x.value > this.pulseRange[1]) {
            this.createText({
              x: cx,
              y: cy - this.ySpace * 1.5,
              value: x.value,
              color: 'red',
              tips: '',
              fontWeight: 'bold',
              zlevel: 10,
              fontSize: 12
            })
          }
        }
        dots.push({ x: cx, y: cy, time: x.time })
      })
      // 连线
      for (let i = 0; i < dots.length - 1; i++) {
        if (
          ['yeTemperature', 'kouTemperature', 'gangTemperature'].includes(
            vitalCode
          )
        ) {
          if (
            this.temperatureNoteList.some((x) => {
              return (
                this.getTimeStamp(x.time) >= this.getTimeStamp(dots[i].time) &&
                this.getTimeStamp(x.time) <= this.getTimeStamp(dots[i + 1].time)
              )
            })
          ) {
            continue
          }
        }
        this.createLine({
          x1: dots[i].x,
          y1: dots[i].y,
          x2: dots[i + 1].x,
          y2: dots[i + 1].y,
          lineWidth: 1,
          color: lineColor || 'red',
          zlevel: 1
        })
      }
    },
    // 根据值计算纵坐标
    getYaxis(yRange, value, vitalCode) {
      return vitalCode === 'ttpf'
        ? ((yRange[1] - value) / (yRange[1] - yRange[0])) *
            this.painAreaHeight +
            this.topAreaHeight -
            1
        : ((yRange[1] - value) / (yRange[1] - yRange[0])) *
            (this.timesTempAreaHeight + this.ySpace) +
            this.topAreaHeight +
            this.painAreaHeight +
            this.indexTextAreaHeight
    },
    // 根据时间点计算横坐标
    getXaxis(time) {
      let xAxis =
        ((this.getTimeStamp(time) - this.getTimeStamp(this.timeRange[0])) /
          (this.getTimeStamp(this.timeRange[1]) -
            this.getTimeStamp(this.timeRange[0]))) *
        this.areaWidth
      return xAxis
    },
    // 增加换行符
    addn(str) {
      let formatStr = ''
      if (str.length < 2) {
        return str
      } else {
        for (let i = 0; i < str.length; i++) {
          formatStr +=
            isNaN(str[i]) || (!isNaN(str[i]) && isNaN(str[i + 1]))
              ? `${str[i]}\n`
              : str[i]
        }
      }
      return formatStr
    },
    // // 算出上一个分割时间点
    // getSplitTime(time) {
    //   const hour = Number(time.slice(-8,-6))
    //   let splitHour = hour - hour % 4
    //   if (hour % 4 === 0) {
    //     splitHour -= 4
    //   }
    //   splitHour = splitHour < 10 ? `0${splitHour}` : String(splitHour)
    //   return `${time.slice(0, -8)}${splitHour}:00:00`
    // },
    // 计算用来定位描点的时间，医院特殊要求用这个方法定位
    getLocationTime(time) {
      const sec = this.getTotalSeconds(time.slice(-8))
      let str = ''
      const timeAreasMap = {
        '02:00:00': ['00:00:00', '05:00:59'],
        '06:00:00': ['05:01:00', '9:00:59'],
        '10:00:00': ['9:01:00', '13:00:59'],
        '14:00:00': ['13:01:00', '17:00:59'],
        '18:00:00': ['17:01:00', '21:00:59'],
        '22:00:00': ['21:01:00', '23:59:59']
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
    // 根据时分秒00:00:00计算总秒数
    getTotalSeconds(str) {
      return str
        .split(':')
        .map((x, i) => Number(x) * Math.pow(60, 2 - i))
        .reduce((pre, cur) => {
          return pre + cur
        }, 0)
    },
    // 计算天数间隔
    dayInterval(end, start) {
      return (
        (new Date(`${end.slice(0, 10)} 00:00:00`).getTime() -
          new Date(`${start.slice(0, 10)} 00:00:00`).getTime()) /
        (24 * 60 * 60 * 1000)
      )
    },
    // 时间格式化
    parseTime(time, cFormat) {
      if (arguments.length === 0 || !time) {
        return null
      }
      const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
      let date
      if (typeof time === 'object') {
        date = time
      } else {
        if (typeof time === 'string') {
          if (/^[0-9]+$/.test(time)) {
            // support '1548221490638'
            time = parseInt(time)
          } else {
            // support safari
            // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
            time = time.replace(new RegExp(/-/gm), '/')
          }
        }

        if (typeof time === 'number' && time.toString().length === 10) {
          time = time * 1000
        }
        date = new Date(time)
      }
      const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
      }
      const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
        const value = formatObj[key]
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') {
          return ['日', '一', '二', '三', '四', '五', '六'][value]
        }
        return value.toString().padStart(2, '0')
      })
      return time_str
    },
    // 获取时间戳
    getTimeNum(time) {
      return new Date(time).getTime()
    },
    urlParse() {
      let obj = {}
      let reg = /[?&][^?&]+=[^?&%]+/g
      let url = window.location.hash
      let arr = url.match(reg) || []
      arr.forEach((item) => {
        let tempArr = item.substring(1).split('=')
        let key = decodeURIComponent(tempArr[0])
        let val = decodeURIComponent(tempArr[1])
        obj[key] = val
      })
      return obj
    },
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
    // 数字转中文
    toChinesNum(num) {
      let changeNum = [
        '零',
        '一',
        '二',
        '三',
        '四',
        '五',
        '六',
        '七',
        '八',
        '九'
      ]
      let unit = ['', '十', '百', '千', '万']
      num = parseInt(num)
      if (!num) return '零'
      let getWan = (temp) => {
        let strArr = temp
          .toString()
          .split('')
          .reverse()
        let newNum = ''
        for (let i = 0; i < strArr.length; i++) {
          newNum =
            (i == 0 && strArr[i] == 0
              ? ''
              : i > 0 && strArr[i] == 0 && strArr[i - 1] == 0
              ? ''
              : changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i])) +
            newNum
        }
        // 如果是两位数，一十改成十
        if (strArr.length === 2 && strArr[1] === '1') {
          newNum = newNum.slice(1)
        }
        return newNum
      }
      let overWan = Math.floor(num / 10000)
      let noWan = num % 10000
      if (noWan.toString().length < 4) {
        noWan = '0' + noWan
      }
      return overWan ? getWan(overWan) + '万' + getWan(noWan) : getWan(num)
    },
    // 为了防止注释重叠，如果注释落在同一个格子里，则依次往后移一个格子
    handleNoteXaxis(xaxisList) {
      const xaxisNew = []
      for (let i = 0; i < xaxisList.length; i++) {
        if (!xaxisNew.includes(xaxisList[i])) {
          xaxisNew.push(xaxisList[i])
        } else {
          while (xaxisNew.includes(xaxisList[i])) {
            xaxisList[i] += this.xSpace
          }
          xaxisNew.push(xaxisList[i])
        }
      }
      return xaxisNew
    }
  },
  mounted() {
    const urlParams = this.urlParse()
    this.showInnerPage = urlParams.showInnerPage === '1'
    if (this.useMockData) {
      this.apiData = mockData
      this.$nextTick(() => {
        this.handleData()
      })
    } else {
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
        this.apiData = res.data
        this.$nextTick(() => {
          this.handleData()
        })
      })
    }
  }
}
</script>

<style lang="scss">
@media print {
  @page {
    size: a4; //定义为a4纸
    margin: 10mm 10mm 10mm 10mm; // 页面的边距
  }
}
.main-view {
  padding: 5px 0;
  margin: 0 auto;
  font-size: 12px;
  color: #000;
  font-weight: bold;
  font-family: Simsun;
  .head-hos {
    padding-top: 10px;
    font-size: 24px;
  }
  .head-title {
    padding: 15px 0;
    font-size: 24px;
  }
  .head-info {
    font-size: 14px;
    display: flex;
    .item {
      flex: 1;
      text-align: center;
      padding: 0 0 5px 5px;
      &:nth-child(1) {
        flex: 0.7;
      }
      &:nth-child(2) {
        flex: 1.5;
      }
      &:nth-child(3) {
        flex: 0.7;
      }
      &:nth-child(4) {
        flex: 1.3;
      }
      .value {
        font-weight: normal;
        text-decoration: underline;
        padding: 5px;
      }
    }
  }
}
#main {
  flex-shrink: 0;
  position: relative;
}
.table-area {
  position: relative;
  .hline {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    border-top: 2px solid #000;
    z-index: 60;
  }
  .vline {
    position: absolute;
    border-left: 2px solid #000;
    z-index: 30;
  }
}
.table-box {
  position: relative;
  z-index: 20;
  .vtline {
    position: absolute;
    top: 0;
    bottom: 0;
    border-left: 2px solid red;
    z-index: 30;
  }
  .row {
    display: flex;
    align-items: center;
    border-top: 1px solid #000;
    border-bottom: 1px solid #000;
    transform: translateX(-0.5px);
    &:not(:first-child) {
      border-top: none;
    }
    .label {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      border-right: 1px solid #000;
      transform: translateX(0.5px);
      flex-shrink: 0;
    }
    .value-item-box {
      flex: 1;
      height: 100%;
      display: flex;
      transform: translateX(1px);
    }
    .value-item {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }
    .time-label {
      display: block;
      width: 100%;
      background: #fff;
      position: relative;
      z-index: 2;
    }
  }
}
.info-box {
  display: flex;
  .index-box {
    position: relative;
    flex-shrink: 0;
    display: flex;
    font-size: 12px;
    transform: translateX(-0.5px);
    > .item {
      flex: 1;
      display: flex;
      flex-direction: column;
      text-align: center;
      &:not(:last-child) {
        border-right: 1px solid #000;
      }
      .text {
        text-align: center;
        .label {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
      .index {
        flex: 1;
        border-top: 2px solid #000;
        transform: translateY(-1px);
        &:last-child {
          flex: 0.8;
        }
        > span {
          display: block;
          text-align: center;
        }
      }
      .pain-area {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-bottom: 2px solid #000;
        transform: translateY(-1px);
        margin-right: -1px;
        padding-right: 1px;
        .pain-index {
          flex: 1;
          > span {
            display: block;
            margin-top: -6px;
          }
        }
      }
    }
    .times {
      .text {
        flex-shrink: 0;
        flex-grow: 0;
      }
      .index {
        color: red;
      }
    }
    .temp {
      .text {
        flex-shrink: 0;
        flex-grow: 0;
        .label {
          margin-right: -1px;
          padding-right: 1px;
        }
      }
      .index {
        margin-right: -1px;
        padding-right: 1px;
      }
    }
  }
}
.p-r-5 {
  padding-right: 5px;
}
.pagination {
  padding: 10px 0 0;
  font-weight: normal;
  .pre-icon {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-left: 1px solid #000;
    border-bottom: 1px solid #000;
    transform: rotate(45deg) translateY(-2px);
    cursor: pointer;
    margin-right: 10px;
  }
  .next-icon {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-right: 1px solid #000;
    border-bottom: 1px solid #000;
    transform: rotate(-45deg) translateY(-2px);
    cursor: pointer;
    margin-left: 10px;
  }
  .pre-btn {
    margin-right: 10px;
  }
  .next-btn {
    margin-left: 10px;
  }
  button {
    cursor: pointer;
    width: 80px;
    height: 30px;
  }
  button[disabled='disabled'] {
    cursor: not-allowed;
  }
}
.font-12 {
  font-size: 12px;
}
.border-top-red-2 {
  border-top: 2px solid red !important;
}
.border-bottom-black-2 {
  border-bottom: 2px solid black !important;
}
.border-top-black-2 {
  border-top: 2px solid black !important;
}
</style>
