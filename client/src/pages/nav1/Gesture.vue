<script setup>
import { useRouter } from 'vue-router';
import { onMounted, reactive, ref } from 'vue';

const router = useRouter();
const canvasRef = ref(null);
const statusText = ref('请输入手势密码');
const isActive = ref(false);
const data = reactive({
  points: [],       // 九宫格坐标点
  selected: [],     // 已选中的点
});

onMounted(() => {
  initCanvas();
})

const initCanvas = () => {
    const canvas = canvasRef.value;
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const size = 300  // 画布大小
        const margin = 30 // 边距
        const radius = 20 // 圆点半径

        // 计算九宫格坐标
        for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
                data.points.push({
                x: margin + j * (size - 2*margin)/2,
                y: margin + i * (size - 2*margin)/2,
                index: i * 3 + j
            })
          }
        }

        // 绘制初始状态
        drawPoints(ctx)
    }
  }

// 触摸事件处理
const handleTouchStart = (e) =>  {
  checkTouchPoint(e.touches[0])
}

const handleTouchMove = (e) => {
  checkTouchPoint(e.touches[0])
}

const handleTouchEnd = () => {
  const canvas = canvasRef.value;
  const ctx = canvas.getContext('2d');
  // 密码验证逻辑
  if (data.selected.length >= 4) { //TODO 校验手势密码
    statusText.value = '密码验证成功';
    isActive.value = true;
    drawLine(ctx);
    drawPoints(ctx);
  } else {
    statusText.value = '至少连接4个点';
  }
  // 初始化
  setTimeout(() => {
      data.selected = [];
      statusText.value = '请输入手势密码';
      isActive.value = false;
      redrawCanvas();
  }, 1000);
}

// 检查触摸点
const checkTouchPoint = (touch) => {
  const canvas = canvasRef.value;
  const ctx = canvas.getContext('2d');

  const padX = 0; // canvas画布在视窗中的起始位置的x坐标
  const padY = 40; // canvas画布在视窗中的起始位置的y坐标

  let { clientX: x, clientY: y } = touch;
  x = x - padX;
  y = y - padY;
  
  data.points.forEach((point, index) => {
    const distance = Math.sqrt(Math.pow(x - point.x, 2) + Math.pow(y - point.y, 2))
    if (distance <= 20 && !data.selected.includes(index)) {
      data.selected.push(index)
    }
  })

  drawLine(ctx);
  drawPoints(ctx);
}

// 绘制九宫格圆点
const drawPoints = (ctx) => {
  data.points.forEach((point, index) => {
    ctx.beginPath()
    ctx.arc(point.x, point.y, 20, 0, 2 * Math.PI)
    ctx.fillStyle = data.selected.includes(index) ? isActive.value ? '#5ab75a' : '#ef6326' : '#dddddd'
    ctx.fill()
  })
}

// 绘制连接线
const drawLine = (ctx) => {
  if (data.selected.length < 2) return

  ctx.strokeStyle = isActive.value ? '#5ab75a' : '#ef6326';
  ctx.beginPath()
  
  data.selected.forEach((index, i) => {
    const point = data.points[index]
    i === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y)
  })
  
  ctx.stroke()
}

// 重绘画布
const redrawCanvas = () => {
  const canvas = canvasRef.value;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, 300, 300)
  drawPoints(ctx)
}
</script>

<template>
  <div>
    <div class="text-wrap" :class="{ 'active': isActive }">{{ statusText }}</div>
    <canvas class="gesture-canvas" width="300" height="300" ref="canvasRef" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd"></canvas>
  </div>
</template>

<style scoped>
.text-wrap {
    width: 300px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #ef6326;
}
.gesture-canvas {
  width: 300px;
  height: 300px;
}
.active {
    color:#5ab75a;
}
</style>
