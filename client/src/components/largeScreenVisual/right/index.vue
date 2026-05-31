<template>
	<div ref="containerRef">
		<component
			v-for="item, index in components"
			:key="item.name"
			:is="item.component"
			class="es-screen-right-item"
            :class="`right${index + 1}`"
		>
			{{ item.name }}
		</component>
	</div>
</template>

<script setup>
import { ref, shallowRef } from 'vue'
import { useSortable } from '@/utils/useSortable'
import Right1 from './Right1.vue'
import Right2 from './Right2.vue'
import Right3 from './Right3.vue'

const components = shallowRef([
	{ name: 'right1', component: Right1 },
	{ name: 'right2', component: Right2 },
	{ name: 'right3', component: Right3 }
])

const { containerRef } = useSortable(components)

</script>

<style scoped>
.es-screen-right-item {
	width: 100%;
	height: 320px;
	/* background-color: var(--es-block-bg); */
    background-color: #222733;
	padding: 16px;
    margin-top: 20px;
	animation-name: slide;
}
.es-screen-right-item.right1 {
    animation-duration: 0.5s;
}
.es-screen-right-item.right2 {
    animation-duration: 1s;
}
.es-screen-right-item.right3 {
    animation-duration: 1.5s;
}

@keyframes slide {
  0% {
    transform: translateX(100%);
  }
  80% {
    transform: translateX(-20px);
  }
  100% {
    transform: translateX(0);
  }
}
</style>