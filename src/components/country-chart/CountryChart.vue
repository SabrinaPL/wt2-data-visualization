<script lang="ts" setup>
import * as echarts from "echarts";
import { ref, onMounted, watch } from "vue";
import {
  countryCodes,
  getCountryNameByCode,
} from "../../utils/mapCountryCodes";
import { useGenderStatisticsStore } from "../../stores/genderStatisticsStore";

// Reference to the pie chart container
const chartRef = ref<HTMLDivElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

// Reactive variables
const countryData = ref<Record<string, { gender: string; value: number }[]>>(
  {}
);
const selectedViewMode = ref("count"); // Default view mode ('count' or 'percentage')

const genderStatisticsStore = useGenderStatisticsStore();

// Map gender codes to labels
const genderMapping: Record<number, string> = {
  0: "undefined",
  1: "women",
  2: "men",
};

const genderColors: Record<string, string> = {
  men: "#2471A3",
  women: "#2ECC71",
  undefined: "#F4D03F",
};

const isLoading = ref(true);

async function fetchDataForSelectedCountry() {
  try {
    await genderStatisticsStore.fetchCountryGenderStatistics();

    const rawData = genderStatisticsStore.getStatisticsByCountry(
      genderStatisticsStore.selectedCountry
    );

    if (!rawData || !rawData.breakdown) {
      console.error(
        "No data available for the selected country:",
        genderStatisticsStore.selectedCountry
      );
      countryData.value = {};
      return;
    }

    // Transform the breakdown data
    countryData.value[genderStatisticsStore.selectedCountry] =
      rawData.breakdown.map(
        (item: { gender: number; count: number; percentage: number }) => ({
          gender: genderMapping[item.gender],
          value:
            selectedViewMode.value === "count" ? item.count : item.percentage,
        })
      );
  } catch (error) {
    console.error("Error fetching country data:", error);
  }
}

// Pie Chart (inspired by example code from: https://echarts.apache.org/examples/en/editor.html?c=pie-simple&lang=ts)
function updateChart() {
  if (chartInstance && chartRef.value) {
    const option: echarts.EChartsOption = {
      title: {
        text: `Gender Distribution in ${getCountryNameByCode(genderStatisticsStore.selectedCountry)} (${selectedViewMode.value})`,
        left: "center",
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        bottom: "10%",
        left: "center",
      },
      series: [
        {
          name: "Gender Distribution",
          type: "pie",
          radius: "50%",
          data: countryData.value[genderStatisticsStore.selectedCountry].map(
            (item) => ({
              value: item.value,
              name: item.gender,
              itemStyle: {
                color: genderColors[item.gender],
              },
            })
          ),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
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
  isLoading.value = true;

  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value);
  }

  await fetchDataForSelectedCountry();
  updateChart();

  isLoading.value = false;
});

// Watch for changes in the selected country and update the chart
watch(
  [() => genderStatisticsStore.selectedCountry, () => selectedViewMode.value],
  async () => {
    await fetchDataForSelectedCountry();
    updateChart();
  }
);
</script>

<template>
  <div class="country-chart">
    <h1 class="title">Movie Production Country</h1>

    <!-- Dropdown for selecting a country -->
    <div class="country-selector">
      <label for="country" class="country-selector"
        >Select a Country by Country Code:</label
      >
      <select id="country" v-model="genderStatisticsStore.selectedCountry">
        <option v-for="code in countryCodes" :key="code" :value="code">
          {{ code }}
        </option>
      </select>
    </div>

    <div class="view-mode-selector">
      <label for="view-mode" class="view-mode-selector">View Mode:</label>
      <select id="view-mode" v-model="selectedViewMode">
        <option value="count">Count</option>
        <option value="percentage">%</option>
      </select>
    </div>

    <!-- Show "Loading..." while map is loading -->
    <div v-if="isLoading" class="loading">
      <p>Loading pie chart...</p>
    </div>

    <!-- Pie chart container -->
    <div ref="chartRef" style="width: 100%; height: 400px"></div>
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

.loading {
  font-size: 1.5rem;
  font-weight: bold;
  color: #0098d9;
  margin-top: 20px;
  text-align: center;
}

.country-selector,
.view-mode-selector {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.country-selector select {
  font-size: 1rem;
}
</style>
