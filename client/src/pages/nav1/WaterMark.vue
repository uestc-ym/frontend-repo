<script setup>
// 参考资料：https://juejin.cn/post/7414333479091240975
import { onMounted, onBeforeUnmount, ref } from 'vue';
import watermarkImg from '@/assets/image/watermark.jpg';

// -- 暗水印-层叠透明水印
// -- 暗水印-最低有效位（LSB）嵌入法
// -- 水印的防篡改策略

let uploadDom = null;
let lbsUploadDom = null;

onMounted(() => {
    // drawWatermark('user 123', 0.5);
    drawWatermark(); // 默认暗水印

    // 水印的防篡改策略
    setupMutationObserver(); // 防止水印节点被删除
    setupAttributeObserver(); // 防止水印样式被修改
    setupLayerObserver(); // 防止水印被覆盖

    // decode watermark image
    uploadDom = document.getElementById('upload');
    lbsUploadDom = document.getElementById('lbsUpload');

    uploadDom.addEventListener('change', handleDecode);
    lbsUploadDom.addEventListener('change', handleLbsDecode);
})

onBeforeUnmount(() => {
    uploadDom.removeEventListener('change', handleDecode);
    lbsUploadDom.removeEventListener('change', handleLbsDecode);
})

const drawWatermark = (text = 'user 123', opacity = 0.005) => {
    const canvas = document.getElementById('watermarkCanvas');
    const ctx = canvas.getContext('2d');
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    ctx.font = '2em Arial';
    ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`; // Semi-transparent color
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.globalCompositeOperation = 'source-over'; // Default

    // Draw multiple layers of watermark
    for (let y = 0; y < height; y += 100) {
      for (let x = 0; x < width; x += 100) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((-30 * Math.PI) / 180); // Rotate for better effect
        ctx.fillText(text, 0, 0);
        ctx.restore();
      }
    }
}

const setupMutationObserver = () => {
  const targetNode = document.querySelector('.watermarkCanvas');
  const observer = new MutationObserver(() => {
    drawWatermark('user 123', 0.5)
  });

  observer.observe(targetNode, { childList: true, subtree: true });
}

const ensureCanvasVisibility = () => {
  const canvas = document.querySelector('.watermarkCanvas');
  if (canvas) {
    const style = window.getComputedStyle(canvas);
    // 确保 Canvas 始终可见
    if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0) {
      canvas.style.display = 'block';
      canvas.style.visibility = 'visible';
    //   canvas.style.opacity = '1';
      drawWatermark('user 123', 0.5); // 重新绘制水印
    }
  }
}

const setupAttributeObserver = () => {
  const targetNode = document.querySelector('.watermarkCanvas');
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
        ensureCanvasVisibility();
      }
    });
  });

  observer.observe(targetNode, { attributes: true, subtree: true });
}

const ensureCanvasOnTop = (defaultMaxZIndex = 1000) => {
  const canvas = document.querySelector('.watermarkCanvas');
  if (canvas) {
    // 获取所有元素的最高 z-index
    let maxZIndex = Array.from(document.querySelectorAll('body *'))
      .map(el => parseFloat(window.getComputedStyle(el).zIndex))
      .filter(zIndex => !isNaN(zIndex))
      .reduce((max, zIndex) => Math.max(max, zIndex), defaultMaxZIndex);

    // 只有在发现新的最大 z-index 超过默认值时，才更新 canvas 的 z-index
    if (maxZIndex >= defaultMaxZIndex) {
      canvas.style.zIndex = maxZIndex + 1;
    }
  }
}

const setupLayerObserver = () => {
  const targetNode = document.querySelector('.watermarkCanvas');
  if (targetNode) {
    const observer = new MutationObserver(() => {
      ensureCanvasOnTop();
    });

    observer.observe(targetNode, { attributes: true, childList: true, subtree: true });
  }
}

const handleDecode = (event) => {
    const file = event.target.files[0];
    const img = new Image();
    const canvas = document.getElementById('decodeCanvas');
    const ctx = canvas.getContext('2d');
    const reader = new FileReader();

    reader.onload = function (e) {
      img.src = e.target.result;
    };

    img.onload = function () {
      // 重复绘制的次数
      const deCount = 4;
      const canvasWidth = canvas.width || img.width;
      const canvasHeight = canvas.height || img.height;

      // Clear the canvas
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // Calculate aspect ratio and scaling
      const scaleWidth = canvasWidth / img.width;
      const scaleHeight = canvasHeight / img.height;
      const scale = Math.min(scaleWidth, scaleHeight);

      // Calculate positioning to center the image
      const x = canvasWidth / 2 - (img.width / 2) * scale;
      const y = canvasHeight / 2 - (img.height / 2) * scale;

      // Draw the image on the fixed-size canvas
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

      // Enhance the hidden watermark
      ctx.save();
      ctx.globalCompositeOperation = 'overlay'; // Enhance watermark visibility
      ctx.fillStyle = '#000'; // Semi-transparent color for enhancement
      for (let i = 0; i < deCount; i++) {
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      }
      ctx.restore();
    };

    reader.readAsDataURL(file);
}

const handleLbsDecode = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const img = new Image(); 
        img.onload = function() {
            const canvas = document.getElementById('lbsDecodeCanvas');
            const ctx = canvas.getContext('2d', { willReadFrequently: true }); 
            canvas.width = img.width; // 设置canvas的宽度和高度以适应图片
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const extractedWatermarkValue = extractWatermark(imageData); // 提取水印

            document.getElementById('lbsDecodeWatermark').innerHTML = `
            extractedWatermarkValue : ${extractedWatermarkValue}
            `
        };

        img.src = e.target.result;
    };

    reader.readAsDataURL(file); 
}

const lbsEmbed = () => {
    const canvas = document.getElementById('lbsCanvas');
    const context = canvas.getContext('2d', { willReadFrequently: true });
    const image = new Image();

    image.src = watermarkImg; // 注意图片引入的格式，确保路径正确

    image.onerror = function(e) {
        console.log(e);
    }

    image.onload = function () {
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);

        const watermark = "ym123";
        const hashValue = hash(watermark);
        
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height); // getImageData 提取图片像素信息

        embedWatermark(imageData, hashValue); // lbs嵌入水印信息
        
        context.putImageData(imageData, 0, 0); // 重新绘制imageData

        document.getElementById('lbsWatermark').innerHTML = `
        watermark : ${watermark} </br>
        embed hash value : ${hashValue}
        `
    };
}

const hash = (text) => {
    var hash = 0, i, chr;
    if (text.length === 0) return hash;
    for (i = 0; i < text.length; i++) {
        chr = text.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return hash;
}

const embedWatermark = (image, hashValue) => {
    var pixels = image.data;
    var pixelIndex = 0;
    for (var i = 0; i < 32; i++) {
        var bitValue = (hashValue >> i) & 1;
        var pixelValue = pixels[pixelIndex];
        var newPixelValue = pixelValue & 254 | bitValue;
        pixels[pixelIndex] = newPixelValue;
        pixelIndex += 4;
    }
}

const extractWatermark = (image) => {
    var pixels = image.data;
    var pixelIndex = 0;
    var hashValue = 0;
    for (var i = 0; i < 32; i++) {
        var bitValue = pixels[pixelIndex] & 1;
        hashValue |= bitValue << i;
        pixelIndex += 4;
    }
    return hashValue;
}

const lbsDownload = () => {
    const canvas = document.getElementById("lbsCanvas");
    
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'canvas_image.png';
    link.click();
}

</script>

<template>
  <div>
    <canvas id="watermarkCanvas" class="watermarkCanvas"></canvas>
    <div>
        <h2>This is a watermark example</h2>
    </div>
    <div class="content">
        <div class="decode-wrap">
            <h2>This is watermark image decode</h2>
            <input type="file" id="upload" accept="image/*" />
            <canvas id="decodeCanvas" class="decodeCanvas" width="500" height="500"></canvas>
        </div>
        <div class="lbs-wrap">
            <div class="lbs-action">
                <button style="margin-right: 10px" @click="lbsEmbed">lbs嵌入式水印生成</button>
                <button style="margin-right: 10px" @click="lbsDownload">下载图片</button>
                <label class="lbsUplodLabel" for="lbsUpload">lbs解码<input style="display: none;" type="file" id="lbsUpload" accept="image/*" /></label>
            </div>
            <div class="lbs-content">
                <div style="margin-right: 10px;">
                    <canvas id="lbsCanvas" width="200" height="200"></canvas>
                    <div id="lbsWatermark"></div>
                </div>
                <div>
                    <canvas id="lbsDecodeCanvas" width="200" height="200"></canvas>
                    <div id="lbsDecodeWatermark"></div>
                </div>
            </div>
        </div>        
    </div>
  </div>
</template>

<style scoped>
.watermarkCanvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none; /* Allows interaction with elements below canvas */
    z-index: -1; /* Ensure canvas is behind content */
}
.content {
    margin-top: 50px;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
}
.decode-wrap, .lbs-wrap {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start; 
    margin-right: 50px;
}
.lbsUplodLabel {
    box-sizing: border-box;
    border: 1px solid #767676;
    width: 60px;
    background: #efefef;
    font-size: 16px;
    font-weight: normal;
    border-radius: 3px;
    padding: 2px;
    text-align: center
}
.lbs-content {
    display: flex;
}
</style>
