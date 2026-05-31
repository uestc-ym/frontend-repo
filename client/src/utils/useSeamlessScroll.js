import { ref, onMounted, onUpdated, onBeforeUpdate, watch, nextTick } from 'vue'
import anime from 'animejs/lib/anime.es.js'

export function useSeamlessScroll(listRef, options) {
    const animation = ref(null)
	const transList = []

	function init() {
		const {
			direction = 'horizontal',
			gap = 10,
			duration = 10000
		} = options
		const isHorizontal = direction === 'horizontal'

		const translateKey = isHorizontal ? 'translateX' : 'translateY'

		const transKey = isHorizontal ? 'x' : 'y'

		// items
		const children = listRef.value?.children || []
		if (!children.length) return

		// 第一个元素
		const firstEl =  children[0]
		const firstDiff = (isHorizontal ? firstEl.offsetWidth : firstEl.offsetHeight ) + gap

		// 默认将list元素向左或向上移动一个item的距离
		listRef.value.style.transform = `${translateKey}(-${firstDiff}px)`


		let total = 0 // 总宽/高
		// 设置初始位置
		anime.set(children, {
			[translateKey]: (el, i) => {
				const distance = (isHorizontal ? el.offsetWidth : el.offsetHeight ) + gap
				total += distance
				transList[i] = { [transKey]: total - distance }
			}
		})
		// 设置list容器的宽或高
		listRef.value.style[isHorizontal ? 'width' : 'height'] = total + 'px'

		// 添加动画
		animation.value = anime({
			targets: transList,
			duration,
			easing: 'linear',
			direction: isHorizontal ? undefined : 'reverse',
			[transKey]: `+=${total}`,
			loop: true,
			update: () => {
				anime.set(children, {
					[translateKey]: (el, i) => {
						return transList[i][transKey] % total
					}
				})
			}
		})
	}

	watch(() => options, () => {
		// 移除上一次的
		animation.value.remove(transList)
		nextTick(() => {
			// 重新初始化
			init()
		})
	}, { deep: true })

	onBeforeUpdate(() => {
		// 移除上一次的
		animation.value.remove(transList)
	})
	onUpdated(() => {
		// 重新初始化
		init()
	})
	// 暂停
	function pause() {
		animation.value.pause()
	}
	// 停止
	function play() {
		animation.value.play()
	}

	onMounted(() => {
		init()
	})

	return {
		listRef,
		pause,
		play,
		animation
	}
}