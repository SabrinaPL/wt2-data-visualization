<script lang="ts" setup>
import * as echarts from 'echarts';
import { ref, onMounted, watch } from 'vue';
import { useGenderStatisticsStore } from '../../stores/genderStatisticsStore';

const chartRef = ref<HTMLDivElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

const genderStatisticsStore = useGenderStatisticsStore();
const yearData = ref<{ year: string; men: number; women: number; undefined: number }[]>([]);
const filteredYearData = ref<{ year: string; men: number; women: number; undefined: number }[]>([]);

const isLoading = ref(true);
const selectedInterval = ref<string>('all'); // Default interval

const intervals = [
  { label: 'All Years', value: 'all' },
  { label: '1970-1980', value: '1970-1980' },
  { label: '1981-1990', value: '1981-1990' },
  { label: '1991-2000', value: '1991-2000' },
  { label: '2001-2010', value: '2001-2010' },
  { label: '2011-2020', value: '2011-2020' },
];

async function fetchYearData() {
  await genderStatisticsStore.fetchYearGenderStatistics();

  const rawData = genderStatisticsStore.yearGenderStatistics;

  console.log('Raw Year Data:', rawData);

  // Transform the raw data into a format suitable for the chart
  yearData.value = rawData
    .map((item: any) => {
      const breakdown = item.breakdown || []; // Access the breakdown array

      const men = breakdown.find((entry: any) => entry.gender === 2)?.count || 0;
      const women = breakdown.find((entry: any) => entry.gender === 1)?.count || 0;
      const undefinedGender = breakdown.find((entry: any) => entry.gender === 0)?.count || 0;

      return {
        year: item.year,
        men,
        women,
        undefined: undefinedGender,
      };
    })
    .sort((a, b) => parseInt(a.year) - parseInt(b.year)); // Sort by year (as suggested by copilot)

  // Initially, show all data
  filteredYearData.value = yearData.value;
}

function updateChart() {
  if (chartInstance && chartRef.value) {
    const option: echarts.EChartsOption = {
      title: {
        text: 'Gender Distribution by Production Year',
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        bottom: '10%',
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: filteredYearData.value.map((item) => item.year),
      },
      yAxis: {
        type: 'value',
        name: 'Count',
      },
      series: [
        {
          name: 'Men',
          type: 'bar',
          data: filteredYearData.value.map((item) => item.men),
          itemStyle: {
            color: '#2471A3',
          },
        },
        {
          name: 'Women',
          type: 'bar',
          data: filteredYearData.value.map((item) => item.women),
          itemStyle: {
            color: '#2ECC71',
          },
        },
        {
          name: 'Undefined',
          type: 'bar',
          data: filteredYearData.value.map((item) => item.undefined),
          itemStyle: {
            color: '#F4D03F',
          },
        },
        {
          name: 'Total',
          type: 'line',
          data: filteredYearData.value.map((item) => item.men + item.women + item.undefined),
          itemStyle: {
            color: '#E74C3C',
          },
        },
      ],
    };

    chartInstance.setOption(option);
  }
}

// Watch for changes in the selected interval and filter the data
watch(selectedInterval, (newInterval) => {
  if (newInterval === 'all') {
    filteredYearData.value = yearData.value;
  } else {
    const [startYear, endYear] = newInterval.split('-').map(Number);
    filteredYearData.value = yearData.value.filter(
      (item) => parseInt(item.year) >= startYear && parseInt(item.year) <= endYear
    );
  }

  // Update the chart with the filtered data
  updateChart();
});

onMounted(async () => {
  isLoading.value = true;

  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value);
  }

  await fetchYearData();
  updateChart();

  isLoading.value = false;
});
</script>

<template>
  <div class="year-chart">
    <h1 class="title">Movie Production Year</h1>

    <!-- Dropdown for selecting year interval -->
    <div class="interval-selector">
      <label for="interval">Select Year Interval:</label>
      <select id="interval" v-model="selectedInterval">
        <option v-for="interval in intervals" :key="interval.value" :value="interval.value">
          {{ interval.label }}
        </option>
      </select>
    </div>

    <!-- Show "Loading..." while chart is loading -->
    <div v-if="isLoading" class="loading">
      <p>Loading chart...</p>
    </div>

    <!-- Bar/Line chart container -->
    <div ref="chartRef" style="width: 100%; height: 600px;"></div>
  </div>
</template>

<style scoped>
.year-chart {
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

.loading {
  font-size: 1.2rem;
  font-weight: bold;
  color: #0098d9;
  text-align: center;
  margin-top: 20px;
}
</style>