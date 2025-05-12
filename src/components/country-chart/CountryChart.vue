<script lang="ts" setup>
import * as echarts from 'echarts';
import { ref, onMounted, watch } from 'vue';
import { countryCodes, getCountryNameByCode } from '../../data/countryCodes';

// Reference to the pie chart container
const chartRef = ref<HTMLDivElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

// Reactive variables for country selection and data
const selectedCountry = ref<string>('USA'); // Default selected country
const countryData = ref<Record<string, { gender: string; value: number }[]>>({
  USA: [
    { gender: 'Male', value: 60 },
    { gender: 'Female', value: 40 },
  ],
  France: [
    { gender: 'Male', value: 55 },
    { gender: 'Female', value: 45 },
  ],
  Japan: [
    { gender: 'Male', value: 70 },
    { gender: 'Female', value: 30 },
  ],
});

// Pie Chart (inspired by example code from: https://echarts.apache.org/examples/en/editor.html?c=pie-simple&lang=ts)
function updateChart() {
  if (chartInstance && chartRef.value) {
    const data = countryData.value[selectedCountry.value] || [];
    const option: echarts.EChartsOption = {
      title: {
        text: `Gender Distribution in ${getCountryNameByCode(selectedCountry.value)}`,
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        bottom: '10%',
        left: 'center',
      },
      series: [
        {
          name: 'Gender Distribution',
          type: 'pie',
          radius: '50%',
          data: data.map((item) => ({
            value: item.value,
            name: item.gender,
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
    chartInstance.setOption(option);
  }
}

// Initialize the chart
onMounted(() => {
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value);
    updateChart();
  }
});

// Watch for changes in the selected country and update the chart
watch(selectedCountry, () => {
  updateChart();
});
</script>

<template>
  <div class="country-chart">
    <h1 class="text-xl font-bold text-center mb-4">Movie Production Country</h1>

    <!-- Dropdown for selecting a country -->
    <div class="country-selector text-center mb-4">
      <label for="country" class="mr-2">Select a Country by Country Code:</label>
      <select id="country" v-model="selectedCountry" class="border rounded px-2 py-1">
        <option v-for="code in countryCodes" :key="code" :value="code">
          {{ code }}
        </option>
      </select>
    </div>

    <!-- Pie chart container -->
    <div ref="chartRef" style="width: 100%; height: 400px;"></div>
  </div>
</template>

<style scoped>
.country-chart {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.country-selector select {
  font-size: 1rem;
}
</style>


<!-- // Colors for the pie charts
const genderColors: Record<string, string> = {
  men: '#2471A3',
  women: '#2ECC71',
  undefined: '#F4D03F', 
} -->