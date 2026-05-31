<template>
	<div class="es-block">
        <Title>商家分布</Title>
        <div class="es-chart-wrap">
            <div ref="chartRef" class='es-chart'></div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Title from '../Title.vue'
import chinaJson from '@/assets/data/china.json';
import hotData from '@/assets/data/map.json';
import * as echarts from 'echarts'

const option = {
	geo: {
		type: 'map',
		map: 'china',
		top: '5%',
		bottom: '5%',
		itemStyle: {
			areaColor: '#2E72BF',
			borderColor: '#333'
		}
	},
	legend: {
		left: '5%',
		bottom: '5%',
		orient: 'vertical',
		data: hotData.map(item => item.name),
		textStyle: {
			color: '#aaa'
		}
	},
	series: hotData.map(item => {
		// return的这个对象就代表的是一个类别下的所有散点数据
		// 如果想在地图中显示散点的数据, 我们需要给散点的图表增加一个配置, coordinateSystem:geo
		return {
			type: 'effectScatter',
			rippleEffect: {
				scale: 5,
				brushType: 'stroke'
			},
			name: item.name,
			data: item.children,
			coordinateSystem: 'geo'
		}
	})
}

const chartRef = ref(null)
let myChat = null;

const init = () => {
  echarts.registerMap('china', chinaJson);
  if (chartRef.value) {
		myChat = echarts.init(chartRef.value)
		myChat.setOption(option)
  }
}

const resize = () => {
	myChat.resize()
}

onMounted(() => {
  init() // 地图初始化
})
</script>

<style scoped>
.es-block {
	width: 100%;
	height: 100%;
	padding: 16px;
}
.es-chart-wrap {
  width: 100%;
  height: 98%;
}
.es-chart {
	width: 100%;
	height: 100%;
}
</style>