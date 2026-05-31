<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

function change() {
  router.push('/');
}

</script>

<template>
  <div>
    <div @click="change">about</div>
  </div>
</template>

<style scoped>
</style>
