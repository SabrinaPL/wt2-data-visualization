<script lang="ts" setup>
import * as echarts from 'echarts';
import { ref, onMounted } from 'vue';
import { useGenderStatisticsStore } from '../../stores/genderStatisticsStore';

const chartRef = ref<HTMLDivElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

const genderStatisticsStore = useGenderStatisticsStore();
const departmentData = ref<{ department: string; men: number; women: number; undefined: number }[]>([]);

async function fetchDepartmentData() {
  await genderStatisticsStore.fetchDepartmentGenderStatistics();

  const rawData = genderStatisticsStore.departmentGenderStatistics;

  console.log('Raw Department Data:', rawData);

  // Transform the raw data into a format suitable for the bar chart
  departmentData.value = rawData.map((item: any) => {
    const breakdown = item.breakdown || []; // Access the breakdown array

    const men = breakdown.find((entry: any) => entry.gender === 2)?.count || 0;
    const women = breakdown.find((entry: any) => entry.gender === 1)?.count || 0;
    const undefined = breakdown.find((entry: any) => entry.gender === 0)?.count || 0;

    return {
      department: item.department, // Use the department name
      men,
      women,
      undefined,
    };
  });

  console.log('Transformed Department Data:', departmentData.value);
}

onMounted(async () => {
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value);
  }
  await fetchDepartmentData();
});
</script>

<template>
  <div class="department-chart">
    <h1 class="title">Gender Distribution by Department</h1>
    <div ref="chartRef" style="width: 100%; height: 600px;"></div>
  </div>
</template>

<style scoped>
.department-chart {
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