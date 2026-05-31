<template>
	<div class="es-block">
		<Title>商家销售统计</Title>
    <div style="width: 100%;height: 90%;">
            <div ref="chartRef" className='es-chart'></div>
		</div>
	</div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Title from '../Title.vue'
import allData from '@/assets/data/seller.json'
import * as echarts from 'echarts'

const barWidth = 22
const option = {
	grid: {
		top: '10%',
		left: '5%',
		right: '10%',
		bottom: '5%',
		containLabel: true // 距离是包含坐标轴上的文字
	},
	xAxis: {
		type: 'value',
		splitLine: { show: false },
		axisLine: { show: true },
	},
	yAxis: {
		type: 'category',
		axisTick: { show: false },
		data: allData.slice(0, 5).map((item) => {
			return item.name
		})
	},
	tooltip: {
		trigger: 'axis',
		axisPointer: {
			type: 'line',
			z: 0,
			lineStyle: {
				color: '#2D3443'
			}
		}
	},
	series: [
		{
			type: 'bar',
			label: {
				show: true,
				position: 'right',
			},
			barWidth: barWidth,
			roundCap: true,
			itemStyle: {
				borderWidth: 0,
				borderRadius: [0, barWidth / 2, barWidth / 2, 0],
				color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
					{
						offset: 0,
						color: '#5052EE'
					},
					{
						offset: 1,
						color: '#AB6EE5'
					}
				])
			},
			data: allData.slice(0, 5).map((item) => {
				return item.value
			})
		}
	]
}

const chartRef = ref(null)
let myChat = null;

const init = () => {
  if (chartRef.value) {
      myChat = echarts.init(chartRef.value)
	  myChat.setOption(option)
  }
}

const resize = () => {
	myChat.resize()
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