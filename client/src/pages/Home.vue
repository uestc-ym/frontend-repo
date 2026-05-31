<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

function change() {
  router.push('/about');
}


</script>

<template>
  <div>
    <div @click="change">home</div>
  </div>
</template>

<style scoped>
</style>
