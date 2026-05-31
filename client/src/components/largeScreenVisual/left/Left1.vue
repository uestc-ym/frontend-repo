<template>
	<div class="es-block">
        <Title>地区销量趋势</Title>
        <div style="width: 100%;height: 90%;">
            <div ref="chartRef" className='es-chart'></div>
		</div>
	</div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Title from '../Title.vue'
import allData from '@/assets/data/trend.json'
import * as echarts from 'echarts'

const choiceType = 'map'
const option = {
	grid: {
		left: '3%',
		top: '25%',
		right: '4%',
		bottom: '1%',
		containLabel: true
	},
	tooltip: {
		trigger: 'axis'
	},
	legend: {
		left: 20,
		top: '8%',
		icon: 'circle',
		data: allData[choiceType].data,
		textStyle: {
			color: '#aaa'
		}
	},
	xAxis: {
		type: 'category',
		boundaryGap: false,
		data: allData.common.month
	},
	yAxis: {
		type: 'value'
	},
	series: getSeries()
}

function getSeries() {
	// 半透明的颜色值
	const colorArr1 = [
		'rgba(11, 168, 44, 0.5)',
		'rgba(44, 110, 255, 0.5)',
		'rgba(22, 242, 217, 0.5)',
		'rgba(254, 33, 30, 0.5)',
		'rgba(250, 105, 0, 0.5)'
	]
	// 全透明的颜色值
	const colorArr2 = [
		'rgba(11, 168, 44, 0)',
		'rgba(44, 110, 255, 0)',
		'rgba(22, 242, 217, 0)',
		'rgba(254, 33, 30, 0)',
		'rgba(250, 105, 0, 0)'
	]
	// y轴的数据 series下的数据
	const valueArr = allData[choiceType].data
	const seriesArr = valueArr.map((item, index) => {
		return {
			name: item.name,
			type: 'line',
			data: item.data,
			stack: choiceType,
			itemStyle: {
				borderWidth: 4
			},
			lineStyle: {
				width: 3
			},
			symbolSize: 0,
			symbol: 'circle',
			smooth: true,
			areaStyle: {
				color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
					{
						offset: 0,
						color: colorArr1[index]
					}, // %0的颜色值
					{
						offset: 1,
						color: colorArr2[index]
					} // 100%的颜色值
				])
			}
		}
	})

	return seriesArr
}

const chartRef = ref(null)
let myChat = null;

const init = () => {
  if (chartRef.value) {
      myChat = echarts.init(chartRef.value)
	  myChat.setOption(option)
  }
}

onMounted(() => {
    init()
})
</script>

<style scoped>
.es-block {
	width: 100%;
	height: 100%;
}
.es-chart {
	width: 100%;
	height: 100%;
}
</style>