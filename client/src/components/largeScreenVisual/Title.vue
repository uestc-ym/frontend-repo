<template>
	<h3 class="es-screen-title">
		<slot>
			{{ title }}
		</slot>
	</h3>
</template>

<script setup>
defineProps(['title'])
</script>

<style scoped>
.es-screen-title {
	position: relative;
	padding-left: 20px;
}
.es-screen-title::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 3px;
    height: 100%;
    /* background-color: var(--es-screen-text-color); */
    background-color: #fff;
}
</style>