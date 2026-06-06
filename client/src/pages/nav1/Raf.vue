<template>
    <div class="demo-container">
      <h2>requestAnimationFrame 分片渲染对比</h2>
      
      <!-- 控制面板 -->
      <div class="controls">
        <button @click="renderWithoutRAF" :disabled="isRendering">
          ❌ 一次性渲染 5000 条
        </button>
        <button @click="renderWithRAF" :disabled="isRendering">
          ✅ RAF 分片渲染 5000 条
        </button>
        <button @click="clearList" :disabled="isRendering">
          🗑️ 清空列表
        </button>
      </div>
  
      <!-- 性能指标 -->
      <div class="metrics">
        <div class="metric-card">
          <div class="metric-label">数据量</div>
          <div class="metric-value">{{ dataCount }} 条</div>
        </div>
        <div class="metric-card" :class="{ 'slow': renderTime > 100 }">
          <div class="metric-label">渲染耗时</div>
          <div class="metric-value">{{ renderTime }} ms</div>
        </div>
        <div class="metric-card" :class="{ 'slow': fps < 50 }">
          <div class="metric-label">预估 FPS</div>
          <div class="metric-value">{{ fps }} fps</div>
        </div>
        <div class="metric-card" v-if="chunkCount > 0">
          <div class="metric-label">分片次数</div>
          <div class="metric-value">{{ chunkCount }}</div>
        </div>
      </div>
  
      <!-- 列表容器 -->
      <div class="list-container" ref="listContainer">
        <div v-for="(item, index) in displayList" :key="index" class="list-item">
          <div class="item-index">{{ item.id }}</div>
          <div class="item-content">
            <div class="item-title">{{ item.title }}</div>
            <div class="item-desc">{{ item.description }}</div>
          </div>
          <div class="item-value">¥{{ item.amount }}</div>
        </div>
        
        <!-- 加载状态 -->
        <div v-if="isRendering" class="loading-indicator">
          <div class="spinner"></div>
          <span>渲染中... {{ progress }}%</span>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, nextTick } from 'vue'
   let a = 111
  // 响应式数据
  const displayList = ref([])
  const isRendering = ref(false)
  const renderTime = ref(0)
  const dataCount = ref(0)
  const fps = ref(60)
  const chunkCount = ref(0)
  const progress = ref(0)
  
  const listContainer = ref(null)
  
  // 生成 mock 数据（5000条）
  const generateMockData = (count = 5000) => {
    const data = []
    for (let i = 0; i < count; i++) {
      data.push({
        id: i + 1,
        title: `交易记录 ${i + 1}`,
        description: `这是第 ${i + 1} 条交易记录的详细描述内容，包含一些文本信息用于测试渲染性能`,
        amount: (Math.random() * 10000).toFixed(2),
        date: `2024-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`
      })
    }
    return data
  }
  
  // 模拟复杂 DOM 操作（每个 item 额外处理）
  const complexDOMOperation = () => {
    // 模拟一些耗时的样式计算
    const temp = document.body.offsetHeight
    // 模拟重排触发
    if (listContainer.value) {
      const rect = listContainer.value.getBoundingClientRect()
      return rect.width
    }
    return 0
  }
  
  // ❌ 方式1：一次性渲染（会卡顿）
  const renderWithoutRAF = async () => {
    if (isRendering.value) return
    
    isRendering.value = true
    renderTime.value = 0
    chunkCount.value = 0
    progress.value = 0
    
    // 清空当前列表
    displayList.value = []
    await nextTick()
    
    const data = generateMockData(5000)
    const startTime = performance.now()
    
    // 模拟开始渲染前的一些复杂计算
    for (let i = 0; i < 1000; i++) {
      complexDOMOperation()
    }
    
    // 一次性渲染所有数据
    // ⚠️ 这里会一次性创建 5000 个 DOM 节点，导致页面卡死
    displayList.value = data
    dataCount.value = data.length
    
    await nextTick()
    
    const endTime = performance.now()
    renderTime.value = (endTime - startTime).toFixed(2)
    
    // 计算 FPS（模拟：耗时越长，FPS越低）
    const estimatedFPS = Math.max(0, Math.min(60, Math.floor(1000 / (renderTime.value / 30))))
    fps.value = estimatedFPS
    
    isRendering.value = false
    
    // 提示用户
    if (renderTime.value > 100) {
      alert(`一次性渲染完成！耗时 ${renderTime.value}ms，页面卡顿了 ${(renderTime.value / 1000).toFixed(1)} 秒`)
    }
  }
  
  // ✅ 方式2：RAF 分片渲染（流畅）
  const renderWithRAF = async () => {
    if (isRendering.value) return
    
    isRendering.value = true
    renderTime.value = 0
    chunkCount.value = 0
    progress.value = 0
    
    // 清空当前列表
    displayList.value = []
    await nextTick()
    
    const data = generateMockData(5000)
    const startTime = performance.now()
    
    // 分片配置
    const CHUNK_SIZE = 50        // 每批渲染50条
    const CHUNK_DELAY = 0        // 延迟（使用RAF自然间隔）
    
    let currentIndex = 0
    const allData = [...data]
    const tempList = []
    
    // 分片渲染函数
    const renderChunk = () => {
      const chunkStartTime = performance.now()
      let renderedInThisChunk = 0
      
      // 渲染一批数据（不阻塞主线程）
      while (currentIndex < allData.length && renderedInThisChunk < CHUNK_SIZE) {
        // 模拟每个 item 的复杂操作（比如样式计算、数据处理）
        complexDOMOperation()
        
        tempList.push(allData[currentIndex])
        currentIndex++
        renderedInThisChunk++
        
        // 检查是否超时（防止单次耗时过长）
        const elapsed = performance.now() - chunkStartTime
        if (elapsed > 12) {
          // 超过12ms，让出主线程
          break
        }
      }
      
      // 更新显示列表（触发 Vue 响应式更新）
      displayList.value = [...tempList]
      dataCount.value = displayList.value.length
      
      // 更新进度
      progress.value = (currentIndex / allData.length * 100).toFixed(1)
      chunkCount.value++
      
      // 继续渲染下一批
      if (currentIndex < allData.length) {
        requestAnimationFrame(renderChunk)
      } else {
        // 渲染完成
        const endTime = performance.now()
        renderTime.value = (endTime - startTime).toFixed(2)
        
        // 计算平均 FPS
        const totalTime = endTime - startTime
        const estimatedFPS = Math.floor((allData.length / CHUNK_SIZE) / (totalTime / 1000))
        fps.value = Math.min(60, Math.max(30, estimatedFPS))
        
        isRendering.value = false
        progress.value = 100
        
        console.log(`RAF分片渲染完成！总耗时 ${renderTime.value}ms，分片数 ${chunkCount.value}`)
      }
    }
    
    // 启动分片渲染（使用 requestAnimationFrame）
    requestAnimationFrame(renderChunk)
  }
  
  // 清空列表
  const clearList = () => {
    if (isRendering.value) {
      alert('请等待当前渲染完成')
      return
    }
    displayList.value = []
    dataCount.value = 0
    renderTime.value = 0
    fps.value = 60
    chunkCount.value = 0
    progress.value = 0
  }
  </script>
  
  <style scoped>
  .demo-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  h2 {
    color: #333;
    margin-bottom: 20px;
  }
  
  .controls {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }
  
  .controls button {
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 500;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .controls button:first-child {
    background-color: #ff6b6b;
    color: white;
  }
  
  .controls button:first-child:hover:not(:disabled) {
    background-color: #ff5252;
    transform: translateY(-1px);
  }
  
  .controls button:nth-child(2) {
    background-color: #51cf66;
    color: white;
  }
  
  .controls button:nth-child(2):hover:not(:disabled) {
    background-color: #40c057;
    transform: translateY(-1px);
  }
  
  .controls button:nth-child(3) {
    background-color: #868e96;
    color: white;
  }
  
  .controls button:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  
  .controls button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  .metrics {
    display: flex;
    gap: 16px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }
  
  .metric-card {
    flex: 1;
    min-width: 120px;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 8px;
    text-align: center;
    transition: all 0.3s;
  }
  
  .metric-card.slow {
    background-color: #fff3f3;
    border-left: 3px solid #ff6b6b;
  }
  
  .metric-label {
    font-size: 12px;
    color: #868e96;
    margin-bottom: 8px;
  }
  
  .metric-value {
    font-size: 24px;
    font-weight: bold;
    color: #495057;
  }
  
  .list-container {
    height: 500px;
    overflow-y: auto;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    background: white;
    position: relative;
  }
  
  .list-item {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #f1f3f5;
    transition: background-color 0.2s;
  }
  
  .list-item:hover {
    background-color: #f8f9fa;
  }
  
  .item-index {
    width: 60px;
    font-weight: 600;
    color: #4dabf7;
    font-size: 14px;
  }
  
  .item-content {
    flex: 1;
    margin-left: 12px;
  }
  
  .item-title {
    font-weight: 500;
    color: #212529;
    margin-bottom: 4px;
    font-size: 14px;
  }
  
  .item-desc {
    font-size: 12px;
    color: #adb5bd;
    line-height: 1.4;
  }
  
  .item-value {
    font-weight: 600;
    color: #fa5252;
    font-size: 14px;
    font-family: monospace;
  }
  
  .loading-indicator {
    position: sticky;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 12px;
    background: rgba(248, 249, 250, 0.95);
    backdrop-filter: blur(4px);
    border-top: 1px solid #e9ecef;
    font-size: 14px;
    color: #4dabf7;
  }
  
  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid #e9ecef;
    border-top-color: #4dabf7;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  /* 滚动条样式 */
  .list-container::-webkit-scrollbar {
    width: 8px;
  }
  
  .list-container::-webkit-scrollbar-track {
    background: #f1f3f5;
  }
  
  .list-container::-webkit-scrollbar-thumb {
    background: #adb5bd;
    border-radius: 4px;
  }
  
  .list-container::-webkit-scrollbar-thumb:hover {
    background: #868e96;
  }
  </style>