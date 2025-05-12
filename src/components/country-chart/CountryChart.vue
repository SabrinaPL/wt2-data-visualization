<script lang="ts" setup>
import * as echarts from 'echarts';
import { ref, onMounted, watch } from 'vue';
import { countryCodes, getCountryNameByCode } from '../../utils/mapCountryCodes';
import { useGenderStatisticsStore } from '../../stores/genderStatisticsStore';
import type { GenderStatistics } from '../../data/types';

// Reference to the pie chart container
const chartRef = ref<HTMLDivElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

// Reactive variables for country selection and data
const selectedCountry = ref<string>('US'); // Default selected country
const countryData = ref<Record<string, { gender: string; value: number }[]>>({});

const genderStatisticsStore = useGenderStatisticsStore();

async function fetchDataForSelectedCountry() {
  await genderStatisticsStore.fetchCountryGenderStatistics();

  countryData.value = genderStatisticsStore.getStatisticsByCountry(selectedCountry.value);

  console.log('Country data for selected country:', countryData.value);
}
 
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
onMounted(async () => {
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value);
  }

  await fetchDataForSelectedCountry();
  updateChart();
});

// Watch for changes in the selected country and update the chart
watch(selectedCountry, async () => {
  await fetchDataForSelectedCountry();
  updateChart();
});
</script>

<template>
  <div class="country-chart">
    <h1 class="title">Movie Production Country</h1>

    <!-- Dropdown for selecting a country -->
    <div class="country-selector">
      <label for="country" class="country-selector">Select a Country by Country Code:</label>
      <select id="country" v-model="selectedCountry">
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

.title {
  font-size: 1.5rem;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
}

.country-selector {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
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