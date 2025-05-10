<template>
  <div ref="chartRef" class="chart-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as echarts from 'echarts';

const chartRef = ref<HTMLDivElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

onMounted(() => {
  if (chartRef.value) {
    // Initialize the chart
    chartInstance = echarts.init(chartRef.value);

    // Set chart options
    const options: echarts.EChartsOption = {
      title: {
        text: 'ECharts Example',
      },
      tooltip: {},
      xAxis: {
        data: ['A', 'B', 'C', 'D', 'E', 'F'],
      },
      yAxis: {},
      series: [
        {
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20],
        },
      ],
    };

    chartInstance.setOption(options);
  }
});

onBeforeUnmount(() => {
  // Dispose of the chart instance to prevent memory leaks
  if (chartInstance) {
    chartInstance.dispose();
  }
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
}
</style>