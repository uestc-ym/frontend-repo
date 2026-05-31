<script setup>
// 参考文章 -- https://juejin.cn/post/7248242431659966522
// 参考源码 -- https://github.com/vangleer/es-big-screen

import { onMounted, onBeforeUnmount, ref } from 'vue';
import dayjs from 'dayjs'
import Left from '@/components/largeScreenVisual/left/index.vue';
import Center from '@/components/largeScreenVisual/center/index.vue';
import Right from '@/components/largeScreenVisual/right/index.vue';

const BaseSize = {
  WIDTH: 1920, // 设计稿的宽度
  HEIGHT:  1080, // 设计稿的高度
  FONT_SIZE: 16,
}

const debounce = (callback, delay) => {
	let timerId
	return function (event) {
		if (timerId) {
			clearTimeout(timerId)
		}
		timerId = setTimeout(() => {
			callback.call(null, event)
			timerId = null
		}, delay)
	}
}

const screenSizeStr = ref('')
const currentTime = ref('')
const timeId = ref()
const startTime = () => {
	timeId.value = setTimeout(() => {
		currentTime.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
		startTime()
	}, 1000)
}
startTime()

// 方案一：autofit.js

// 方案二：根元素fontSize方案
// const updateRootFontSizeDelay = debounce(updateRootFontSize, 100)

// onMounted(() => {
//   updateRootFontSize('init');
//   window.addEventListener("resize", updateRootFontSizeDelay);
//   init();
// })

// onUnmounted(() => {
//   window.removeEventListener("resize", updateRootFontSizeDelay);
// })

// const calculateScaleRatio = () => {
//   const { clientWidth, clientHeight } = document.documentElement;
//   return clientWidth / clientHeight > BaseSize.WIDTH / BaseSize.HEIGHT
//     ? clientHeight / BaseSize.HEIGHT
//     : clientWidth / BaseSize.WIDTH;
// };

// const updateRootFontSize = (type) => {
//   const scaleRatio = calculateScaleRatio();
//   document.documentElement.dataset.scaleRatio = scaleRatio.toString();
//   document.documentElement.style.fontSize = `${
//     scaleRatio * BaseSize.FONT_SIZE
//   }px`;

//   if (type !== 'init') {
//     resize();
//   }
// }


// 方案三：transform scale方案
const screenRef = ref()
const scale = ref(1)

const transformScale = (e, fullScreen) => {
  const clientWidth = document.body.clientWidth
  const clientHeight = document.body.clientHeight
  const w = BaseSize.WIDTH
  const h = BaseSize.HEIGHT

  screenSizeStr.value = `${clientWidth} x ${clientHeight}` // 用于展示屏幕尺寸 可忽略

  // 计算宽高缩放比例
  const scaleW = clientWidth / w
  const scaleH = clientHeight / h

  if (clientWidth / clientHeight > w / h) {
    // 如果浏览器的宽高比大于设计稿的宽高比，就取浏览器高度和设计稿高度之比
    scale.value = scaleH
  } else {
    // 如果浏览器的宽高比小于设计稿的宽高比，就取浏览器宽度和设计稿宽度之比
    scale.value = scaleW
  }

  if (fullScreen) {
    // 如果不在乎缩放失真的情况，可以设置全屏
    screenRef.value.style.transform = `scale(${scaleW}, ${scaleH})`
  } else {
    // 否则选择适配比例缩放
    screenRef.value.style.transform = 'scale(' + scale.value + ')'
  }

  return {
    scale,
		screenRef
  }
}
const transformScaleDelay = debounce(transformScale, 100)

onMounted(() => {
  if (screenRef.value) {
    transformScale()
    window.addEventListener('resize', transformScaleDelay)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', transformScaleDelay)
	clearTimeout(timeId.value)
})
</script>

<template>
  <div class="es-screen-container">
		<div ref="screenRef" class="es-screen">
      <div class="es-screen-header">
        <div class="es-screen-header-left">屏幕：{{ screenSizeStr }}</div>
        <div class="es-screen-header-center">大屏可视化</div>
        <div class="es-screen-header-right">{{ currentTime }}</div>
      </div>
			<div class="es-screen-main">
				<div class="es-screen-left">
					<Left />
				</div>
				<div class="es-screen-center">
          <Center />
				</div>
				<div class="es-screen-right">
					<Right />
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.es-screen-container {
	/* --es-screen-width: 1920px;
  --es-screen-height: 1080px;
	--es-header-height: 72px;
	--es-block-bg: #222733;
	--es-screen-bg: rgb(22, 21, 34);
	--es-screen-text-color: #fff; */
	position: relative;
	margin: 0;
	width: 100%;
	/* height: 100%; */
  height: 100vh;
	background-size: 100% 100%;
	overflow: hidden;
	background: rgb(22, 21, 34);
	color: #fff;
}
.es-screen {
  position: absolute;
  user-select: none;
  top: 50%;
  left: 50%;
  width: 1920px;
  height: 1080px;
  /* margin-left: calc(1920px * 0.5 - 1920px);
  margin-top: calc(1080px * 0.5 - 1080px); */
  margin-left: -960px;
  margin-top: -540px;
  background-size: 100% 100%;
	padding: 0 20px;
}
.es-screen-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  box-sizing: border-box;
  border-bottom: 1px solid #6389e2;
}
.es-screen-header-left {
  font-size: 20px;
}
.es-screen-header-center {
  font-weight: 500;
  font-size: 30px;
}
.es-screen-header-right {
  font-size: 20px;
}
.es-screen-main {
  position: relative;
  display: flex;
  height: calc(100% - 72px);
}
.es-screen-center {
  flex: 1;
  /* width: calc(1920px - 1000px); */
  width: 920px;
}
.es-screen-left, .es-screen-right {
  width: 460px;
}
</style>
