/**
 * This component visualizes gender distribution data by movie genre
 * using a bar chart.
 */
<script lang="ts" setup>
import * as echarts from "echarts";
import { ref, onMounted, watch } from "vue";
import { useGenderStatisticsStore } from "../../stores/genderStatisticsStore";

// Reference to the bar chart container
const chartRef = ref<HTMLDivElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

// Access the store
const genderStatisticsStore = useGenderStatisticsStore();

// Reactive variables
const selectedGenre = ref<string>("Action"); // Default selected genre
const selectedViewMode = ref<string>("count"); // Default view mode (count or percentage)
const genreData = ref<{ men: number; women: number; undefined: number }>({
  men: 0,
  women: 0,
  undefined: 0,
});

const isLoading = ref(true);

/**
 * Fetch and transform data for the selected genre.
 */
async function fetchGenreData() {
  try {
    await genderStatisticsStore.fetchGenreGenderStatistics();

    const rawData = genderStatisticsStore.genreGenderStatistics.find(
      (item: any) => item.genre === selectedGenre.value
    );

    if (!rawData || !rawData.breakdown) {
      console.error(
        "No data available for the selected genre:",
        selectedGenre.value
      );
      genreData.value = { men: 0, women: 0, undefined: 0 };
      return;
    }

    // Transform the breakdown data based on the selected view mode
    genreData.value = {
      men:
        selectedViewMode.value === "count"
          ? rawData.breakdown.find((entry: any) => entry.gender === 2)?.count ||
            0
          : rawData.breakdown.find((entry: any) => entry.gender === 2)
              ?.percentage || 0,
      women:
        selectedViewMode.value === "count"
          ? rawData.breakdown.find((entry: any) => entry.gender === 1)?.count ||
            0
          : rawData.breakdown.find((entry: any) => entry.gender === 1)
              ?.percentage || 0,
      undefined:
        selectedViewMode.value === "count"
          ? rawData.breakdown.find((entry: any) => entry.gender === 0)?.count ||
            0
          : rawData.breakdown.find((entry: any) => entry.gender === 0)
              ?.percentage || 0,
    };
  } catch (error) {
    console.error("Error fetching genre data:", error);
  }
}

/**
 * Updates the chart with the latest data.
 */
function updateChart() {
  if (chartInstance && chartRef.value) {
    const option: echarts.EChartsOption = {
      title: {
        text: `Gender Distribution for ${selectedGenre.value} (${selectedViewMode.value})`,
        left: "center",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        formatter: (params: any) => {
          const unit =
            selectedViewMode.value === "count" ? "Count" : "Percentage";
          return `${params[0].name}: ${params[0].value} ${unit}`;
        },
      },
      xAxis: {
        type: "category",
        data: ["Men", "Women", "Undefined"],
      },
      yAxis: {
        type: "value",
        name: selectedViewMode.value === "count" ? "Count" : "Percentage",
      },
      series: [
        {
          name: selectedViewMode.value === "count" ? "Count" : "Percentage",
          type: "bar",
          data: [
            genreData.value.men,
            genreData.value.women,
            genreData.value.undefined,
          ],
          itemStyle: {
            color: (params: any) => {
              const colors = ["#2471A3", "#2ECC71", "#F4D03F"]; // Blue, Green, Yellow
              return colors[params.dataIndex];
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

  await fetchGenreData();
  updateChart();

  isLoading.value = false;
});

// Watch for changes in the selected genre or view mode and update the chart
watch([selectedGenre, selectedViewMode], async () => {
  await fetchGenreData();
  updateChart();
});
</script>

<template>
  <div class="genre-chart">
    <h1 class="title">Movie Genre</h1>

    <!-- Dropdowns for selecting a genre and view mode -->
    <div class="selectors">
      <div class="genre-selector">
        <label for="genre">Select a Genre:</label>
        <select id="genre" v-model="selectedGenre">
          <option
            v-for="item in genderStatisticsStore.genreGenderStatistics"
            :key="item.genre"
            :value="item.genre"
          >
            {{ item.genre }}
          </option>
        </select>
      </div>

      <div class="view-mode-selector">
        <label for="view-mode">View Mode:</label>
        <select id="view-mode" v-model="selectedViewMode">
          <option value="count">Count</option>
          <option value="percentage">%</option>
        </select>
      </div>
    </div>

    <!-- Show "Loading..." while chart is loading -->
    <div v-if="isLoading" class="loading">
      <p>Loading bar chart...</p>
    </div>

    <!-- Bar chart container -->
    <div ref="chartRef" style="width: 100%; height: 400px"></div>
  </div>
</template>

<style scoped>
.genre-chart {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
