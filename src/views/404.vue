<template>
    <poop-stats/>
  <base-chart :options="option" width="300px" height="300px"/>
</template>


<script setup lang="ts">

import PoopStats from "@/views/poop/PoopStats.vue";
import BaseChart from "@/components/echarts/BaseChart.vue";

// 创建纹理生成函数
function generateTexture(type = 'diagonal', color = '#cccccc', size = 50) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = size;
  canvas.height = size;

  if (ctx) {
    // 背景填充
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, size, size);

    // 根据不同的类型生成不同的纹理
    if (type === 'stripes') {
      generateStripesTexture(ctx, size);
    } else if (type === 'grid') {
      generateGridTexture(ctx, size);
    } else if (type === 'noise') {
      generateNoiseTexture(ctx, size);
    } else {
      // 默认斜纹
      generateStripesTexture(ctx, size);
    }
  }

  // 将 canvas 转换为图片
  const image = new Image();
  image.src = canvas.toDataURL();

  return image;
}

// 生成斜纹纹理
function generateStripesTexture(ctx: CanvasRenderingContext2D, size: number): void {
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  for (let i = -size; i < size; i += 10) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + size, size);
    ctx.stroke();
  }
}

// 生成网格纹理
function generateGridTexture(ctx: CanvasRenderingContext2D, size: number): void {
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;

  // 绘制竖线
  for (let x = 0; x < size; x += 20) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, size);
    ctx.stroke();
  }

  // 绘制横线
  for (let y = 0; y < size; y += 20) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
  }
}

// 生成噪声纹理
function generateNoiseTexture(ctx: CanvasRenderingContext2D, size: number): void {
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const randomColor = Math.floor(Math.random() * 256);
    data[i] = randomColor;     // R
    data[i + 1] = randomColor; // G
    data[i + 2] = randomColor; // B
    data[i + 3] = 255;         // A
  }

  ctx.putImageData(imageData, 0, 0);
}


// 调用生成纹理
const diagonalTexture = generateTexture('stripes', '#ff0000', 10); // 斜线
const gridTexture = generateTexture('grid', '#00ff00', 5); // 网格
const dotsTexture = generateTexture('noise', '#0000ff', 5); // 点阵

// 配置 ECharts 图表
const option = {
  title: {
    text: '多纹理填充示例',
  },
  tooltip: {},
  xAxis: {
    data: ['A', 'B', 'C'],
  },
  yAxis: {},
  series: [
    {
      name: '斜线纹理',
      type: 'bar',
      data: [10, 20, 30],
      itemStyle: {
        color: {
          image: diagonalTexture,
          repeat: 'repeat'
        },
      },
    },
    {
      name: '网格纹理',
      type: 'bar',
      data: [15, 25, 35],
      itemStyle: {
        color: {
          image: gridTexture,
          repeat: 'repeat',
        }
      },
    },
    {
      name: '点阵纹理',
      type: 'bar',
      data: [20, 30, 40],
      itemStyle: {
        color: {
          image: dotsTexture,
          repeat: 'repeat',
        }
      },
    },
  ],
};
</script>

<style scoped>

</style>