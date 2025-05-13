<script lang="ts" setup>
import * as echarts from "echarts";
import { ref, onMounted } from "vue";
import { useGenderStatisticsStore } from "../../stores/genderStatisticsStore";

const chartRef = ref<HTMLDivElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

const genderStatisticsStore = useGenderStatisticsStore();
const companyData = ref<
  { department: string; men: number; women: number; undefined: number }[]
>([]);

const isLoading = ref(true);

async function fetchCompanyData() {
  try {
    await genderStatisticsStore.fetchCompanyGenderStatistics();

    const rawData = genderStatisticsStore.companyGenderStatistics;

    // Transform the raw data into a format suitable for the bar chart
    companyData.value = rawData.map((item: any) => {
      const breakdown = item.breakdown || []; // Access the breakdown array

      const men =
        breakdown.find((entry: any) => entry.gender === 2)?.count || 0;
      const women =
        breakdown.find((entry: any) => entry.gender === 1)?.count || 0;
      const undefined =
        breakdown.find((entry: any) => entry.gender === 0)?.count || 0;

      return {
        company: item.company, // Use the company name
        men,
        women,
        undefined,
      };
    });
  } catch (error) {
    console.error("Error fetching company data:", error);
  }
}

function updateChart() {
  if (chartInstance && chartRef.value) {
    const option: echarts.EChartsOption = {
      title: {
        text: "Gender Distribution by Production Company",
        left: "center",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      legend: {
        bottom: "10%",
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
        name: "Count",
      },
      yAxis: {
        type: "category",
        data: companyData.value.map((item) => item.department), // Company names
      },
      series: [
        {
          name: "Men",
          type: "bar",
          stack: "total",
          data: companyData.value.map((item) => item.men),
          itemStyle: {
            color: "#2471A3",
          },
        },
        {
          name: "Women",
          type: "bar",
          stack: "total",
          data: companyData.value.map((item) => item.women),
          itemStyle: {
            color: "#2ECC71",
          },
        },
        {
          name: "Undefined",
          type: "bar",
          stack: "total",
          data: companyData.value.map((item) => item.undefined),
          itemStyle: {
            color: "#F4D03F",
          },
        },
      ],
    };

    chartInstance.setOption(option);
  }
}

onMounted(async () => {
  isLoading.value = true;

  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value);
  }
  await fetchCompanyData();

  updateChart();

  isLoading.value = false;
});
</script>

<template>
  <div class="company-chart">
    <h1 class="title">Movie Company</h1>

    <!-- Show "Loading..." while chart is loading -->
    <div v-if="isLoading" class="loading">
      <p>Loading bar chart...</p>
    </div>

    <!-- Bar chart container -->
    <div ref="chartRef" style="width: 100%; height: 600px"></div>
  </div>
</template>

<style scoped>
.company-chart {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.loading {
  font-size: 1.5rem;
  font-weight: bold;
  color: #0098d9;
  margin-top: 20px;
  text-align: center;
}

.title {
  font-size: 1.5rem;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
}
</style>
