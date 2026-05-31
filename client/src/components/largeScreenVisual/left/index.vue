<template>
	<div ref="containerRef">
        <!-- <div class="es-screen-left-item left1">
            <Left1 />
        </div>
        <div class="es-screen-left-item left2">
            <Left2 />
        </div> -->
        <component
          v-for="item, index in components"
          :key="item.name"
          :is="item.component"
          class="es-screen-left-item"
                :class="`left${index + 1}`"
        >
          {{ item.name }}
        </component>
	</div>
</template>

<script setup>
import { ref, shallowRef } from 'vue'
import { useSortable } from '@/utils/useSortable'
import Left1 from './Left1.vue'
import Left2 from './Left2.vue'

const components = shallowRef([
	{ name: 'left1', component: Left1 },
	{ name: 'left2', component: Left2 }
])

const { containerRef } = useSortable(components)

</script>

<style scoped>
.es-screen-left-item {
	width: 100%;
	height: 430px;
	/* background-color: var(--es-block-bg); */
  background-color: #222733;
	padding: 16px;
  margin-top: 20px;
	animation-name: slide;
}
.es-screen-left-item.left1 {
    height: 550px;
    animation-duration: .8s;
}
.es-screen-left-item.left2 {
    animation-duration: 1.5s;
}

@keyframes slide {
  0% {
    transform: translateX(-100%);
  }
  80% {
    transform: translateX(20px);
  }
  100% {
    transform: translateX(0);
  }
}
</style>