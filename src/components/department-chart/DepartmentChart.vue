/**
 * This component is used to visualize gender distribution data 
 * by movie department in the form of a bar chart.
 */
<script lang="ts" setup>
import * as echarts from "echarts";
import { ref, onMounted, watch } from "vue";
import { useGenderStatisticsStore } from "../../stores/genderStatisticsStore";

const chartRef = ref<HTMLDivElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

const genderStatisticsStore = useGenderStatisticsStore();
const departmentData = ref<
  {
    department: string;
    men: number;
    women: number;
    undefined: number;
    menCount: number;
    womenCount: number;
    undefinedCount: number;
  }[]
>([]);
const selectedMode = ref<string>("percentage"); // Default mode is percentage

const isLoading = ref(true);

/**
 * Funnction to fetch and transform department data for the bar chart.
 */
async function fetchDepartmentData() {
  try {
    await genderStatisticsStore.fetchDepartmentGenderStatistics();

    const rawData = genderStatisticsStore.departmentGenderStatistics;

    // Transform the raw data into a format suitable for the bar chart
    departmentData.value = rawData.map((item: any) => {
      const breakdown = item.breakdown || []; // Access the breakdown array

      const men =
        breakdown.find((entry: any) => entry.gender === 2)?.percentage || 0;
      const women =
        breakdown.find((entry: any) => entry.gender === 1)?.percentage || 0;
      const undefined =
        breakdown.find((entry: any) => entry.gender === 0)?.percentage || 0;

      const menCount =
        breakdown.find((entry: any) => entry.gender === 2)?.count || 0;
      const womenCount =
        breakdown.find((entry: any) => entry.gender === 1)?.count || 0;
      const undefinedCount =
        breakdown.find((entry: any) => entry.gender === 0)?.count || 0;

      return {
        department: item.department, // Use the department name
        men,
        women,
        undefined,
        menCount,
        womenCount,
        undefinedCount,
      };
    });
  } catch (error) {
    console.error("Error fetching department data:", error);
  }
}

/**
 * Updates the chart with the latest data.
 */
function updateChart() {
  if (chartInstance && chartRef.value) {
    const option: echarts.EChartsOption = {
      title: {
        text: `Gender Distribution by Department (${selectedMode.value === "percentage" ? "Percentage" : "Count"})`,
        left: "center",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        formatter: (params: any) => {
          const unit = selectedMode.value === "percentage" ? "%" : "Count";
          return params
            .map((item: any) => `${item.seriesName}: ${item.value} ${unit}`)
            .join("<br>");
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
        name: selectedMode.value === "percentage" ? "%" : "Count",
        max: selectedMode.value === "percentage" ? 100 : undefined,
      },
      yAxis: {
        type: "category",
        data: departmentData.value.map((item) => item.department), // Department names
      },
      series: [
        {
          name: "Men",
          type: "bar",
          stack: "total",
          data: departmentData.value.map((item) =>
            selectedMode.value === "percentage" ? item.men : item.menCount
          ),
          itemStyle: {
            color: "#2471A3",
          },
        },
        {
          name: "Women",
          type: "bar",
          stack: "total",
          data: departmentData.value.map((item) =>
            selectedMode.value === "percentage" ? item.women : item.womenCount
          ),
          itemStyle: {
            color: "#2ECC71",
          },
        },
        {
          name: "Undefined",
          type: "bar",
          stack: "total",
          data: departmentData.value.map((item) =>
            selectedMode.value === "percentage"
              ? item.undefined
              : item.undefinedCount
          ),
          itemStyle: {
            color: "#F4D03F",
          },
        },
      ],
    };

    chartInstance.setOption(option);
  }
}

// Watch for changes in the selected mode and update the chart
watch(selectedMode, () => {
  updateChart();
});

onMounted(async () => {
  isLoading.value = true;

  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value);
  }
  await fetchDepartmentData();

  updateChart();

  isLoading.value = false;
});
</script>

<template>
  <div class="department-chart">
    <h1 class="title">Movie Department</h1>

    <!-- Dropdown for toggling between percentage and count -->
    <div class="mode-selector">
      <label for="mode">Display Mode:</label>
      <select id="mode" v-model="selectedMode">
        <option value="percentage">Percentage</option>
        <option value="count">Count</option>
      </select>
    </div>

    <!-- Show "Loading..." while chart is loading -->
    <div v-if="isLoading" class="loading">
      <p>Loading bar chart...</p>
    </div>

    <!-- Bar chart container -->
    <div ref="chartRef" style="width: 100%; height: 600px"></div>
  </div>
</template>

<style scoped>
.department-chart {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.mode-selector {
  margin-bottom: 20px;
  text-align: center;
}

.mode-selector label {
  margin-right: 10px;
  font-size: 1rem;
}

.mode-selector select {
  font-size: 1rem;
  padding: 5px;
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
