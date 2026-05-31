<script setup>
import { RouterLink, RouterView } from 'vue-router'
import 'ant-design-vue/dist/reset.css'
import Menu from '@/components/Menu.vue'


</script>

<template>
  <!-- <RouterLink to="/">Go to Home</RouterLink>
  <RouterLink to="/about">Go to About</RouterLink> -->
  <div class="pageWrap">
    <Menu />
    <RouterView></RouterView>
  </div>
</template>

<style scoped>
.pageWrap {
  display: flex;
}
</style>
