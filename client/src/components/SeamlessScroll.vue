<template>
	<div class="es-seamless-scroll">
		<div ref="listRef" class="es-seamless-scroll-list">
			<slot />
		</div>
	</div>
</template>

<script setup>
import { useSeamlessScroll } from '@/utils/useSeamlessScroll'
import { ref } from 'vue'

defineProps(['width', 'height', 'option'])
const listRef = ref()
const option = {}
useSeamlessScroll(listRef, option)

</script>

<style scoped>
.es-seamless-scroll {
	overflow: hidden;
	width: 100%;
	height: 100%;
}
</style>