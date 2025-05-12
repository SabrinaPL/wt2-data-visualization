<script lang="ts" setup>
import * as echarts from 'echarts';
import { ref, onMounted, watch } from 'vue';
import { useGenderStatisticsStore } from '../../stores/genderStatisticsStore';

// Reference to the bar chart container
const chartRef = ref<HTMLDivElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

// Access the store
const genderStatisticsStore = useGenderStatisticsStore();

// Reactive variables
const genreData = ref<{ genre: string; men: number; women: number; undefined: number }[]>([]);

// Fetch and transform data for the bar chart
async function fetchGenreData() {
  await genderStatisticsStore.fetchGenreGenderStatistics();

  const rawData = genderStatisticsStore.genreGenderStatistics;

  // Transform the raw data into a format suitable for the bar chart
  genreData.value = Object.entries(rawData).map(([genre, stats]: [string, any]) => {
    const men = stats.find((item: any) => item.gender === 2)?.count || 0;
    const women = stats.find((item: any) => item.gender === 1)?.count || 0;
    const undefinedGender = stats.find((item: any) => item.gender === 0)?.count || 0;

    return {
      genre,
      men,
      women,
      undefined: undefinedGender,
    };
  });

  console.log('Transformed Genre Data:', genreData.value);
}

// Update the bar chart
function updateChart() {
  if (chartInstance && chartRef.value) {
    const option: echarts.EChartsOption = {
      title: {
        text: 'Movie Gender Statistics by Genre',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        bottom: '10%',
      },
      xAxis: {
        type: 'category',
        data: genreData.value.map((item) => item.genre),
        axisLabel: {
          rotate: 45, // Rotate labels for better readability
        },
      },
      yAxis: {
        type: 'value',
        name: 'Count',
      },
      series: [
        {
          name: 'Men',
          type: 'bar',
          stack: 'total',
          data: genreData.value.map((item) => item.men),
          itemStyle: {
            color: '#2471A3', // Blue
          },
        },
        {
          name: 'Women',
          type: 'bar',
          stack: 'total',
          data: genreData.value.map((item) => item.women),
          itemStyle: {
            color: '#2ECC71', // Green
          },
        },
        {
          name: 'Undefined',
          type: 'bar',
          stack: 'total',
          data: genreData.value.map((item) => item.undefined),
          itemStyle: {
            color: '#F4D03F', // Yellow
          },
        },
      ],
    };

    chartInstance.setOption(option);
  }
}

// Initialize the chart
onMounted(async () => {
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value);
  }

  await fetchGenreData();
  updateChart();
});

// Watch for changes in the store and update the chart
watch(
  () => genderStatisticsStore.genreGenderStatistics,
  async () => {
    await fetchGenreData();
    updateChart();
  }
);
</script>

<template>
  <div class="genre-chart">
    <h1 class="title">Movie Gender Statistics by Genre</h1>
    <div ref="chartRef" style="width: 100%; height: 400px;"></div>
  </div>
</template>

<style scoped>
.genre-chart {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.title {
  font-size: 1.5rem;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
}
</style>