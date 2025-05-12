<script lang="ts" setup>
import * as echarts from 'echarts';
import worldJson from '../../public/map/world.json';
import countryCoordinates from '../../../countryCoordinates.json';
import { useGenderStatisticsStore } from '../../stores/genderStatisticsStore';
import { ref, onMounted, onBeforeUnmount } from 'vue';

// Reference to the map container
const mapRef = ref<HTMLDivElement | null>(null);
let chartInstance: echarts.ECharts | null = null;

const genderStatisticsStore = useGenderStatisticsStore();

const isLoading = ref(true);

// Function to create pie series for each country (inspired by example code from: https://echarts.apache.org/examples/en/editor.html?c=map-usa-pie&lang=ts)
function createPieSeries(center: [number, number], radius: number, data: any[]): echarts.PieSeriesOption {
  return {
    type: 'pie',
    coordinateSystem: 'geo',
    tooltip: {
      formatter: '{b}: {c} ({d}%)',
    },
    label: {
      show: false,
    },
    labelLine: {
      show: false,
    },
    radius,
    center,
    data: data.map((item) => ({
      value: item.value,
      name: item.gender,
    })),
  };
}

// Initialize the map chart
onMounted(async () => {
  isLoading.value = true; 

  // Fetch the gender statistics data via the service class
  await genderStatisticsStore.fetchCountryGenderStatistics();

  // TODO:
  // Log the cached data from the store
  console.log('Cached country gender data: ', genderStatisticsStore.countryGenderStatistics);
  
// Example data for gender statistics by country
const genderStatistics = [
  { country: 'AU', genderData: [{ gender: 'male', value: 60 }, { gender: 'female', value: 40 }] },
  { country: 'FR', genderData: [{ gender: 'male', value: 55 }, { gender: 'female', value: 45 }] },
  { country: 'JP', genderData: [{ gender: 'male', value: 70 }, { gender: 'female', value: 30 }] },
];

  if (mapRef.value) {
    chartInstance = echarts.init(mapRef.value);

    // Register the world map
    echarts.registerMap('world', worldJson as any);

    // Create pie series for each country
    const series = genderStatistics
      .map((stat) => {
        const coordinates = countryCoordinates[stat.country as keyof typeof countryCoordinates];
        if (Array.isArray(coordinates) && coordinates.length == 2) {
          return createPieSeries(coordinates as [number, number], 10, stat.genderData);
        }
        return null;
      })
      .filter((item): item is echarts.PieSeriesOption => item !== null); // Type assertion to filter out null values

    // Set the chart options
    const option: echarts.EChartsOption = {
      geo: {
        map: 'world',
        roam: true,
        itemStyle: {
          areaColor: '#e7e8ea',
          borderColor: '#111',
        },
        emphasis: {
          itemStyle: {
            areaColor: '#DAF7A6',
          },
        },
      },
      tooltip: {},
      series,
    };

    chartInstance.setOption(option);
  }

  // Event listener for click events on the map
  chartInstance?.on('click', (params) => {
    if (params.componentType === 'geo') {
      const countryName = params.name;
      // TODO: map country name to country code - chart modal to pop up with country statistics when country is clicked?
      console.log('Clicked country:', countryName);
    }
  })

  isLoading.value = false; // Set loading to false after the chart is initialized
});

// Dispose of the chart instance on unmount
onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose();
  }
});
</script>

<template>
  <div class="map-chart">
    <h1 id="country-title">Gender Distribution by Production Country</h1>

    <!-- Show "Loading..." while map is loading -->
    <div v-if="isLoading" class="loading">
      <p>Loading...</p>
    </div>

    <!-- Map container -->
    <div id="map" ref="mapRef" style="width: 100%; height: 500px;"></div>
  </div>
</template>

<style scoped>
.map-chart {
  width: 100%;
  height: 100%;
}

.loading {
  font-size: 1.5rem;
  font-weight: bold;
  color: #0098d9;
  margin-top: 20px;
  text-align: center;
}

#country-title {
  font-size: 1.5rem;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
}
</style>